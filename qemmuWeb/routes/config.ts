import InitPage from "@/component/init/Index.tsx";


export default [
    {
        pathname: '/',
        name: 'Index',
        title: 'Home',
        component: InitPage,
        meta: {
            navigation: 'Home'
        }
    },
    {
        pathname: '/init',
        name: 'Init',
        title: 'Create Organizaiton',
        component: InitPage,
        meta: {
            navigation: 'Home'
        }
    },
];