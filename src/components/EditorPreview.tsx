import { User } from '@/types';
import { appearanceToIcon } from '@/utils/appearanceIconConverter';
import React from 'react';

interface Props {
    editor: User;
}

const EditorPreview: React.FC<Props> = ({ editor }: Props) => {
    return (
        <div className='mt-2 flex items-center'>
            <div className='mr-1 rounded-xl bg-white/10 p-2.5'>{appearanceToIcon(editor.appearance.toString(), 'text-2xl text-white')}</div>
            <p className='ml-2 cursor-default text-white' style={{ fontWeight: editor.role === 'author' ? '600' : 'normal' }}>
                {editor.name}
            </p>
            <p className='ml-2 text-white/50'>{editor.role[0]?.toUpperCase() + editor.role.slice(1)}</p>
        </div>
    );
};

export default EditorPreview;
