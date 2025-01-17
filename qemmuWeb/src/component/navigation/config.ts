import {
  FaTachometerAlt,
  FaCogs,
  FaUsers,
  FaSmile,
  FaMoneyBillAlt,
} from "react-icons/fa";
import { NavItem } from "../../types/navtype";

export const navLinks: NavItem[] = [
  { label: "Dashboard", icon: FaTachometerAlt, link: "DASHBOARD", role: [] },
  {
    label: "Data",
    icon: FaUsers,
    initiallyOpened: false,
    role: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
    links: [
      {
        label: "Organization",
        link: "ORGANIZATION",
      },
      {
        label: "Admin",
        link: "ADMIN",
      },
      {
        label: "Users",
        link: "USER",
      },
    ],
  },
  {
    label: "Chat",
    icon: FaMoneyBillAlt,
    initiallyOpened: false,
    role: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_USER"],
    links: [
      {
        label: "chat",
        link: "CHAT",
      },
      {
        label: "grouop",
        link: "GROUP",
      },
    ],
  },
  {
    label: "Setting",
    icon: FaCogs,
    initiallyOpened: false,
    role: ["ROLE_SUPER_ADMIN"],
    links: [
      {
        label: "Setting",
        link: "SETTING",
      },
    ],
  },
  {
    label: "Sample",
    icon: FaSmile,
    initiallyOpened: false,
    role: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_USER"],
    links: [
      {
        label: "Landing",
        link: "/",
      },
    ],
  },
];
