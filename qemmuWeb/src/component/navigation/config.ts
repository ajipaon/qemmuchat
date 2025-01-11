import {
  FaTachometerAlt,
  FaCogs,
  FaUsers,
  FaSmile,
  FaMoneyBillAlt,
} from "react-icons/fa";
import { NavItem } from "../../types/navtype";

export const navLinks: NavItem[] = [
  { label: "Dashboard", icon: FaTachometerAlt, link: "DASHBOARD" },
  {
    label: "Data",
    icon: FaUsers,
    initiallyOpened: false,
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
    links: [
      {
        label: "Landing",
        link: "/",
      },
    ],
  },
];
