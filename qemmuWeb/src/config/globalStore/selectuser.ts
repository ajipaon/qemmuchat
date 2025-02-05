import { create } from "zustand";

type SelectUserChatProps = {
  data: any;
  setData: (data: any) => void;
};

export const useSelectUserChatStore = create<SelectUserChatProps>((set) => ({
  data: null,
  setData: (data) => set(() => ({ data })),
}));
