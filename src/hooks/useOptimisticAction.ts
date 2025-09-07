"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

type OptimisticUpdate<T> = (
  currentState: T[],
  optimisticValue: Partial<T>,
) => T[];

interface UseOptimisticActionOptions<T> {
  onSuccess?: (data: T[] | null) => void;
  onError?: (error: string) => void;
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
  optimisticUpdate: OptimisticUpdate<T>;
}

export function useOptimisticAction<T extends { id: string }>(
  initialData: T[],
  options: UseOptimisticActionOptions<T>,
) {
  const [isPending, startTransition] = useTransition();
  const [optimisticData, addOptimistic] = useOptimistic(
    initialData,
    options.optimisticUpdate,
  );

  const {
    onSuccess,
    onError,
    successMessage,
    errorMessage,
    showToast = true,
  } = options;

  const executeOptimistic = <TData = unknown>(
    optimisticValue: Partial<T>,
    action: () => Promise<{
      success: boolean;
      data?: TData | null;
      error?: string;
    }>,
  ): Promise<{ success: boolean; data?: TData | null; error?: string }> => {
    // Apply optimistic update immediately
    addOptimistic(optimisticValue);

    return new Promise((resolve) => {
      const runAction = async () => {
        try {
          const result = await action();

          if (result.success) {
            if (showToast && successMessage) {
              toast.success(successMessage);
            }
            onSuccess?.(result.data as T[] | null);
          } else {
            if (showToast) {
              toast.error(
                errorMessage || result.error || "Une erreur s'est produite",
              );
            }
            onError?.(result.error || "Une erreur inconnue s'est produite");
          }

          return result;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Une erreur inattendue s'est produite";
          if (showToast) {
            toast.error(errorMessage);
          }
          onError?.(errorMessage);
          return { success: false, error: errorMessage };
        }
      };

      // Wrap the action in startTransition
      startTransition(async () => {
        const result = await runAction();
        resolve(result);
      });
    });
  };

  return {
    data: optimisticData,
    isPending,
    executeOptimistic,
  };
}

// Predefined optimistic update functions
export const optimisticUpdates = {
  // Add new item
  add: <T extends { id: string }>(
    currentState: T[],
    optimisticValue: Partial<T>,
  ) => [
    ...currentState,
    { ...optimisticValue, id: optimisticValue.id || `temp-${Date.now()}` } as T,
  ],

  // Update existing item
  update: <T extends { id: string }>(
    currentState: T[],
    optimisticValue: Partial<T> & { id: string },
  ) =>
    currentState.map((item) =>
      item.id === optimisticValue.id ? { ...item, ...optimisticValue } : item,
    ),

  // Remove item
  remove: <T extends { id: string }>(
    currentState: T[],
    optimisticValue: { id: string },
  ) => currentState.filter((item) => item.id !== optimisticValue.id),

  // Toggle status
  toggleStatus: <T extends { id: string; is_active?: boolean }>(
    currentState: T[],
    optimisticValue: { id: string; is_active: boolean },
  ) =>
    currentState.map((item) =>
      item.id === optimisticValue.id
        ? { ...item, is_active: optimisticValue.is_active }
        : item,
    ),
};
