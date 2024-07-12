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
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

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

    const handleChangeAppearance = (appearance: number) => {};

    return (
        <div>
            <header className='h-20'>
                <Navbar />
            </header>
            <main>
                {user ? (
                    <div className='mx-auto my-24 max-w-[30rem] rounded-md border border-white/10 p-6 shadow-sm sm:p-12 md:max-w-[40rem] md:p-24 lg:max-w-[60rem]'>
                        <Menu>
                            <MenuButton className='!hover:bg-slate-600/20 mb-6 mt-2 rounded-md bg-transparent !p-3 px-8 py-2 text-sm/6 text-white/60 transition-colors duration-75 hover:bg-light-grey'>
                                {appearanceToIcon(user['custom::appearance'], 'text-7xl text-white')}
                            </MenuButton>
                            <MenuItems
                                transition
                                anchor='right'
                                className='test-1 ml-4 grid grid-cols-3 rounded-xl border border-white/5 bg-light-grey p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0'>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((option) => (
                                    <MenuItem key={option}>
                                        <button onClick={() => handleChangeAppearance(option)} className='group aspect-square rounded-lg px-3 py-1.5 data-[focus]:bg-white/10'>
                                            {appearanceToIcon(
                                                option.toString(),
                                                (user['custom::appearance'] || '1') === option.toString() ? 'text-4xl text-white/60' : 'text-4xl text-white'
                                            )}
                                        </button>
                                    </MenuItem>
                                ))}
                            </MenuItems>
                        </Menu>
                        <h1 className='text-4xl font-bold'>@{user.username}</h1>
                        <p className='mt-4 text-lg'>
                            Account created on <span className='font-semibold'>{new Date(user.auth_time * 1000).toLocaleDateString()}</span>
                        </p>
                        {ownedDocsCount !== undefined && (
                            <p className='mt-4 text-lg'>
                                Documents owned: <span className='font-semibold'>{ownedDocsCount}</span>
                            </p>
                        )}
                        {sharedDocsCount !== undefined && (
                            <p className='text-lg'>
                                Documents shared: <span className='font-semibold'>{sharedDocsCount}</span>
                            </p>
                        )}
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
