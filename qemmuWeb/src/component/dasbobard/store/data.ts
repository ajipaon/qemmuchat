import { create } from "zustand";
import { ActiveComponentType } from "../../../types/mainType";

type ActiveComponentState = {
  componentActive: ActiveComponentType;
  setComponentActive: (activeComponent: ActiveComponentType) => void;
};

export const activeComponent = create<ActiveComponentState>((set) => ({
  componentActive: "CHAT",
  setComponentActive: (activeComponent: ActiveComponentType) =>
    set({ componentActive: activeComponent }),
}));
