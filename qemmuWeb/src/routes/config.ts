import MainDashboard from "../component/dasbobard/Main";
import InitPage from "../component/init/Index";
import Enjoy from "../component/space/enjoy";
import Space from "../component/space/space";

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
];
