import MainDashboard from "../component/dasbobard/Main";
import InitPage from "../component/init/Index";
import Enjoy from "../component/space/enjoy";
import Space from "../component/space/space";
import Meet from "../component/meet";
import Organization from "../component/organization/Organization";
import User from "../component/person/User";
import MeetUp from "../component/meet/meetUp";

export const publicRoutes = [
  {
    pathname: "/init",
    name: "Init",
    title: "Int page",
    component: InitPage,
    meta: {
      navigation: "Init",
    },
  },
];

export const dashBoardRoutes = [
  {
    pathname: "/",
    name: "Dashboard",
    title: "Dashboard",
    component: MainDashboard,
    meta: {
      navigation: "Dashboard",
    },
  },
  {
    pathname: "/organization",
    name: "Dashboard",
    title: "Dashboard",
    component: Organization,
    meta: {
      navigation: "Dashboard",
    },
  },
  {
    pathname: "/user",
    name: "User",
    title: "User",
    component: User,
    meta: {
      navigation: "User",
    },
  },
  {
    pathname: "/meet",
    name: "Meet",
    title: "Meet",
    component: Meet,
    meta: {
      navigation: "Meet",
    },
  },
];

export const privateRoutes = [
  {
    pathname: "/space",
    name: "Space",
    title: "Space",
    component: Space,
    meta: {
      navigation: "Space",
    },
  },
];

export const playgroundRoutes = [
  {
    pathname: "/space/:id",
    name: "Space",
    title: "Space",
    component: Enjoy,
    meta: {
      navigation: "Space",
    },
  },
  {
    pathname: "/meet/:id",
    name: "Meet",
    title: "Meet",
    component: MeetUp,
    meta: {
      navigation: "Meet",
    },
  },
];
