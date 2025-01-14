import { create } from "zustand";

export interface activityData {
  platform: string;
  pageActivity: string;
  pageActivityId: string;
}

interface ActivityState {
  data: activityData;
  setData: (data: activityData) => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  data: {
    platform: "WEB",
    pageActivity: "DASHBOARD",
    pageActivityId: "",
  },
  setData: (newData) => set({ data: newData }),
}));
