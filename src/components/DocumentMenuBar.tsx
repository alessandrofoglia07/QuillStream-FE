import { useCurrentEditor } from '@tiptap/react';
import {
    FaBold as BoldIcon,
    FaItalic as ItalicIcon,
    FaStrikethrough as StrikeIcon,
    FaCode as CodeIcon,
    FaParagraph as ParagraphIcon,
    FaUndo as UndoIcon,
    FaRedo as RedoIcon
} from 'react-icons/fa';
import { PiCodeBlockBold as CodeBlockIcon } from 'react-icons/pi';
import { LuHeading1 as Heading1Icon, LuHeading2 as Heading2Icon, LuHeading3 as Heading3Icon } from 'react-icons/lu';
import { MdFormatListBulleted as BulletListIcon } from 'react-icons/md';
import { GoListOrdered as OrderedListIcon } from 'react-icons/go';
import { TbBlockquote as BlockquoteIcon } from 'react-icons/tb';
import { VscHorizontalRule as HorizontalRuleIcon } from 'react-icons/vsc';
import React from 'react';

interface ButtonConfig {
    type: 'button';
    ariaLabel: string;
    icon: React.ReactNode;
    onClick: () => void;
    property: string;
    level?: number;
    disabled?: boolean;
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
            property: 'bold'
        },
        {
            type: 'button',
            ariaLabel: 'Italic',
            icon: <ItalicIcon size={20} />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            property: 'italic'
        },
        {
            type: 'button',
            ariaLabel: 'Strike',
            icon: <StrikeIcon size={20} />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            property: 'strike'
        },
        {
            type: 'button',
            ariaLabel: 'Code',
            icon: <CodeIcon size={20} />,
            onClick: () => editor.chain().focus().toggleCode().run(),
            property: 'code'
        },
        {
            type: 'separator'
        },
        {
            type: 'button',
            ariaLabel: 'Paragraph',
            icon: <ParagraphIcon size={20} />,
            onClick: () => editor.chain().focus().setParagraph().run(),
            property: 'paragraph'
        },
        {
            type: 'button',
            ariaLabel: 'Heading 1',
            icon: <Heading1Icon size={24} />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            property: 'heading',
            level: 1
        },
        {
            type: 'button',
            ariaLabel: 'Heading 2',
            icon: <Heading2Icon size={24} />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            property: 'heading',
            level: 2
        },
        {
            type: 'button',
            ariaLabel: 'Heading 3',
            icon: <Heading3Icon size={24} />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            property: 'heading',
            level: 3
        },
        {
            type: 'separator'
        },
        {
            type: 'button',
            ariaLabel: 'Bullet List',
            icon: <BulletListIcon size={20} />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            property: 'bulletList'
        },
        {
            type: 'button',
            ariaLabel: 'Order List',
            icon: <OrderedListIcon size={20} />,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            property: 'orderedList'
        },
        {
            type: 'button',
            ariaLabel: 'Code Block',
            icon: <CodeBlockIcon size={20} />,
            onClick: () => editor.chain().focus().toggleCodeBlock().run(),
            property: 'codeBlock'
        },
        {
            type: 'button',
            ariaLabel: 'Blockquote',
            icon: <BlockquoteIcon size={20} />,
            onClick: () => editor.chain().focus().toggleBlockquote().run(),
            property: 'blockquote'
        },
        {
            type: 'separator'
        },
        {
            type: 'button',
            ariaLabel: 'Horizontal Rule',
            icon: <HorizontalRuleIcon size={24} />,
            onClick: () => editor.chain().focus().setHorizontalRule().run(),
            property: 'horizontalRule'
        },
        {
            type: 'button',
            ariaLabel: 'Hard Break',
            icon: '↵',
            onClick: () => editor.chain().focus().setHardBreak().run(),
            property: 'hardBreak'
        },
        {
            type: 'separator'
        },
        {
            type: 'button',
            ariaLabel: 'Undo',
            icon: <UndoIcon size={18} />,
            onClick: () => editor.chain().focus().undo().run(),
            property: 'undo',
            disabled: !editor.can().chain().focus().undo().run()
        },
        {
            type: 'button',
            ariaLabel: 'Redo',
            icon: <RedoIcon size={18} />,
            onClick: () => editor.chain().focus().redo().run(),
            property: 'redo',
            disabled: !editor.can().chain().focus().redo().run()
        }
    ];

    return (
        <div className='fixed left-1/2 top-20 z-20 flex min-h-14 w-[90vw] max-w-[70rem] -translate-x-1/2 items-center justify-between rounded-[14px] bg-white/20 p-2 shadow-lg'>
            <div className='flex items-center'>
                {buttons.map((el, idx) =>
                    el.type === 'separator' ? (
                        <div key={idx} className={`mx-1 h-10 w-0.5 rounded-full bg-white ${el.hidden ? 'bg-opacity-0' : 'bg-opacity-20'} grid`}></div>
                    ) : (
                        <button
                            key={idx}
                            onClick={el.onClick}
                            aria-label={el.ariaLabel}
                            disabled={el.disabled}
                            className={`mx-1 grid aspect-square h-10 place-items-center rounded-md p-2 text-white/80 hover:bg-white/20 focus-visible:outline-none disabled:!bg-transparent disabled:text-white/30 ${editor.isActive(el.property, { level: el.level }) ? '!bg-white/30' : ''}`}>
                            {el.icon}
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default MenuBar;
