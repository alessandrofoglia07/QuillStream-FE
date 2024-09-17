import { useCurrentEditor } from '@tiptap/react';
import {
    FaBold as BoldIcon,
    FaItalic as ItalicIcon,
    FaStrikethrough as StrikeIcon,
    FaCode as CodeIcon,
    FaParagraph as ParagraphIcon,
    FaUndo as UndoIcon,
    FaRedo as RedoIcon,
    FaUserFriends as EditorsIcon
} from 'react-icons/fa';
import { PiCodeBlockBold as CodeBlockIcon } from 'react-icons/pi';
import { LuHeading1 as Heading1Icon, LuHeading2 as Heading2Icon, LuHeading3 as Heading3Icon } from 'react-icons/lu';
import { MdFormatListBulleted as BulletListIcon } from 'react-icons/md';
import { GoListOrdered as OrderedListIcon } from 'react-icons/go';
import { TbBlockquote as BlockquoteIcon } from 'react-icons/tb';
import { VscHorizontalRule as HorizontalRuleIcon } from 'react-icons/vsc';
import React, { useContext, useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import Button from './CustomButton';
import { handleError } from '@/utils/handleError';
import { NotificationContext } from '@/context/NotificationContext';
import axios from '@/api/axios';
import { Document, User } from '@/types';
import Spinner from './Spinner';
import { appearanceToIcon } from '@/utils/appearanceIconConverter';

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

interface Props {
    document: Document;
}

const MenuBar: React.FC<Props> = ({ document }: Props) => {
    const { editor } = useCurrentEditor();
    const { setNotification } = useContext(NotificationContext);

    const [editorsModalOpen, setEditorsModalOpen] = useState(false);
    const [editorsModalLoading, setEditorsModalLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeEditors, setActiveEditors] = useState<User[]>([]);
    const [inactiveEditors, setInactiveEditors] = useState<User[]>([]);

    const openEditorsModal = async () => {
        setEditorsModalOpen(true);
        setEditorsModalLoading(true);
        try {
            const { data } = (await axios.get(`/documents/${document.documentId}/editors`)) as { data: { activeEditors: User[]; inactiveEditors: User[] } };
            setActiveEditors(data.activeEditors);
            setInactiveEditors(data.inactiveEditors);
        } catch (err) {
            const result = handleError(err);
            setNotification(result.notification);
            setError(result.message);
            console.log(err);
        } finally {
            setEditorsModalLoading(false);
        }
    };

    useEffect(() => {}, [editorsModalOpen]);

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
                            title={el.ariaLabel}
                            className={`mx-1 grid aspect-square h-10 place-items-center rounded-md p-2 text-white/80 hover:bg-white/20 focus-visible:outline-none disabled:!bg-transparent disabled:text-white/30 ${editor.isActive(el.property, { level: el.level }) ? '!bg-white/30' : ''}`}>
                            {el.icon}
                        </button>
                    )
                )}
            </div>
            <div className='grid place-items-center'>
                <button
                    title='Invite editors'
                    onClick={openEditorsModal}
                    aria-label='Invite editors'
                    className='grid aspect-square h-10 place-items-center rounded-md p-2 text-white/80 hover:bg-white/20 focus-visible:outline-none'>
                    <EditorsIcon size={20} />
                </button>
            </div>
            <Dialog open={editorsModalOpen} as='div' className='relative z-20 focus:outline-none' onClose={() => setEditorsModalOpen(false)}>
                <div className='fixed top-0 z-10 h-full w-full bg-black opacity-45' />
                <div className='fixed inset-0 z-20 w-screen overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4'>
                        <DialogPanel transition className='w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl'>
                            {editorsModalLoading ? (
                                <Spinner className='mx-auto my-auto h-10 w-10' />
                            ) : error !== null ? (
                                <>
                                    <DialogTitle as='h3' className='text-base/5 font-medium text-white'>
                                        Invite Editors
                                    </DialogTitle>
                                    <p className='py-4 font-mono text-red-500'>{error}</p>
                                </>
                            ) : (
                                <>
                                    <DialogTitle as='h3' className='text-base/5 font-medium text-white'>
                                        Active Editors
                                    </DialogTitle>
                                    {activeEditors.map((editor, i) => (
                                        <div key={i} className='mt-2 flex items-center'>
                                            <div className='rounded-full bg-white/30 p-3'>{appearanceToIcon(editor.appearance.toString(), 'text-2xl text-white')}</div>
                                            <p className='ml-2 text-white'>{editor.name}</p>
                                            <p className='ml-2 text-white/50'>{editor.role[0]?.toUpperCase() + editor.role.slice(1)}</p>
                                        </div>
                                    ))}
                                    {inactiveEditors.length > 0 && (
                                        <>
                                            <DialogTitle as='h3' className='text-base/5 font-medium text-white'>
                                                Inactive Editors
                                            </DialogTitle>
                                            {}
                                        </>
                                    )}
                                    <p className='mt-2 cursor-default text-sm/6 text-white/50'>Are you sure you want to navigate to your account? You will lose any unsaved changes.</p>
                                    <div className='mt-4 flex w-full items-center'>
                                        <Button onClick={() => {}}>Continue</Button>
                                        <Button className='ml-2' onClick={() => setEditorsModalOpen(false)}>
                                            Back
                                        </Button>
                                    </div>
                                </>
                            )}
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default MenuBar;
