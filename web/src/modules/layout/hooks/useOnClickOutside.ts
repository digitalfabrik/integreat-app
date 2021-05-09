import { useEffect } from "react";

const useOnClickOutside = (ref: {
  current: HTMLElement | null | undefined;
}, callback: () => void) => {
  useEffect(() => {
    const isOutside = (target: EventTarget) => {
      return target instanceof Node && ref.current && !ref.current.contains(target);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (isOutside(event.target)) {
        callback();
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      const KEY_ENTER = 13;
      const KEY_ESCAPE = 27;

      if (event.keyCode === KEY_ESCAPE) {
        callback();
      } else if (event.keyCode === KEY_ENTER && isOutside(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [ref, callback]);
};

export default useOnClickOutside;