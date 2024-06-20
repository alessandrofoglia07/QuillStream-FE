import React, { useState } from 'react';
import { ZodError, z } from 'zod';

interface Form {
    name: string;
    email: string;
    password: string;
}

const formSchemaSubmit = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long.').max(32, 'Name must not exceed 32 characters.'),
    email: z.string().email('Invalid email address. Did you make a typo?'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long.')
        .refine((password) => {
            return /[a-z]/.test(password);
        }, 'Password must contain at least one lowercase letter.')
        .refine((password) => {
            return /[0-9]/.test(password);
        }, 'Password must contain at least one number.')
});

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState<Form>({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            formSchemaSubmit.parse(formData);
            setError('');
        } catch (err) {
            if (err instanceof ZodError) {
                setError(err.errors[0]?.message || 'An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className='bg-gradient h-svh w-full'>
            <div className='centered bg-gradient-gray flex min-h-max min-w-[30rem] flex-col items-center rounded-llg px-12 py-16 shadow-xl'>
                <h1 className='w-full text-4xl font-bold tracking-tight'>Register</h1>
                <h2 className='w-full pt-2 tracking-wide opacity-90'>QuillStream accounts are private and secure.</h2>
                <form
                    onSubmit={handleSubmit}
                    className='flex w-full flex-col space-y-4 pb-4 pt-12 *:rounded-llg *:border *:border-gray-600/50 *:bg-light-grey *:px-6 *:py-3 *:focus-within:outline-none'
                    autoComplete='off'
                    spellCheck={false}>
                    <input type='text' name='name' placeholder='Name' value={formData.name} onChange={handleChange} />
                    <input type='email' name='email' placeholder='Email' value={formData.email} onChange={handleChange} />
                    <input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleChange} />
                </form>
                <h6 className='h-4 pb-12 text-center text-red-400'>{error}</h6>
                <button
                    disabled={Object.values(formData).some((field) => field.length === 0)}
                    className='rounded-llg border border-gray-600/50 bg-light-grey/70 px-16 py-3 transition-colors duration-75 disabled:bg-light-grey disabled:text-white/60'
                    onClick={handleSubmit}>
                    Register
                </button>
            </div>
        </div>
    );
};

export default RegisterPage;
