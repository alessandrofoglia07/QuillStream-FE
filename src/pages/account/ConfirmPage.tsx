import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { userPool } from '@/utils/userPool';
import useRedirectToAccount from '@/hooks/useRedirectToAccount';
import { confirmCodeSchema } from '@/utils/schemas/authSchemas';
import { handleError } from '@/utils/handleError';
import type { Notification } from '@/types';
import { NotificationContext } from '@/context/NotificationContext';
import Button from '@/components/CustomButton';

const ConfirmPage = () => {
    useRedirectToAccount();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setNotification } = useContext(NotificationContext);

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
                handleError(err, setError);
            } else {
                setError(null);
                const notification: Notification = {
                    message: 'Account successfully verified. Please log in.',
                    type: 'success'
                };
                setNotification(notification);
                navigate('/account/signin');
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
                handleError(err, setResendCodeMsg);
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
                        className='rounded-llg border border-white/5 bg-light-grey px-6 py-3 focus-within:outline-none'
                        value={code}
                        autoFocus
                        onChange={handleChange}
                    />
                </form>
                {error && <h6 className='min-h-4 py-6 text-center text-red-400'>{error}</h6>}
                <p className='pb-4 pt-2 text-center'>
                    Having trouble?{' '}
                    <span onClick={handleResend} className='text-taupe cursor-pointer hover:underline'>
                        Resend code
                    </span>
                </p>
                {resendCodeMsg && <h6 className='min-h-4 py-2 text-center'>{resendCodeMsg}</h6>}
                <Button disabled={code.length === 0} className='mt-4 w-2/3 !py-3 disabled:text-white/60' onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default ConfirmPage;
