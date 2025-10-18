import { useEffect, useState } from "react";

export function useDebounce(
  value: string,
  delay: number,
  disableOnEmpty: boolean = false
) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (disableOnEmpty && !value) {
      setDebouncedValue("");
      return;
    }
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay, disableOnEmpty]);

  return debouncedValue;
}
