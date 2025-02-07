// import { useMutation } from "@tanstack/react-query";
// import { apiClient } from "../../config/clientApiConfig";

// export const useGetRoom = () => {
//   return useMutation<void, Error, void>({
//     mutationKey: ["get_room"],
//     mutationFn: async () => {
//       const url = `/chats/createRoom`;
//       return await apiClient(url, {
//         method: "POST",
//         body: JSON.stringify({
//           id: "1",
//           name: "chat",
//         }),
//       });
//     },
//   });
// };
