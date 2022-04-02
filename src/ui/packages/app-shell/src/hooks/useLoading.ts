/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react';

export type LoadingError = {
  message: string;
  error: any;
};

/**
 * Utility to automate loading state for async activity inside
 * of a component
 */
export const useLoading = () => {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadCount, setLoadCount] = useState(0);
  const [loadingError, setLoadingError] = useState<LoadingError>();

  // Don't set loading to false initially
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
    } else {
      setLoading(loadCount !== 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadCount]);

  /**
   * Resets the loading error manually.
   * Note: This is often not necessessary as the error is automatically reset on the next load attempt
   */
  const resetLoadingError = () => setLoadingError(undefined);

  /**
   * Tracks loading state while a promise is pending
   */
  function loadingWhile<TPromise extends Promise<unknown>>(
    promise: TPromise
  ): TPromise;
  /**
   * Tracks loading state while the callback's promise is pending
   */
  function loadingWhile<TPromise extends Promise<unknown>>(
    callback: () => TPromise
  ): TPromise;
  function loadingWhile<TPromise extends Promise<unknown>>(
    promiseOrCallback: TPromise | (() => TPromise)
  ): TPromise {
    if (loadCount === 0) {
      setLoadingError(undefined);
    }
    setLoadCount((lc) => lc + 1);
    const promise =
      typeof promiseOrCallback === 'function'
        ? promiseOrCallback()
        : promiseOrCallback;
    promise
      .catch((error) => {
        setLoadingError({
          message:
            typeof error === 'string'
              ? error
              : error?.message || 'Unknown error',
          error,
        });
      })
      .finally(() => setLoadCount((lc) => lc - 1));
    return promise;
  }

  /**
   * Tracks loading state while an async effect is firing
   */
  function useLoadingEffect(
    callback: () => Promise<void>,
    deps: React.DependencyList
  ) {
    // If a component uses `useLoadingEffect', then their default loading state
    // should be "true" to prevent a flash of not-loading, then loading once the async
    // effect kicks in
    // This is a workaround to that problem. Taking this out causes loading/not-loading flashes on initial page loads
    if (!initialized && !loading) setLoading(true);
    useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      loadingWhile(callback());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps]);
  }

  /**
   * Creates a handler that automatically tracks loading state when the callback is fired
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function loadingHandler<TArgs extends any[], TReturn extends Promise<any>>(
    handler: (...args: TArgs) => TReturn
  ) {
    return (...args: TArgs) => loadingWhile<TReturn>(handler(...args));
  }

  /**
   * Creates a callback that automatically tracks loading state when the callback is fired
   * shorthand for useCallback(loadHandler(() => {...}))
   */
  function useLoadingCallback<
    TArgs extends any[],
    TReturn extends Promise<any>
  >(callback: (...args: TArgs) => TReturn, deps: React.DependencyList) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(loadingHandler(callback), deps);
  }

  return {
    loading,
    loadingError,
    resetLoadingError,
    loadingWhile,
    loadingHandler,
    useLoadingEffect,
    useLoadingCallback,
  } as const;
};
