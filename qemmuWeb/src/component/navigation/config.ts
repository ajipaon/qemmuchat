import {
  FaTachometerAlt,
  FaCogs,
  FaUsers,
  FaSmile,
  FaMoneyBillAlt,
} from "react-icons/fa";
import { NavItem } from "../../types/navtype";

export const navLinks: NavItem[] = [
  {
    label: "Dashboard",
    icon: FaTachometerAlt,
    link: "/",
    role: ["ROLE_SUPER_ADMIN"],
  },
  {
    label: "Data",
    icon: FaUsers,
    initiallyOpened: false,
    role: ["ROLE_SUPER_ADMIN"],
    links: [
      {
        label: "Organization",
        link: "/organization",
      },
      {
        label: "Users",
        link: "/user",
      },
    ],
  },
  {
    label: "Data",
    icon: FaUsers,
    initiallyOpened: false,
    role: ["ROLE_ADMIN"],
    links: [
      {
        label: "Organization",
        link: "/organization",
      },
    ],
  },
  {
    label: "Meet",
    icon: FaMoneyBillAlt,
    initiallyOpened: false,
    role: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_USER"],
    links: [
      {
        label: "meet",
        link: "/meet",
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
