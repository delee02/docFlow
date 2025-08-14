import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 3, //3일 캐시유지
            staleTime: 0,
        },
    },
});

const localStoragePersister = createSyncStoragePersister({
    storage : window.localStorage,
});

persistQueryClient({
    queryClient,
    persister: localStoragePersister,
});