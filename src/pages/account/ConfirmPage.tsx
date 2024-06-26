import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { userPool } from '@/utils/userPool';
import useRedirectToAccount from '@/hooks/useRedirectToAccount';
import { confirmCodeSchema } from '@/utils/schemas/authSchemas';

const ConfirmPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    useRedirectToAccount();

    const [error, setError] = useState<string | null>(null);
    const [resendCodeMsg, setResendCodeMsg] = useState<string | null>(null);
    const [code, setCode] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const confirmCodeResult = confirmCodeSchema.safeParse(code);
        if (!confirmCodeResult.success) {
            return setError(confirmCodeResult.error.errors[0]?.message || 'Invalid confirmation code.');
        }

        const name = searchParams.get('name');
        if (!name) {
            return setError('Username is required.');
        }

        const cognitoUser = new CognitoUser({ Username: name, Pool: userPool });

        cognitoUser.confirmRegistration(code, true, (err?: Error) => {
            if (err) {
                setError(err.message || 'An error occurred. Please try again.');
            } else {
                setError(null);
                navigate('/account/login');
            }
        });
    };

    const handleResend = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const name = searchParams.get('name');
        if (!name) {
            return setError('Name is required.');
        }

        const cognitoUser = new CognitoUser({ Username: name, Pool: userPool });

        cognitoUser.resendConfirmationCode((err?: Error) => {
            if (err) {
                setResendCodeMsg(err.message || 'An error occurred. Please try again.');
            } else {
                setResendCodeMsg('Code resent successfully.');
            }
        });
    };

    useEffect(() => {
        setResendCodeMsg(null);
    }, [error]);

    return (
        <div className='bg-gradient h-svh w-full'>
            <div className='centered bg-gradient-gray flex h-max w-[30rem] max-w-full flex-col items-center rounded-llg px-8 py-16 shadow-xl md:px-12'>
                <h1 className='w-full text-4xl font-bold tracking-tight'>Verify email</h1>
                <h2 className='w-full pt-2 tracking-wide opacity-90'>A confirmation email has been sent to you.</h2>
                <form onSubmit={handleSubmit} className='flex w-full flex-col space-y-4 pb-2 pt-12' autoComplete='off' spellCheck={false}>
                    <input
                        type='number'
                        name='code'
                        placeholder='Confirmation code'
                        className='rounded-llg border border-gray-600/50 bg-light-grey px-6 py-3 focus-within:outline-none'
                        value={code}
                        autoFocus
                        onChange={handleChange}
                    />
                </form>
                {error && <h6 className='h-4 py-6 text-center text-red-400'>{error}</h6>}
                <p className='pb-4 pt-2 text-center'>
                    Having trouble?{' '}
                    <span onClick={handleResend} className='text-taupe cursor-pointer hover:underline'>
                        Resend code
                    </span>
                </p>
                {resendCodeMsg && <h6 className='h-4 py-6 text-center'>{resendCodeMsg}</h6>}
                <button
                    disabled={code.length === 0}
                    className='mt-4 w-2/3 rounded-llg border border-gray-600/50 bg-light-grey/70 px-16 py-3 transition-colors duration-75 disabled:bg-light-grey disabled:text-white/60'
                    onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default ConfirmPage;
