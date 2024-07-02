import React, { useState } from 'react';
import { userPool } from '@/utils/userPool';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { useNavigate } from 'react-router-dom';
import useRedirectToAccount from '@/hooks/useRedirectToAccount';
import { handleError } from '@/utils/handleError';
import Button from '@/components/CustomButton';

const ForgotPage: React.FC = () => {
    useRedirectToAccount();
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
                    handleError(err, setError);
                },
                onSuccess: () => {
                    setResult('An email has been sent to reset your password.');
                }
            });
        } catch (err) {
            handleError(err, setError);
        }
    };

    const handleCancel = () => {
        navigate('/account/signin');
    };

    return (
        <div className='bg-gradient h-svh w-full'>
            <div className='centered bg-gradient-gray flex h-max w-[30rem] max-w-full flex-col items-center rounded-llg px-8 py-16 shadow-xl md:px-12'>
                <h1 className='w-full text-4xl font-bold tracking-tight'>Find your account</h1>
                <h2 className='w-full pt-2 tracking-wide opacity-90'>Please enter your name or email to search for your account.</h2>
                <form
                    onSubmit={handleSubmit}
                    className='flex w-full flex-col space-y-4 pb-2 pt-8 *:rounded-llg *:border *:border-white/5 *:bg-light-grey *:px-6 *:py-3 *:focus-within:outline-none'
                    autoComplete='off'
                    spellCheck={false}>
                    <input type='text' placeholder='Name or Email' value={input} onChange={handleChange} />
                </form>
                {error && <h6 className='min-h-6 text-center text-red-400'>{error}</h6>}
                {result && <h6 className='min-h-6 text-center'>{result}</h6>}
                <div className='flex w-full items-center justify-center gap-2 pt-4'>
                    <Button className='w-1/3 !py-3' onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button disabled={input === ''} className='w-1/2 !py-3 disabled:text-white/60' onClick={handleSubmit}>
                        Search
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPage;
