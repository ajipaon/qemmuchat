import { FC } from 'react';
import config from './config';
import { Route, Routes, Navigate } from 'react-router-dom';

const RouterComponent: FC = () => (
    <Routes>
            <Route path="/" element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/404" />} />
            {config.map(route => (
                <Route
                    key={route.pathname}
                    path={route.pathname}
                    element={<route.component />}
                />
            ))}
    </Routes>
);

export default RouterComponent;