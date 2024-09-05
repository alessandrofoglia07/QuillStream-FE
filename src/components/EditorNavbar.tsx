import React, { useContext, useEffect, useState } from 'react';
import Logo from './Logo';
import type { Document } from '@/types';
import Button from './CustomButton';
import { useNavigate } from 'react-router-dom';
import { appearanceToIcon } from '@/utils/appearanceIconConverter';
import { AccountContext } from '@/context/AccountContext';

interface Props {
    document: Document;
    appearance?: string;
}

const EditorNavbar: React.FC<Props> = ({ document, appearance }: Props) => {
    const navigate = useNavigate();
    const { getSession } = useContext(AccountContext);

    const [documentTitle, setDocumentTitle] = useState(document.title);
    const [appearanceState, setAppearance] = useState<string | undefined>(appearance);

    useEffect(() => {
        (async () => {
            const session = await getSession();
            setAppearance(session?.getIdToken().payload['custom:appearance']);
        })();
    }, [appearance]);

    return (
        <nav className='fixed left-0 top-0 z-50 m-4 mb-8 flex h-12 w-[calc(100svw-2rem)] items-center justify-between'>
            <a className='h-full pr-4 md:pr-8' href='/'>
                <Logo height='2.5rem' width='2.5rem' onlyLogo />
            </a>
            <div className='flex h-full items-center'>
                <input
                    type='text'
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    className='rounded-md bg-transparent px-2 py-1 text-white/80 focus-visible:outline-none'
                />
                <Button onClick={() => navigate('/account')} data-secondary className='!hover:bg-slate-600/20 !p-3'>
                    {appearanceToIcon(appearanceState, 'text-2xl text-white')}
                </Button>
            </div>
        </nav>
    );
};

export default EditorNavbar;
