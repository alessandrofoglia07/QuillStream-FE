import { useCurrentEditor } from '@tiptap/react';
import { FaBold as BoldIcon, FaItalic as ItalicIcon, FaStrikethrough as StrikeIcon } from 'react-icons/fa';
import React from 'react';
import { FaWandMagicSparkles as MagicIcon } from 'react-icons/fa6';

interface ButtonConfig {
    type: 'button';
    ariaLabel: string;
    icon: React.ReactNode;
    onClick: () => void;
    className?: string;
}

interface SeparatorConfig {
    type: 'separator';
    hidden?: boolean;
}

type MenuConfig = (ButtonConfig | SeparatorConfig)[];

const MenuBar: React.FC = () => {
    const { editor } = useCurrentEditor();

    if (!editor) return null;

    const buttons: MenuConfig = [
        {
            type: 'separator',
            hidden: true
        },
        {
            type: 'button',
            ariaLabel: 'Bold',
            icon: <BoldIcon size={20} />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            className: editor.isActive('bold') ? 'text-blue-500' : ''
        },
        {
            type: 'button',
            ariaLabel: 'Italic',
            icon: <ItalicIcon size={20} />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            className: editor.isActive('italic') ? 'text-blue-500' : ''
        },
        {
            type: 'button',
            ariaLabel: 'Strike',
            icon: <StrikeIcon size={20} />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            className: editor.isActive('strike') ? 'text-blue-500' : ''
        },
        {
            type: 'separator'
        }
    ];

    return (
        <div className='fixed left-1/2 top-20 z-20 flex min-h-14 w-[90vw] max-w-[70rem] -translate-x-1/2 items-center rounded-[14px] bg-white/20 p-2 shadow-lg'>
            {buttons.map((el, idx) =>
                el.type === 'separator' ? (
                    <div key={idx} className={`mx-1 h-10 w-0.5 rounded-full bg-white ${el.hidden ? 'bg-opacity-0' : 'bg-opacity-20'} grid`}></div>
                ) : (
                    <button
                        key={idx}
                        onClick={el.onClick}
                        aria-label={el.ariaLabel}
                        className={`mx-1 grid place-items-center rounded-md p-2 text-white/80 hover:bg-white/20 focus-visible:outline-none ${el.className}`}>
                        {el.icon}
                    </button>
                )
            )}
        </div>
    );
};

export default MenuBar;
