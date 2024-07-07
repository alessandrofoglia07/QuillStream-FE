import React, { useContext, useState } from 'react';
import type { Document, MainPageSortOption as SortOption } from '@/types';
import { BsThreeDotsVertical as OptionsIcon } from 'react-icons/bs';
import { Dialog, DialogPanel, DialogTitle, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { FaRegEdit as RenameIcon, FaRegTrashAlt as DeleteIcon } from 'react-icons/fa';
import { FaArrowUpRightFromSquare as OpenIcon } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Button from './CustomButton';
import { handleError } from '@/utils/handleError';
import { NotificationContext } from '@/context/NotificationContext';
import axios from '@/api/axios';

interface Props {
    document: Document;
    sortOption: SortOption;
}

const DocumentPreview: React.FC<Props> = ({ document, sortOption }) => {
    const navigate = useNavigate();

    const { setNotification } = useContext(NotificationContext);

    const [renameModalOpen, setRenameModalOpen] = useState<boolean>(false);
    const [renameNewTitle, setRenameNewTitle] = useState<string>('');
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string>('');

    const formatDate = (dateStr: string) => {
        if (parseInt(dateStr) === -1) return 'Never';
        const date = new Date(parseInt(dateStr));
        if (date.getFullYear() !== new Date().getFullYear()) {
            return date.toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } else if (date.getDate() !== new Date().getDate()) {
            return date.toLocaleDateString([], {
                month: 'short',
                day: 'numeric'
            });
        } else {
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    const handleOpen = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.ctrlKey) return window.open(`/documents/${document.documentId}`, '_blank');
        navigate(`/documents/${document.documentId}`);
    };

    const handleRename = async () => {};

    const handleDelete = async () => {
        try {
            if (document.user.role !== 'author') {
                throw new Error('You are not authorized to delete this document.');
            }
            await axios.delete(`/documents/${document.documentId}`);
            setDeleteModalOpen(false);
            setNotification({
                type: 'success',
                message: 'Document deleted successfully.'
            });
        } catch (err) {
            console.error(err);
            const result = handleError(err);
            setNotification(result.notification);
        }
    };

    const handleOpenInNewTab = () => {
        window.open(`/documents/${document.documentId}`, '_blank');
    };

    return (
        <>
            <div
                role='button'
                tabIndex={0}
                className='flex min-h-12 w-full items-center rounded-lg text-left transition-colors duration-75 *:h-full hover:bg-white/10'
                onClick={handleOpen}>
                <div className='grid w-[10%] place-items-center'>
                    <div className='aspect-square w-5 rounded bg-white/70' />
                </div>
                <div className='line-clamp-1 flex w-1/2 items-center'>
                    <h3>{document.title}</h3>
                </div>
                <div className='line-clamp-1 flex w-[15%] items-center px-2 text-white/70'>
                    <p>{document.authorName}</p>
                </div>
                <div className='line-clamp-1 flex w-[15%] items-center pl-2 text-white/70'>
                    <p>{formatDate(sortOption === 'Last accessed by me' ? document.user.lastAccessedAt : document.updatedAt)}</p>
                </div>
                <Menu>
                    <MenuButton className='mx-auto grid aspect-square place-items-center rounded-lg p-[.35] hover:bg-white/20' onClick={(e) => e.stopPropagation()}>
                        <OptionsIcon size={20} />
                    </MenuButton>
                    <MenuItems
                        transition
                        onClick={(e) => e.stopPropagation()}
                        anchor='bottom start'
                        className='origin-top-right rounded-xl border border-white/5 bg-light-grey p-2 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0'>
                        <MenuItem>
                            <button onClick={() => setRenameModalOpen(true)} className='group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10'>
                                <RenameIcon size={20} /> Rename
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button onClick={() => setDeleteModalOpen(true)} className='group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10'>
                                <DeleteIcon className='-ml-0.5' size={20} /> <span className='ml-0.5'>Delete</span>
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button onClick={handleOpenInNewTab} className='group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10'>
                                <OpenIcon size={18} className='mr-0.5' /> Open in new tab
                            </button>
                        </MenuItem>
                    </MenuItems>
                </Menu>
            </div>
            <Dialog open={deleteModalOpen} as='div' className='relative z-10 focus:outline-none' onClose={() => setDeleteModalOpen(false)}>
                <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4'>
                        <DialogPanel transition className='w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl'>
                            <DialogTitle as='h3' className='text-base/5 font-medium text-white'>
                                Delete document
                            </DialogTitle>
                            <p className='mt-2 cursor-default text-sm/6 text-white/50'>
                                This action is irreversible. {document.editors.length > 1 && <span>All editors will lose access to this document.</span>} Type "
                                <span className='font-semibold'>{document.title}</span>" in the box below to continue.
                            </p>
                            <input
                                type='text'
                                className='my-2 w-full rounded-md border border-white/5 bg-light-grey px-3 py-1 text-sm/6 focus-within:outline-none'
                                value={deleteConfirm}
                                autoFocus
                                onChange={(e) => setDeleteConfirm(e.target.value)}
                            />
                            <div className='mt-4 flex items-center'>
                                <Button disabled={deleteConfirm !== document.title} className='border-red-500 text-red-500 disabled:opacity-50' onClick={handleDelete}>
                                    Delete this document
                                </Button>
                                <Button className='ml-2' onClick={() => setDeleteModalOpen(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
            <Dialog open={renameModalOpen} as='div' className='relative z-10 focus:outline-none' onClose={() => setRenameModalOpen(false)}>
                <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4'>
                        <DialogPanel transition className='w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl'>
                            <DialogTitle as='h3' className='text-base/5 font-medium text-white'>
                                Rename document
                            </DialogTitle>
                            <p className='mt-2 cursor-default text-sm/6 text-white/50'>
                                Type a new title for this document. {document.editors.length > 1 && <span>All editors will see this change.</span>}
                            </p>
                            <input
                                type='text'
                                className='my-2 w-full rounded-md border border-white/5 bg-light-grey px-3 py-1 text-sm/6 focus-within:outline-none'
                                value={renameNewTitle}
                                autoFocus
                                onChange={(e) => setRenameNewTitle(e.target.value)}
                            />
                            <div className='mt-4 flex items-center'>
                                <Button disabled={renameNewTitle === document.title || renameNewTitle.length === 0} className='disabled:opacity-50' onClick={handleRename}>
                                    Rename this document
                                </Button>
                                <Button className='ml-2' onClick={() => setRenameModalOpen(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default DocumentPreview;
