import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    'data-secondary'?: boolean;
}

const Button: React.FC<Props> = (props: Props) => {
    const { children, className } = props;

    if (props['data-secondary']) {
        return (
            <button
                {...props}
                data-secondary={undefined}
                className={`mt-2 rounded-md bg-transparent px-8 py-2 text-sm/6 text-white/60 transition-colors duration-75 hover:bg-light-grey ${className}`}>
                {children}
            </button>
        );
    }

    return (
        <button
            {...props}
            className={`rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white ${className}`}>
            {children}
        </button>
    );
};

export default Button;
