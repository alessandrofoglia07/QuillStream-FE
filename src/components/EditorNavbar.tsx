import React, { useState } from 'react';
import Logo from './Logo';
import type { Document } from '@/types';

interface Props {
    document: Document;
}

const EditorNavbar: React.FC<Props> = ({ document }: Props) => {
    const [documentTitle, setDocumentTitle] = useState(document.title);

    return (
        <nav className='fixed left-0 top-0 z-50 m-4 mb-8 flex h-12 w-[calc(100svw-2rem)] items-center justify-between bg-white/20'>
            <a className='h-full pr-4 md:pr-8' href='/'>
                <Logo height='2.5rem' width='2.5rem' onlyLogo />
            </a>
            <input
                type='text'
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className='rounded-md bg-transparent px-2 py-1 text-white/80 outline-[0.5px] hover:outline focus:outline-white/50 focus-visible:outline-[0.5px]'
            />
        </nav>
    );
};

export default EditorNavbar;
