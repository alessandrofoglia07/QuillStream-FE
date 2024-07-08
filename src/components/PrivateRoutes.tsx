import { AccountContext } from '@/context/AccountContext';
import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes: React.FC = () => {
    const [isAuth, setIsAuth] = useState<boolean | undefined>(undefined);
    const { getSession } = useContext(AccountContext);

    useEffect(() => {
        (async () => {
            try {
                const session = await getSession();
                setIsAuth(!!session);
            } catch (err) {
                setIsAuth(false);
            }
        })();
    }, [getSession]);

    if (isAuth === undefined) return null;

    return isAuth ? <Outlet /> : <Navigate to='/account/signin' replace />;
};

export default PrivateRoutes;
