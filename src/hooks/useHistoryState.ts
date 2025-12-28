import { useCallback, useState } from "react";

export interface HistoryState<T> {
  present: T;
  set: (next: T | ((prev: T) => T)) => void;
  replace: (next: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
}

export function useHistoryState<T>(initial: T): HistoryState<T> {
  const [present, setPresent] = useState<T>(initial);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  const set = useCallback((next: T | ((prev: T) => T)) => {
    setPresent((prev) => {
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      setPast((p) => [...p, prev].slice(-80));
      setFuture([]);
      return resolved;
    });
  }, []);

  const replace = useCallback((next: T) => {
    setPresent(next);
  }, []);

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const previous = p[p.length - 1];
      setPresent((current) => {
        setFuture((f) => [current, ...f].slice(0, 80));
        return previous;
      });
      return p.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0];
      setPresent((current) => {
        setPast((p) => [...p, current].slice(-80));
        return next;
      });
      return f.slice(1);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setPast([]);
    setFuture([]);
  }, []);

  return {
    present,
    set,
    replace,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    clearHistory,
  };
}
