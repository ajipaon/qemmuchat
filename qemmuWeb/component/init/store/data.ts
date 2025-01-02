import { create } from "zustand";

export enum sectionStatus {
  NEW_ORGANIZATION = "ORGANIZATION_NAME",
  REGISTER = "REGISTER",
  LOGIN = "LOGIN",
}

type SectionState = {
  section: sectionStatus;
  setSection: (section: sectionStatus) => void;
  data: string[];
  setData: (data: string[]) => void;
};

export const newSection = create<SectionState>((set) => ({
  section: sectionStatus.NEW_ORGANIZATION,
  setSection: (section: sectionStatus) => set({ section }),
  data: [],
  setData: (data: string[]) => set({ data }),
}));
