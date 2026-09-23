import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const ConfirmContext = createContext(null);

function isMatch(input, expected) {
  return input.trim() === String(expected).trim();
}

// One modal serves both dialogs. The request decides which: with `expected` the
// word has to be typed, without it the confirm button is enough.
export const ConfirmDeleteProvider = ({ children }) => {
  const [request, setRequest] = useState(null);
  const [input, setInput] = useState("");
  const [showError, setShowError] = useState(false);
  const resolveRef = useRef(null);
  const inputRef = useRef(null);
  const cancelRef = useRef(null);

  const isOpen = request !== null;
  const needsTyping = Boolean(request?.expected);

  const close = useCallback((result) => {
    resolveRef.current?.(result);
    resolveRef.current = null;
    setRequest(null);
    setInput("");
    setShowError(false);
  }, []);

  const open = useCallback((next) => {
    // A second call while one is pending cancels the first rather than leaving
    // its caller waiting forever.
    resolveRef.current?.(false);
    setRequest(next);
    setInput("");
    setShowError(false);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const confirmDelete = useCallback(
    (name, { title = "Confirm deletion", confirmLabel = "Delete" } = {}) =>
      open({ title, confirmLabel, expected: name }),
    [open]
  );

  const confirm = useCallback(
    ({ title = "Are you sure?", message, confirmLabel = "Delete" }) =>
      open({ title, message, confirmLabel, expected: null }),
    [open]
  );

  useEffect(() => {
    if (!isOpen) return;
    // Focus lands on Cancel for the plain dialog, so Enter can't confirm a
    // destructive action by accident.
    if (needsTyping) inputRef.current?.focus();
    else cancelRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") close(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, needsTyping, close]);

  function onSubmitHandler(event) {
    event.preventDefault();

    if (!needsTyping) {
      close(true);
      return;
    }

    if (isMatch(input, request.expected)) {
      close(true);
    } else {
      setShowError(true);
      inputRef.current?.select();
    }
  }

  const value = useMemo(
    () => ({ confirmDelete, confirm }),
    [confirmDelete, confirm]
  );

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={() => close(false)}
          >
            <form
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-dialog-title"
              onClick={(event) => event.stopPropagation()}
              onSubmit={onSubmitHandler}
              className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 text-blue-950 shadow-xl dark:bg-gray-800 dark:text-gray-100"
            >
              <h2 id="confirm-dialog-title" className="text-lg font-semibold">
                {request.title}
              </h2>

              {needsTyping ? (
                <>
                  <p className="text-gray-500 dark:text-gray-400">
                    This action cannot be undone. To confirm, type{" "}
                    <strong className="select-all text-blue-950 dark:text-gray-100">
                      {request.expected}
                    </strong>
                  </p>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(event) => {
                      setInput(event.target.value);
                      setShowError(false);
                    }}
                    autoComplete="off"
                    className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-gray-600"
                  />
                  {showError && (
                    <p className="text-red-600 dark:text-red-400">
                      That doesn&apos;t match. Please try again.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  {request.message}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  ref={cancelRef}
                  type="button"
                  onClick={() => close(false)}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50 hover:cursor-pointer dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 hover:cursor-pointer"
                >
                  {request.confirmLabel}
                </button>
              </div>
            </form>
          </div>,
          document.body
        )}
    </ConfirmContext.Provider>
  );
};

function useConfirmContext(hookName) {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error(`${hookName} must be used inside ConfirmDeleteProvider`);
  }
  return context;
}

// Typed confirmation: the caller's word has to be entered exactly.
export function useConfirmDelete() {
  return useConfirmContext("useConfirmDelete").confirmDelete;
}

// Plain yes/no confirmation.
export function useConfirm() {
  return useConfirmContext("useConfirm").confirm;
}
