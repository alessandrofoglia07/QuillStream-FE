import React from 'react';
import type { Document, MainPageSortOption as SortOption } from '@/types';
import { BsThreeDotsVertical as OptionsIcon } from 'react-icons/bs';

interface Props {
    document: Document;
    sortOption: SortOption;
}

const DocumentPreview: React.FC<Props> = ({ document, sortOption }) => {
    const formatDate = (dateStr: string) => {
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

    return (
        <div role='button' tabIndex={0} className='flex min-h-12 w-full items-center rounded-lg text-left transition-colors duration-75 *:h-full hover:bg-white/10'>
            <div className='grid w-[10%] place-items-center'>
                <div className='aspect-square w-5 rounded bg-white/70' />
            </div>
            <div className='line-clamp-1 w-1/2'>
                <h3>{document.title}</h3>
            </div>
            <div className='line-clamp-1 w-[15%] px-2 text-white/70'>
                <p>{document.authorName}</p>
            </div>
            <div className='line-clamp-1 w-[15%] pl-2 text-white/70'>
                <p>{formatDate(sortOption === 'Last accessed by me' ? document.user.lastAccessedAt : document.updatedAt)}</p>
            </div>
            <div className='grid w-[10%] place-items-center rounded'>
                <button className='rounded-lg p-[.35rem] hover:bg-white/20'>
                    <OptionsIcon size={20} />
                </button>
            </div>
        </div>
    );
};

export default DocumentPreview;
