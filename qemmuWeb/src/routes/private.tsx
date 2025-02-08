import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useLocalStorage } from "@mantine/hooks";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
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

  return <>{children}</>;
};

export default PrivateRoute;
