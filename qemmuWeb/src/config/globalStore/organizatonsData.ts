import { create } from "zustand";

type OrganizationProps = {
  data: any[];
  setData: (data: any[]) => void;
};

export const useOrganizationsStore = create<OrganizationProps>((set) => ({
  data: [],
  setData: (data: any[]) => set(() => ({ data })),
}));
