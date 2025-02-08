import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useLocalStorage } from "@mantine/hooks";
import { AppShell } from "@mantine/core";

interface PlaygroundRouteProps {
    children: ReactNode;
}

const PlaygroundRoute: React.FC<PlaygroundRouteProps> = ({ children }) => {
    const [token] = useLocalStorage<string | null>({ key: "token" });
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token !== undefined) {
            setIsLoading(false);
        }
    }, [token]);

    if (isLoading) {
        return <></>
    }
    if (!token) {
        return <Navigate to="/init" state={{ from: location }} replace />;
    }

    return (
        <AppShell
            footer={{ height: 60 }}
            // offsetScrollbars={false}
            // padding="md"
            styles={{
                main: {
                    overflow: "hidden",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column"
                }
            }}
        >
            <AppShell.Main>
                {children}
            </AppShell.Main>
            {/* <AppShell.Aside p="md">
                <h1>sdfsdfds</h1>
            </AppShell.Aside> */}
            <AppShell.Footer p="md">Footer</AppShell.Footer>
        </AppShell>
    );
};

export default PlaygroundRoute;
