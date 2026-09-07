import { useState, useEffect } from "react";

/**
 * Hook personalizado para retrasar la ejecución de consultas (Debounce 1 a 1)
 * Evita la saturación del servidor disparando 1 sola consulta al pausar la escritura.
 */
export function useDebounce<T>(value: T, delay: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
