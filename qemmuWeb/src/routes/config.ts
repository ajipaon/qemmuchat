import MainDashboard from "../component/dasbobard/Main";
import InitPage from "../component/init/Index";
import Space from "../component/space/space";

export const publicRoute = [
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

export const dashBoardRoute = [
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
    pathname: "/space/:id",
    name: "Space",
    title: "Space",
    component: Space,
    meta: {
      navigation: "Space",
    },
  },
];
