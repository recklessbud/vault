import { checkAuth } from '@/api/auth.api';
import React from 'react'
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean|null> (null);
  React.useEffect(() => {
      const chectAuthN = async() => {
        const auth = await checkAuth();
        setIsAuthenticated(auth);
      };
      chectAuthN();
  }, [])
   if(isAuthenticated === null){
    return <div>Loading...</div>;
   }

   if (isAuthenticated){
    return <>{children}</>
   }else{
    return <Navigate to="/auth" />
   }
}
