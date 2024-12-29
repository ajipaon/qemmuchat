import { create } from 'zustand';

export enum sectionStatus {
    NEW_ORGANIZATION = "NEW_ORGANIZATION",
    REGISTER = "REGISTER",
    LOGIN = "LOGIN",
}

type SectionState = {
    section: sectionStatus;
    setSection: (section: sectionStatus) => void;
    data: any;
    setData: (data: any) => void;
};

export const newSection = create<SectionState>((set) => ({
    section: sectionStatus.REGISTER,
    setSection: (section: sectionStatus) => set({ section }),
    data: null,
    setData: (data: any) => set({ data }),
}));
