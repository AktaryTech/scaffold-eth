import { useEffect, useRef } from 'react';

// helper hook to call a function regularly in time intervals

export default function usePoller(fn: any, delay: number, extraWatch: boolean) {
  const savedCallback = useRef();
  // Remember the latest fn.
  useEffect(() => {
    savedCallback.current = fn;
  }, [fn]);
  // Set up the interval.
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    console.log('tick');
    function tick() {
      const cb: any = savedCallback.current;
      if (cb)
        cb();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return;
  }, [delay]);
  // run at start too
  useEffect(() => {
    fn();
    // eslint-disable-next-line
  }, [extraWatch]);
}
