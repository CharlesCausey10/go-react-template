import { useState } from "react";

type MutationOptions<TArgs, TReturn> = {
    mutation: (args: TArgs) => Promise<TReturn>;
    onSuccess?: (result: TReturn) => void;
    onError?: (err: Error) => void;
};

type MutationResult<TArgs> = {
    mutate: (args: TArgs) => Promise<void>;
    loading: boolean;
    error: Error | null;
};

export function useMutation<TArgs, TReturn>(
    options: MutationOptions<TArgs, TReturn>
): MutationResult<TArgs> {
    const { mutation, onSuccess, onError } = options;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    async function mutate(args: TArgs): Promise<void> {
        try {
            setLoading(true);
            const result = await mutation(args);
            onSuccess?.(result);
        } catch (err) {
            const errorObj = err as Error;
            setError(errorObj);
            onError?.(errorObj);
        } finally {
            setLoading(false);
        }
    }

    return { mutate, loading, error };
}