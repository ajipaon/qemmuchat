/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

type OrganizationProps = {
  data: any[];
  setData: (data: any[]) => void;
};

export const useOrganizationsData = create<OrganizationProps>((set) => ({
  data: [],
  setData: (data: any[]) => set(() => ({ data })),
}));
