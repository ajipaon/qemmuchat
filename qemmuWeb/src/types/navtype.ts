import type { IconType } from "react-icons";

export interface NavItem {
    label: string;
    icon: IconType;
    link?: string;
    initiallyOpened?: boolean;
    links?: { label: string; link: string }[];
}
