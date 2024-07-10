import React, { useContext, useEffect, useState } from 'react';
import { AccountContext } from '@/context/AccountContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/NavbarMainPage';
import Spinner from '@/components/Spinner';
import Button from '@/components/CustomButton';
import { appearanceToIcon } from '@/utils/appearanceIconConverter';
import axios from '@/api/axios';
import { handleError } from '@/utils/handleError';
import { NotificationContext } from '@/context/NotificationContext';

interface CognitoUserSessionPayload {
    auth_time: number;
    client_id: string;
    event_id: string;
    exp: number;
    iat: number;
    iss: string;
    jti: string;
    scope: string;
    sub: string;
    token_use: string;
    username: string;
    'custom::appearance'?: string;
}

const AccountPage: React.FC = () => {
    const navigate = useNavigate();
    const { getSession, logout } = useContext(AccountContext);
    const { setNotification } = useContext(NotificationContext);

    const [user, setUser] = useState<CognitoUserSessionPayload | undefined>(undefined); // undefined is only used for the initial state
    const [ownedDocsCount, setOwnedDocsCount] = useState<number | undefined>(undefined);
    const [sharedDocsCount, setSharedDocsCount] = useState<number | undefined>(undefined);

    const fetchUserData = async () => {
        try {
            const session = await getSession();
            if (session === null) {
                return navigate('/account/signin');
            }
            setUser(session.getAccessToken().decodePayload() as CognitoUserSessionPayload);
        } catch (err) {
            navigate('/account/signin');
        }
    };

    const fetchDocsCounts = async () => {
        try {
            const res = await axios.get('/documents/user/count');
            setOwnedDocsCount(res.data.owned);
            setSharedDocsCount(res.data.shared);
        } catch (err) {
            const result = handleError(err);
            setNotification(result.notification);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchDocsCounts();
    }, []);

    const handleSignOut = () => {
        logout();
    };

    return (
        <div>
            <header className='h-20'>
                <Navbar />
            </header>
            <main>
                {user ? (
                    <div className='mx-auto h-full max-w-[30rem] py-4 md:max-w-[40rem] lg:max-w-[60rem]'>
                        <Button onClick={() => navigate('/account')} data-secondary className='!hover:bg-slate-600/20 mb-6 mt-12 !p-3'>
                            {appearanceToIcon(user['custom::appearance'], 'text-7xl text-white')}
                        </Button>
                        <h1 className='text-4xl font-bold'>@{user.username}</h1>
                        <p className='mt-4 text-lg'>Account created on {new Date(user.auth_time * 1000).toLocaleDateString()}</p>
                        {ownedDocsCount !== undefined && <p className='mt-4 text-lg'>Documents owned: {ownedDocsCount}</p>}
                        {sharedDocsCount !== undefined && <p className='mt-4 text-lg'>Documents shared: {sharedDocsCount}</p>}
                        <Button onClick={handleSignOut} className='!hover:bg-slate-600/20 mt-12 px-6 py-3'>
                            Sign out
                        </Button>
                    </div>
                ) : (
                    <Spinner className='mx-auto mt-[25%]' />
                )}
            </main>
        </div>
    );
};

export default AccountPage;
