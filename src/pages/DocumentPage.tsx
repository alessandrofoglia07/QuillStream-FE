import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { NotificationContext } from '@/context/NotificationContext';
import { handleError } from '@/utils/handleError';
import { useParams } from 'react-router-dom';
import axios from '@/api/axios';
import { Document } from '@/types';
import Spinner from '@/components/Spinner';
import Button from '@/components/CustomButton';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { FaAngleDown as DownIcon } from 'react-icons/fa6';
import useWebSocket from 'react-use-websocket';
import { AccountContext } from '@/context/AccountContext';
import EditorNavbar from '@/components/EditorNavbar';
import { FloatingMenu, BubbleMenu, useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface Loading {
    websocketConnection: boolean;
    documentData: boolean;
}

const extensions = [StarterKit];

const content = '<p>Hello World!</p>';

const DocumentPage: React.FC = () => {
    const { documentId } = useParams();

    const { getSession } = useContext(AccountContext);
    const { setNotification } = useContext(NotificationContext);

    const [loading, setLoading] = useState<Loading>({ websocketConnection: true, documentData: true });
    const [error, setError] = useState<string | null>(null);
    const [document, setDocument] = useState<Document | null>(null);

    const didUnmount = useRef(false);

    const getSocketUrl = useCallback(async () => {
        const session = await getSession();
        const token = session?.getAccessToken().getJwtToken();
        return token ? `${import.meta.env.VITE_WEBSOCKET_API_URL}?token=${token}` : import.meta.env.VITE_WEBSOCKET_API_URL;
    }, [getSession]);

    const editor = useEditor({
        extensions,
        content
    });

    useWebSocket(getSocketUrl, {
        onError: () => {
            setError('WebSocket error. Failed to connect.\n');
        },
        onOpen: () => {
            setLoading((prev) => ({ ...prev, websocketConnection: false }));
        },
        shouldReconnect: () => !didUnmount.current,
        reconnectInterval: 3000,
        queryParams: {
            documentId: documentId || ''
        },
        filter: (message) => JSON.parse(message.data).type === 'ping'
    });

    const reload = window.location.reload.bind(window.location);

    const fetchDocumentData = async () => {
        try {
            const res = await axios.get(`/documents/${documentId}`);
            setDocument(res.data);
        } catch (err) {
            const result = handleError(err);
            setNotification(result.notification);
            setError(result.message);
        } finally {
            setLoading((prev) => ({ ...prev, documentData: false }));
        }
    };

    useEffect(() => {
        if (!documentId) {
            setTimeout(() => {
                setError('Document ID is required.\n');
            }, 500); // Delay to prevent overlapping with WebSocket error
        }

        if (!error) {
            fetchDocumentData();
        }

        return () => {
            didUnmount.current = true;
        };
    }, []);

    if (error || !document) {
        return (
            <div className='relative z-10 focus:outline-none'>
                <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4'>
                        <div className='w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:opacity-0'>
                            <h3 className='text-base/7 font-medium text-red-400/80'>Unexpected error occurred</h3>
                            <p className='mt-2 text-sm/6 text-white/50'>Failed to connect. Try again or check the error details.</p>
                            <Button className='mt-4 w-1/3' onClick={reload}>
                                Try again
                            </Button>
                            <Disclosure as='div' className='px-1 pt-8'>
                                <DisclosureButton className='group flex items-center space-x-4 text-white/60 focus-visible:outline-none group-data-[hover]:text-white/80'>
                                    <span className='text-sm/6 font-medium'>Error Details</span>
                                    <DownIcon className='size-5 group-data-[open]:rotate-180' />
                                </DisclosureButton>
                                <DisclosurePanel className='my-4 font-mono text-sm/5 text-red-400/70'>{error}</DisclosurePanel>
                            </Disclosure>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (Object.values(loading).some((val) => val)) {
        return <Spinner className='mx-auto mt-[45vh]' />;
    }

    return (
        <div>
            <header className='h-20'>
                <EditorNavbar document={document} />
            </header>
            <main>
                <EditorContent editor={editor} />
                <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
                <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
            </main>
        </div>
    );
};

export default DocumentPage;
