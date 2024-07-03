import React, { useEffect, useState, useContext } from 'react';
import Navbar from '@/components/NavbarMainPage';
import DocumentPreview from '@/components/DocumentPreview';
import { Document, MainPageSortOption as SortOption } from '@/types';
import { handleError } from '@/utils/handleError';
import { NotificationContext } from '@/context/NotificationContext';
import axios from '@/api/axios';
import DropdownMenu from '@/components/DropdownMenu';
import Button from '@/components/CustomButton';
import { FaSortAlphaDown as SortIcon } from 'react-icons/fa';
import { PiHandArrowDownBold as OwnIcon } from 'react-icons/pi';
import { FaPlus as PlusIcon } from 'react-icons/fa6';

type OwnedDocumentsOptions = 'Owned by anyone' | 'Owned by me' | 'Shared';

const MainPage: React.FC = () => {
    const { setNotification } = useContext(NotificationContext);

    const [documents, setDocuments] = useState<Document[] | null>(null);
    const [sortOption, setSortOption] = useState<SortOption>('Last accessed by me');
    const [ownedDocumentsOption, setOwnedDocumentsOption] = useState<OwnedDocumentsOptions>('Owned by anyone');

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const res = await axios.get('/documents/user');
                setDocuments(res.data.documents);
            } catch (err) {
                const result = handleError(err);
                setNotification(result.notification);
            }
        };
        fetchDocs();
    }, []);

    const sortDocuments = (docs: Document[]) => {
        switch (sortOption) {
            case 'Last accessed by me': {
                const organizedDocs = {
                    Today: [] as Document[],
                    'Last 7 days': [] as Document[],
                    'Last 30 days': [] as Document[],
                    Older: [] as Document[]
                };

                for (const doc of docs) {
                    const date = new Date(parseInt(doc.user.lastAccessedAt));
                    const today = new Date();

                    if (date.toDateString() === today.toDateString()) {
                        organizedDocs['Today']?.push(doc);
                    } else if (today.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
                        organizedDocs['Last 7 days']?.push(doc);
                    } else if (today.getTime() - date.getTime() < 30 * 24 * 60 * 60 * 1000) {
                        organizedDocs['Last 30 days']?.push(doc);
                    } else {
                        organizedDocs['Older']?.push(doc);
                    }
                }

                return organizedDocs;
            }
            case 'Title': {
                return {
                    'Documents by title': docs.sort((a, b) => a.title.localeCompare(b.title))
                };
            }
            case 'Last modified': {
                return {
                    'Recent documents': docs.sort((a, b) => {
                        return parseInt(b.updatedAt) - parseInt(a.updatedAt);
                    })
                };
            }
        }
    };

    const filterDocuments = (docs: Document[]) => {
        switch (ownedDocumentsOption) {
            case 'Owned by anyone':
                return docs;
            case 'Owned by me':
                return docs.filter((doc) => doc.user.role === 'author');
            case 'Shared':
                return docs.filter((doc) => doc.user.role === 'editor');
        }
    };

    return (
        <div>
            <header className='h-20'>
                <Navbar />
            </header>
            <main>
                <div className='mx-auto h-full w-full max-w-[30rem] py-4 md:max-w-[40rem] lg:max-w-[60rem]'>
                    <div className='flex h-14 w-full items-center gap-4'>
                        <Button className='aspect-square !p-2'>
                            <PlusIcon size={20} />
                        </Button>
                        <DropdownMenu
                            buttonText={
                                <>
                                    <SortIcon size={16} /> {sortOption}
                                </>
                            }
                            options={['Last accessed by me', 'Title', 'Last modified']}
                            selectedOption={sortOption}
                            setSelectedOption={setSortOption as (option: string) => void}
                        />
                        <DropdownMenu
                            buttonText={
                                <>
                                    <OwnIcon size={16} /> {ownedDocumentsOption}
                                </>
                            }
                            options={['Owned by anyone', 'Owned by me', 'Shared']}
                            selectedOption={ownedDocumentsOption}
                            setSelectedOption={setOwnedDocumentsOption as (option: string) => void}
                        />
                    </div>
                    {documents ? (
                        <>
                            {Object.entries(sortDocuments(filterDocuments(documents))).map(
                                ([category, docs]) =>
                                    docs.length > 0 && (
                                        <div key={category}>
                                            <h2 className='mb-4 mt-8 pl-3 text-lg font-semibold'>{category}</h2>
                                            <div className='grid grid-cols-1 gap-4'>
                                                {docs.map((doc: Document) => (
                                                    <DocumentPreview key={doc.documentId} document={doc} sortOption={sortOption} />
                                                ))}
                                            </div>
                                        </div>
                                    )
                            )}
                        </>
                    ) : (
                        <div className='mt-16 text-center'>
                            <h2 className='mb-4 text-xl font-semibold'>No documents found</h2>
                            <Button>Create a new document</Button>
                        </div>
                    )}
                </div>
            </main>
            <Button className='fixed bottom-12 right-12 aspect-square !rounded-llg'>
                <PlusIcon size={28} />
            </Button>
        </div>
    );
};

export default MainPage;
