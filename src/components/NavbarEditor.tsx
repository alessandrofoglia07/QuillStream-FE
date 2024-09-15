import React, { useContext, useEffect, useState } from 'react';
import Logo from './Logo';
import type { Document } from '@/types';
import Button from './CustomButton';
import { useNavigate } from 'react-router-dom';
import { appearanceToIcon } from '@/utils/appearanceIconConverter';
import { AccountContext } from '@/context/AccountContext';
import useDebounce from '@/hooks/useDebounce';
import axios from '@/api/axios';
import { handleError } from '@/utils/handleError';
import { NotificationContext } from '@/context/NotificationContext';

type Saved = '' | 'Saving...' | 'Saved.';

interface Props {
    document: Document;
    setDocument: React.Dispatch<React.SetStateAction<Document | null>>;
    appearance?: string;
    saved: Saved;
    setSaved: (value: Saved) => void;
    savedTimeout: React.MutableRefObject<number | null>;
}

const EditorNavbar: React.FC<Props> = ({ document, setDocument, appearance, saved, setSaved, savedTimeout }: Props) => {
    const navigate = useNavigate();
    const { getSession } = useContext(AccountContext);
    const { setNotification } = useContext(NotificationContext);

    const [documentTitle, setDocumentTitle] = useState(document.title);
    const [appearanceState, setAppearance] = useState<string | undefined>(appearance);

    const debouncedDocumentTitle = useDebounce(documentTitle, 500);

    useEffect(() => {
        if (documentTitle !== document.title) {
            renameDocument();
        }
    }, [debouncedDocumentTitle]);

    const renameDocument = async () => {
        try {
            setSaved('Saving...');
            const res = await axios.patch(`/documents/${document.documentId}`, { title: debouncedDocumentTitle });
            setDocument(res.data.document);
            setSaved('Saved.');
            savedTimeout.current && clearTimeout(savedTimeout.current);
            savedTimeout.current = setTimeout(() => setSaved(''), 2000);
        } catch (err) {
            const result = handleError(err);
            setNotification(result.notification);
            setSaved('');
        }
    };

    useEffect(() => {
        (async () => {
            const session = await getSession();
            setAppearance(session?.getIdToken().payload['custom:appearance']);
        })();
    }, [appearance]);

    return (
        <nav className='fixed left-1/2 top-0 z-50 m-4 mb-8 flex h-12 w-[calc(100svw-2rem)] max-w-[70rem] -translate-x-1/2 items-center justify-between'>
            <div className='flex items-center'>
                <a className='h-full pr-4 md:pr-8' href='/'>
                    <Logo height='2.5rem' width='2.5rem' onlyLogo />
                </a>
                <p id='saved-text' className='text-sm font-semibold transition-opacity'>
                    {saved}
                </p>
            </div>
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
