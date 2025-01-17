import type { IconType } from "react-icons";

export interface NavItem {
  label: string;
  icon: IconType;
  link?: string;
  initiallyOpened?: boolean;
  role: string[];
  links?: { label: string; link: string }[];
}
