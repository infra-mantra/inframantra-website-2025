import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Router from "next/router";
import styles from "./Shortlist.module.css";

/*
  One small toast at the bottom of the screen ("Saved to your shortlist · View",
  "Removed · Undo"). It mounts its own React root the first time it is used, so no
  provider is needed in _app.js. The wrapper is role="status" so screen readers
  announce each message politely.
*/

const DURATION = 4500;
let root = null;
let push = null; // set by the mounted <Toast/>
let pending = null; // a message that arrived before <Toast/> mounted

function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    push = (opts) => setToast({ ...opts, id: Date.now() });
    if (pending) {
      push(pending);
      pending = null;
    }
    return () => {
      push = null;
    };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), DURATION);
    return () => clearTimeout(t);
  }, [toast]);

  const go = (e) => {
    e.preventDefault();
    setToast(null);
    Router.push(toast.href);
  };

  return (
    <div className={styles.toastRegion} role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className={styles.toast}>
          <span className={styles.toastMsg}>{toast.message}</span>
          {toast.href && (
            <a href={toast.href} onClick={go} className={styles.toastAction}>
              {toast.linkText || "View"}
            </a>
          )}
          {toast.onAction && (
            <button
              type="button"
              className={styles.toastAction}
              onClick={() => {
                toast.onAction();
                setToast(null);
              }}
            >
              {toast.actionText || "Undo"}
            </button>
          )}
          <button
            type="button"
            className={styles.toastClose}
            aria-label="Dismiss"
            onClick={() => setToast(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export function showToast(opts) {
  if (!root) {
    const el = document.createElement("div");
    el.id = "shortlist-toast-root";
    document.body.appendChild(el);
    root = createRoot(el);
    root.render(<Toast />);
  }
  if (push) push(opts);
  else pending = opts;
}
