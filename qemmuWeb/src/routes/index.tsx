import { FC } from 'react';
import { privateRoutes, publicRoute, dashBoardRoute } from './config';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './private';
import Dashboard from '../component/dasbobard';
import { NotFound } from '../component/page/notfound';

const RouterComponent: FC = () => (
    <Routes>
        <Route path="*" element={<NotFound />} />
        {publicRoute.map(route => (
            <Route
                key={route.pathname}
                path={route.pathname}
                element={<route.component />}
            />
        ))}
        {dashBoardRoute.map((route) => (
            <Route
                key={route.pathname}
                path={route.pathname}
                element={
                    <Dashboard>
                        <route.component />
                    </Dashboard>
                }
            />
        ))}
        {privateRoutes.map((route) => (
            <Route
                key={route.pathname}
                path={route.pathname}
                element={
                    <PrivateRoute>
                        <route.component />
                    </PrivateRoute>
                }
            />
        ))}
    </Routes>
);

export default RouterComponent;