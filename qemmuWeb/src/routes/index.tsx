import { FC } from 'react';
import { privateRoutes, publicRoutes, dashBoardRoutes, playgroundRoutes } from './config';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './private';
import Dashboard from '../component/dasbobard';
import { NotFound } from '../component/page/notfound';
import PlaygroundRoute from './playground';

const RouterComponent: FC = () => (
    <Routes>
        <Route path="*" element={<NotFound />} />
        {publicRoutes.map(route => (
            <Route
                key={route.pathname}
                path={route.pathname}
                element={<route.component />}
            />
        ))}
        {dashBoardRoutes.map((route) => (
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
        {playgroundRoutes.map((route) => (
            <Route
                key={route.pathname}
                path={route.pathname}
                element={
                    <PlaygroundRoute>
                        <route.component />
                    </PlaygroundRoute>
                }
            />
        ))}
    </Routes>
);

export default RouterComponent;