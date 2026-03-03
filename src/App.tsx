import { useState } from "react";
import { Dialog } from "./components/dialog/dialog";
import "./App.css";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <h1>Modalith</h1>

      <div className="card">
        <button onClick={() => setOpen(true)}>Open Dialog</button>
      </div>

      {/* <Dialog open={open} onClose={() => setOpen(false)} width={520}>
        <Dialog.Header>
          <h2 style={{ margin: 0 }}>Dialog Title</h2>
        </Dialog.Header>
        <Dialog.Body>
          <p>This dialog uses the native &lt;dialog&gt; element with <code>showModal()</code>.</p>
          <p>Try pressing <kbd>Escape</kbd> or clicking the backdrop to close it.</p>
        </Dialog.Body>
        <Dialog.Footer>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button onClick={() => setOpen(false)}>Cancel</button>
            <button onClick={() => setOpen(false)}>Confirm</button>
          </div>
        </Dialog.Footer>
      </Dialog> */}

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
    </>
  );
}

export default App;
