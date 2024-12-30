import { create } from 'zustand';
import {ActiveComponentType} from "@/types/mainType.ts";

type ActiveComponentState = {
    componentActive: ActiveComponentType;
    setComponentActive: (activeComponent: ActiveComponentType) => void;
};

export const activeComponent = create<ActiveComponentState>((set) => ({
    componentActive: "DASHBOARD",
    setComponentActive: (activeComponent: ActiveComponentType) =>
        set({ componentActive: activeComponent }),
}));