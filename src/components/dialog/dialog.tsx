import { useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode, CSSProperties, MouseEvent } from 'react';
import './dialog.css';

// ── Types ──────────────────────────────────────────────────────────────────

export interface DialogProps {
  /** Controls whether the dialog is open */
  open: boolean;
  /** Fired when the dialog requests to close (Escape key or backdrop click) */
  onClose: () => void;
  /** Dialog content — use Dialog.Header, Dialog.Body, Dialog.Footer */
  children: ReactNode;
  /**
   * Whether casual dismissal gestures close the dialog.
   * Controls both backdrop clicks and the Escape key. @default true
   */
  closeOnBackdrop?: boolean;
  /** Additional class name applied to the <dialog> element */
  className?: string;
  /** Entry animation direction @default 'top' */
  appearFrom?: 'top' | 'right' | 'bottom' | 'left';
  /** Max width of the dialog in pixels @default 520 */
  width?: number;
  /** Inline styles forwarded to the <dialog> element */
  style?: CSSProperties;
  /**
   * DOM node the portal is mounted into. @default document.body
   * Useful when the dialog must live inside a specific container or shadow root.
   */
  container?: HTMLElement | null;
}

interface SlotProps {
  children: ReactNode;
  className?: string;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function DialogHeader({ children, className = '' }: SlotProps) {
  return (
    <div className={['modalith-dialog-header', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

function DialogBody({ children, className = '' }: SlotProps) {
  return (
    <div className={['modalith-dialog-body', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

function DialogFooter({ children, className = '' }: SlotProps) {
  return (
    <div className={['modalith-dialog-footer', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

// ── Root component ─────────────────────────────────────────────────────────

function DialogRoot({
  open,
  onClose,
  children,
  closeOnBackdrop = true,
  className = '',
  appearFrom = 'top',
  width = 520,
  style,
  container,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  // Keep refs current so the stable cancel handler always reads latest values.
  // useLayoutEffect (not render) is required by React 19's refs lint rule.
  const onCloseRef = useRef(onClose);
  const closeOnBackdropRef = useRef(closeOnBackdrop);
  const openRef = useRef(open);
  useLayoutEffect(() => {
    onCloseRef.current = onClose;
    closeOnBackdropRef.current = closeOnBackdrop;
    openRef.current = open;
  });

  // Sync open state with the native dialog API
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Native <dialog> fires 'cancel' on Escape — stable handler via refs so the
  // listener is never torn down/re-added when onClose changes identity.
  // closeOnBackdrop controls both Escape and backdrop clicks.
  //
  // We also listen to 'close' to handle Chrome's Close Watcher behavior:
  // after one prevented 'cancel', Chrome bypasses the cancel event on the
  // next Escape and fires 'close' directly. If that happens while we still
  // want the dialog open, we immediately re-open it with showModal().
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault(); // prevent browser from closing it; we control state
      if (!closeOnBackdropRef.current) return;
      onCloseRef.current();
    };

    const handleClose = () => {
      // Only relevant when the browser force-closes (bypasses cancel).
      // If React already set open=false, openRef is false here — we skip.
      if (openRef.current && !closeOnBackdropRef.current) {
        dialog.showModal(); // re-open: closeOnBackdrop=false must hold
      }
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('close', handleClose);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('close', handleClose);
    };
  }, []); // stable — reads latest values via refs

  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (!closeOnBackdrop) return;
    // The <dialog> element itself is the backdrop — a click on the element
    // but not on its children means the user clicked the backdrop.
    if (e.target === ref.current) {
      onClose();
    }
  };

  return createPortal(
    <dialog
      ref={ref}
      className={['modalith-dialog', className].filter(Boolean).join(' ')}
      aria-modal="true"
      data-appear-from={appearFrom}
      style={{ '--dialog-width': `${width}px`, ...style } as CSSProperties}
      onClick={handleBackdropClick}
    >
      <div className="modalith-dialog__content">
        {children}
      </div>
    </dialog>,
    container ?? document.body
  );
}

// ── Compound export ────────────────────────────────────────────────────────

export const Dialog = Object.assign(DialogRoot, {
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
});

export default Dialog;
