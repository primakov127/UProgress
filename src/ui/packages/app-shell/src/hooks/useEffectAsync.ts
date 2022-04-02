import { useEffect } from 'react';

export const useEffectAsync = (
  callback: () => Promise<void>,
  deps: React.DependencyList
) => {
  useEffect(() => {
    const doWork = async () => {
      await callback();
    };
    doWork();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
