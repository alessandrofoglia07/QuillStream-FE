import React, { InputHTMLAttributes, useState } from 'react';
import { FiEye as ShowPassIcon, FiEyeOff as HidePassIcon } from 'react-icons/fi';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    containerClassName?: string;
}

const PasswordInput: React.FC<Props> = (props: Props) => {
    const [showPass, setShowPass] = useState(false);

    const inputProps = { ...props };
    delete inputProps.containerClassName;
    delete inputProps.className;

    return (
        <div className={`flex items-center ${props.containerClassName}`}>
            <input type={showPass ? 'text' : 'password'} placeholder='Password' className={`w-5/6 bg-light-grey focus-visible:outline-none ${props.className}`} {...inputProps} />
            <div className='grid h-full w-1/6 place-items-end px-1'>
                <button
                    aria-label='toggle-password-visibility'
                    type='button'
                    onKeyDown={(e) => e.key === 'Enter' && setShowPass((prev) => !prev)}
                    className='aspect-square h-full rounded-full text-center outline-offset-4'>
                    {showPass ? (
                        <HidePassIcon className='text-xl text-white/60' onClick={() => setShowPass(false)} />
                    ) : (
                        <ShowPassIcon className='text-xl text-white/60' onClick={() => setShowPass(true)} />
                    )}
                </button>
            </div>
        </div>
    );
};

export default PasswordInput;
