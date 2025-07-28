import { useEffect, useState } from "react";

type QueryResult<T> = {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
};

type UseQueryOptions<T> = {
    endpoint: string;
    baseUrl?: string; // defaults to http://localhost:8080/
};

export function useQuery<T>({ endpoint }: UseQueryOptions<T>): QueryResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    async function refetch() {
        try {
            setLoading(true);
            const res = await fetch(endpoint);
            if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
            const json = await res.json();
            setData(json);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refetch();
    }, [endpoint]);

    return { data, loading, error, refetch };
}
