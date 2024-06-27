import React, { useState } from 'react';
import { userPool } from '@/utils/userPool';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { useNavigate } from 'react-router-dom';

const ForgotPage: React.FC = () => {
    const navigate = useNavigate();

    const [input, setInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResult(null);
        setInput(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            const cognitoUser = new CognitoUser({ Username: input, Pool: userPool });

            cognitoUser.forgotPassword({
                onFailure: (err) => {
                    setError(err.message || 'An error occurred. Please try again.');
                },
                onSuccess: () => {
                    setResult('An email has been sent to reset your password.');
                }
            });
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'An error occurred. Please try again.');
            } else if (typeof err === 'string') {
                setError(err);
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    const handleCancel = () => {
        navigate('/account/login');
    };

    return (
        <div className='bg-gradient h-svh w-full'>
            <div className='centered bg-gradient-gray flex h-max w-[30rem] max-w-full flex-col items-center rounded-llg px-8 py-16 shadow-xl md:px-12'>
                <h1 className='w-full text-4xl font-bold tracking-tight'>Find your account</h1>
                <h2 className='w-full pt-2 tracking-wide opacity-90'>Please enter your name or email to search for your account.</h2>
                <form
                    onSubmit={handleSubmit}
                    className='flex w-full flex-col space-y-4 pb-2 pt-8 *:rounded-llg *:border *:border-gray-600/50 *:bg-light-grey *:px-6 *:py-3 *:focus-within:outline-none'
                    autoComplete='off'
                    spellCheck={false}>
                    <input type='text' placeholder='Name or Email' value={input} onChange={handleChange} />
                </form>
                {error && <h6 className='min-h-6 text-center text-red-400'>{error}</h6>}
                {result && <h6 className='min-h-6 text-center'>{result}</h6>}
                <div className='flex w-full items-center justify-center gap-2 pt-4'>
                    <button className='w-1/3 rounded-llg border border-gray-600/50 bg-light-grey/70 py-3' onClick={handleCancel}>
                        Cancel
                    </button>
                    <button
                        disabled={input === ''}
                        className='w-1/2 rounded-llg border border-gray-600/50 bg-light-grey/70 py-3 transition-colors duration-75 disabled:bg-light-grey disabled:text-white/60'
                        onClick={handleSubmit}>
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPage;
