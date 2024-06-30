import React, { useContext, useEffect, useState } from 'react';
import { AccountContext } from '@/context/AccountContext';
import Logo from './Logo';
import { FaMagnifyingGlass as SearchIcon } from 'react-icons/fa6';
import { appearanceToIcon } from '@/utils/appearanceIconConverter';

const NavbarMainPage: React.FC = () => {
    const { getSession } = useContext(AccountContext);

    const [appearance, setAppearance] = useState<string | undefined>(undefined);

    useEffect(() => {
        (async () => {
            const session = await getSession();
            setAppearance(session?.getAccessToken().payload['custom:appearance']);
        })();
    }, []);

    return (
        <nav className='fixed left-0 top-0 z-50 m-4 flex h-12 w-[calc(100svw-2rem)] items-center justify-between'>
            <div className='flex h-full items-center pr-8'>
                <Logo height='3rem' onlyLogo />
                <Logo height='1.5rem' width='150px' onlyText />
            </div>
            <div className='flex h-full items-center pr-8'>
                <div className='flex w-[40vw] items-center rounded-llg bg-light-grey py-3 pl-6 pr-12 shadow-sm outline-2 outline-white/20 transition-all focus-within:shadow-md'>
                    <div className='grid h-full w-1/6 max-w-12 place-items-start px-1'>
                        <SearchIcon className='text-xl text-white/40' />
                    </div>
                    <input type='text' placeholder='Search' className='w-full bg-light-grey text-white/90 focus-visible:outline-none' />
                </div>
            </div>
            <div className='flex h-full w-48 items-center justify-end pr-8'>
                <a href='/account' className='rounded-llg bg-transparent p-3 transition-all hover:bg-slate-600/20'>
                    {appearanceToIcon(appearance, 'text-2xl text-[#0284c7]')}
                </a>
            </div>
        </nav>
    );
};

export default NavbarMainPage;
