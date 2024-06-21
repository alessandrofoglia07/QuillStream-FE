import React, { useState } from 'react';

interface Form {
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<Form>({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    };

    return (
        <div className='bg-gradient h-svh w-full'>
            <div className='centered bg-gradient-gray flex h-max w-[30rem] max-w-full flex-col items-center rounded-llg px-8 py-16 shadow-xl md:px-12'>
                <h1 className='w-full text-4xl font-bold tracking-tight'>Login</h1>
                <h2 className='w-full pt-2 tracking-wide opacity-90'>Welcome back to QuillStream.</h2>
                <form
                    onSubmit={handleSubmit}
                    className='flex w-full flex-col space-y-4 pb-4 pt-12 *:rounded-llg *:border *:border-gray-600/50 *:bg-light-grey *:px-6 *:py-3 *:focus-within:outline-none'
                    autoComplete='off'
                    spellCheck={false}>
                    <input type='email' name='email' placeholder='Email' value={formData.email} onChange={handleChange} />
                    <input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleChange} />
                </form>
                <button
                    disabled={Object.values(formData).some((field) => field.length === 0)}
                    className='rounded-llg border border-gray-600/50 bg-light-grey/70 px-16 py-3 transition-colors duration-75 disabled:bg-light-grey disabled:text-white/60'
                    onClick={handleSubmit}>
                    Login
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
