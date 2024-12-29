import React from 'react'
import { QueryClientProvider as Provider, QueryClient } from '@tanstack/react-query';
import { request } from './request'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            select(response: any) {
                return response.data
            },
            queryFn: ({ queryKey }) => {
                return request(queryKey[0] as any)
            },
        },
    },
})

export default function QueryClientProvider({
                                                children,
                                            }: React.PropsWithChildren<Record<string, any>>) {
    return <Provider client={queryClient}>{children}</Provider>
}

//
// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { getItems, createItem, updateItem, deleteItem } from './request';
//
// const ItemsComponent = () => {
//     const queryClient = useQueryClient();
//     const [page, setPage] = useState(1);
//
//     // Menggunakan useQuery untuk mendapatkan daftar item dengan pagination
//     const { data, error, isLoading } = useQuery(['items', { page }], () => getItems(`/items?page=${page}`), {
//         keepPreviousData: true,
//     });
//
//     // Menggunakan useMutation untuk operasi create
//     const createMutation = useMutation((newItem) => createItem('/items', newItem), {
//         onSuccess: () => {
//             queryClient.invalidateQueries(['items']);
//         },
//     });
//
//     // Menggunakan useMutation untuk operasi update
//     const updateMutation = useMutation((updatedItem) => updateItem(`/items/${updatedItem.id}`, updatedItem), {
//         onSuccess: () => {
//             queryClient.invalidateQueries(['items']);
//         },
//     });
//
//     // Menggunakan useMutation untuk operasi delete
//     const deleteMutation = useMutation((id) => deleteItem(`/items/${id}`), {
//         onSuccess: () => {
//             queryClient.invalidateQueries(['items']);
//         },
//     });
//
//     if (isLoading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error.message}</div>;
//
//     return (
//         <div>
//             <h1>Items</h1>
//             <ul>
//                 {data.items.map((item) => (
//                     <li key={item.id}>
//                         {item.name}
//                         <button onClick={() => updateMutation.mutate({ id: item.id, name: 'Updated Item' })}>
//                             Update
//                         </button>
//                         <button onClick={() => deleteMutation.mutate(item.id)}>Delete</button>
//                     </li>
//                 ))}
//             </ul>
//             <button onClick={() => createMutation.mutate({ name: 'New Item' })}>Add Item</button>
//             <div>
//                 <button onClick={() => setPage((old) => Math.max(old - 1, 1))} disabled={page === 1}>
//                     Previous Page
//                 </button>
//                 <button onClick={() => setPage((old) => (!data || !data.hasMore ? old : old + 1))} disabled={!data?.hasMore}>
//                     Next Page
//                 </button>
//             </div>
//         </div>
//     );
// };
//
// export default ItemsComponent;