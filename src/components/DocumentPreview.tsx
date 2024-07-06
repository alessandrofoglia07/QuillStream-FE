import React from 'react';
import type { Document, MainPageSortOption as SortOption } from '@/types';
import { BsThreeDotsVertical as OptionsIcon } from 'react-icons/bs';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { FaRegEdit as RenameIcon, FaRegTrashAlt as DeleteIcon } from 'react-icons/fa';
import { FaArrowUpRightFromSquare as OpenIcon } from 'react-icons/fa6';

interface Props {
    document: Document;
    sortOption: SortOption;
}

const DocumentPreview: React.FC<Props> = ({ document, sortOption }) => {
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

    const handleRename = async () => {};

    const handleDelete = async () => {};

    const handleOpenInNewTab = () => {};

    return (
        <div role='button' tabIndex={0} className='flex min-h-12 w-full items-center rounded-lg text-left transition-colors duration-75 *:h-full hover:bg-white/10'>
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
                <MenuButton>
                    <div className='grid w-[10%] place-items-center rounded'>
                        <button className='rounded-lg p-[.35rem] hover:bg-white/20'>
                            <OptionsIcon size={20} />
                        </button>
                    </div>
                </MenuButton>
                <MenuItems
                    transition
                    anchor='bottom start'
                    className='origin-top-right rounded-xl border border-white/5 bg-light-grey p-2 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0'>
                    <MenuItem>
                        <button onClick={() => {}} className='group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10'>
                            <RenameIcon size={20} /> Rename
                        </button>
                    </MenuItem>
                    <MenuItem>
                        <button onClick={() => {}} className='group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10'>
                            <DeleteIcon className='-ml-0.5' size={20} /> <span className='ml-0.5'>Delete</span>
                        </button>
                    </MenuItem>
                    <MenuItem>
                        <button onClick={() => {}} className='group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10'>
                            <OpenIcon size={18} className='mr-0.5' /> Open in new tab
                        </button>
                    </MenuItem>
                </MenuItems>
            </Menu>
        </div>
    );
};

export default DocumentPreview;
