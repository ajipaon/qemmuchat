import { FaTachometerAlt, FaCogs, FaUsers, FaSmile, FaMoneyBillAlt } from "react-icons/fa";
import type { NavItem } from "@/types/navtype";

export const navLinks: NavItem[] = [
    { label: "Dashboard", icon: FaTachometerAlt, link: "/" },
    {
        label: "Data",
        icon: FaUsers,
        initiallyOpened: false,
        links: [
            {
                label: "Admin",
                link: "/admin",
            },
            {
                label: "Users",
                link: "/users",
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
                link: "/chat",
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
                link: "/setting",
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
