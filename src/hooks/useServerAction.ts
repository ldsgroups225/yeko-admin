"use client";

import { useState } from "react";
import { toast } from "sonner";

type ServerActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

type ServerActionFunction<T = unknown, P = unknown> = (
  ...args: P[]
) => Promise<ServerActionResult<T>>;

interface UseServerActionOptions<T = unknown> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
}

export function useServerAction<T = unknown, P = unknown>(
  action: ServerActionFunction<T, P>,
  options: UseServerActionOptions<T> = {},
) {
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = async (...args: P[]): Promise<ServerActionResult<T>> => {
    setIsPending(true);
    setError(null);

    try {
      const result = await action(...args);

      if (result.success) {
        setData(result.data ?? null);
        setError(null);

        if (result.data !== undefined) {
          options.onSuccess?.(result.data);
        }

        if (options.showToast !== false && options.successMessage) {
          toast.success(options.successMessage);
        }

        return { success: true, data: result.data };
      } else {
        const errorMsg = result.error || "Une erreur inconnue s'est produite";
        setError(errorMsg);
        setData(null);

        if (options.showToast !== false) {
          toast.error(options.errorMessage || errorMsg);
        }

        options.onError?.(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Une erreur inattendue s'est produite";

      setError(errorMsg);
      setData(null);

      if (options.showToast !== false) {
        toast.error(options.errorMessage || errorMsg);
      }

      options.onError?.(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsPending(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
  };

  return {
    execute,
    isPending,
    data,
    error,
    reset,
  };
}
