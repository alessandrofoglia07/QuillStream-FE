import React, { useContext, useEffect, useState } from 'react';
import { AccountContext } from '@/context/AccountContext';
import Logo from './Logo';
import { FaMagnifyingGlass as SearchIcon } from 'react-icons/fa6';
import { appearanceToIcon } from '@/utils/appearanceIconConverter';
import Button from './CustomButton';

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
        <nav className='fixed left-0 top-0 z-50 m-4 mb-8 flex h-12 w-[calc(100svw-2rem)] items-center justify-between'>
            <div className='h-full pr-4 md:pr-8'>
                <div className='flex items-center -md:hidden'>
                    <Logo height='3rem' onlyLogo color='#ffffff' />
                    <Logo height='1.5rem' width='150px' onlyText color='#ffffff' />
                </div>
                <div className='md:hidden'>
                    <Logo height='2.5rem' width='2.5rem' onlyLogo />
                </div>
            </div>
            <div className='flex h-full items-center md:pr-8 -md:w-3/4'>
                <div className='flex w-full items-center rounded-llg border border-white/5 bg-light-grey py-3 pl-3 pr-1 shadow-sm transition-all focus-within:shadow-md md:w-[40vw] md:pl-6 md:pr-12'>
                    <div className='grid h-full w-1/6 max-w-12 place-items-start px-1'>
                        <SearchIcon className='text-xl text-white/40' />
                    </div>
                    <input type='text' placeholder='Search' className='ml-2 w-full bg-light-grey text-white/90 focus-visible:outline-none' />
                </div>
            </div>
            <div className='flex h-full w-10 items-center justify-end md:w-[calc(3rem+150px)]'>
                <Button data-secondary className='!hover:bg-slate-600/20 !p-3'>
                    {appearanceToIcon(appearance, 'text-2xl text-[#ffffff]')}
                </Button>
            </div>
        </nav>
    );
};

export default NavbarMainPage;
