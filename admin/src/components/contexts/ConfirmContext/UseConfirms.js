import { useContext } from "react";
import { ConfirmContext } from "./ConfirmContext";

function useConfirmContext(hookName) {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error(`${hookName} must be used inside ConfirmDeleteProvider`);
  }

  return context;
}

// Typed confirmation
export function useConfirmDelete() {
  return useConfirmContext("useConfirmDelete").confirmDelete;
}

// Plain confirmation
export function useConfirm() {
  return useConfirmContext("useConfirm").confirm;
}
