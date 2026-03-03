# Modalith — Dialog

A lightweight React modal primitive built on the native HTML `<dialog>` element. No dependencies beyond React. Two files — drop them in and go.

## Why native `<dialog>`?

- The browser handles the **top-layer** — no z-index wars
- **`::backdrop`** is a real CSS pseudo-element — no extra DOM node for the overlay
- **Escape key** is handled natively via the `cancel` event
- **Focus trap** is built into `showModal()` — no extra library needed
- Fully accessible out of the box (`role="dialog"`, `aria-modal`)

---

## Installation

This component is designed to be copied directly into your project. Copy both files:

```
dialog.tsx
dialog.css
```

Then import from wherever you placed them:

```tsx
import { Dialog } from './components/dialog/dialog'
```

---

## Basic usage

```tsx
import { useState } from 'react'
import { Dialog } from './components/dialog/dialog'

function App() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Header>
          <h2>Title</h2>
        </Dialog.Header>
        <Dialog.Body>
          <p>Dialog content goes here.</p>
        </Dialog.Body>
        <Dialog.Footer>
          <button onClick={() => setOpen(false)}>Close</button>
        </Dialog.Footer>
      </Dialog>
    </>
  )
}
```

---

## Slots

The compound component API gives you three optional layout slots. Use any combination — or none at all.

| Slot | Element | Default padding |
|------|---------|-----------------|
| `<Dialog.Header>` | `div.modalith-dialog-header` | `16px 20px`, bottom border |
| `<Dialog.Body>` | `div.modalith-dialog-body` | `20px` |
| `<Dialog.Footer>` | `div.modalith-dialog-footer` | `12px 20px`, top border |

```tsx
{/* Header + body only — no footer */}
<Dialog open={open} onClose={close}>
  <Dialog.Header><h2>Alert</h2></Dialog.Header>
  <Dialog.Body><p>Something happened.</p></Dialog.Body>
</Dialog>

{/* No slots — fully custom layout */}
<Dialog open={open} onClose={close}>
  <div style={{ padding: 24 }}>
    <p>I control my own layout.</p>
  </div>
</Dialog>
```

Each slot also accepts a `className` prop for targeted overrides:

```tsx
<Dialog.Footer className="my-footer">...</Dialog.Footer>
```

---

## API

### `<Dialog>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Controls whether the dialog is open |
| `onClose` | `() => void` | — | Called when the dialog requests to close |
| `children` | `ReactNode` | — | Dialog content |
| `closeOnBackdrop` | `boolean` | `true` | Controls both backdrop clicks **and** the Escape key |
| `appearFrom` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Entry animation direction |
| `width` | `number` | `520` | Max width in pixels — pass a plain number, not a string (`width={640}`, not `width="640px"`) |
| `className` | `string` | — | Extra class on the `<dialog>` element |
| `style` | `CSSProperties` | — | Inline styles forwarded to `<dialog>` |
| `container` | `HTMLElement \| null` | `document.body` | DOM node the portal mounts into |

### `<Dialog.Header>` / `<Dialog.Body>` / `<Dialog.Footer>`

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Slot content |
| `className` | `string` | Extra class on the wrapper div |

---

## Examples

### Locked dialog — no Escape, no backdrop close

```tsx
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  closeOnBackdrop={false}
>
  <Dialog.Body>
    <p>You must click a button to dismiss this.</p>
    <button onClick={() => setOpen(false)}>Got it</button>
  </Dialog.Body>
</Dialog>
```

### Slide in from the right (drawer style)

```tsx
<Dialog open={open} onClose={close} appearFrom="right" width={400}>
  <Dialog.Header><h2>Settings</h2></Dialog.Header>
  <Dialog.Body>...</Dialog.Body>
</Dialog>
```

### Mount into a custom container

Useful when the dialog needs to live inside a specific scroll container or a shadow root.

```tsx
<Dialog
  open={open}
  onClose={close}
  container={document.getElementById('modal-root')}
>
  ...
</Dialog>
```

---

## Styling

The component uses plain CSS with a `modalith-` prefix — no CSS Modules, no runtime injection. Styles only load when you import the component.

### CSS custom properties

Override these on `.modalith-dialog` to theme globally or per-instance:

```css
.modalith-dialog {
  --dialog-width:  520px;   /* also controlled by the width prop */
  --dialog-radius: 8px;
  --dialog-shadow: /* ... */;
}
```

### Targeting slots

```css
.modalith-dialog-header { /* header area */ }
.modalith-dialog-body   { /* body area   */ }
.modalith-dialog-footer { /* footer area */ }
```

### Backdrop

Styled via the native `::backdrop` pseudo-element — no extra DOM node needed:

```css
.modalith-dialog::backdrop {
  background-color: oklch(0.4 0.023 173 / 0.25);
  backdrop-filter: blur(1px);
}
```

---

## Browser support

Requires native `<dialog>` support. Covered by all modern browsers (Chrome 37+, Firefox 98+, Safari 15.4+). No polyfill is included.
