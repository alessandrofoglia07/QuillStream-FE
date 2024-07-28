import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { FaChevronDown as ChevronDownIcon } from 'react-icons/fa';
import { FaCheck as CheckIcon } from 'react-icons/fa6';

interface Props {
    buttonText: React.ReactNode;
    options: string[];
    selectedOption: string | undefined;
    setSelectedOption: (option: string) => void;
}

const DropdownMenu: React.FC<Props> = ({ buttonText, options, selectedOption, setSelectedOption }) => {
    return (
        <Menu>
            <MenuButton className='inline-flex items-center gap-2 rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white'>
                {buttonText}
                <ChevronDownIcon className='size-4 fill-white/60' />
            </MenuButton>
            <MenuItems
                transition
                anchor='bottom start'
                className='w-52 origin-top-right rounded-xl border border-white/5 bg-light-grey p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0'>
                {options.map((option) => (
                    <MenuItem key={option}>
                        <button onClick={() => setSelectedOption(option)} className='group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10'>
                            <span className='size-4 fill-white/30'>{selectedOption === option && <CheckIcon />}</span>
                            {option}
                        </button>
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>
    );
};

export default DropdownMenu;
