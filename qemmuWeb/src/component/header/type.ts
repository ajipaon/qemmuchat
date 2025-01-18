import { create } from 'zustand';
export type newOrganization = {
    name: string;
};

type modalNewOrganization = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const newOrganizationModal = create<modalNewOrganization>(
    (set) => ({
        isOpen: false,
        onOpen: () => set({ isOpen: true }),
        onClose: () => set({ isOpen: false }),
    })
);
