import Button from '@/components/CustomButton';
import PasswordInput from '@/components/PasswordInput';
import { AccountContext } from '@/context/AccountContext';
import { NotificationContext } from '@/context/NotificationContext';
import useRedirectToAccount from '@/hooks/useRedirectToAccount';
import { Notification } from '@/types';
import { handleError } from '@/utils/handleError';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Form {
    nameOrEmail: string;
    password: string;
}

const SignInPage: React.FC = () => {
    useRedirectToAccount();
    const navigate = useNavigate();
    const { authenticate } = useContext(AccountContext);
    const { setNotification } = useContext(NotificationContext);

    const [formData, setFormData] = useState<Form>({
        nameOrEmail: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            await authenticate(formData.nameOrEmail, formData.password);
            const notification: Notification = {
                message: 'Successfully signed in. \nWelcome to QuillStream.',
                type: 'success'
            };
            setNotification(notification);
            navigate('/');
        } catch (err) {
            handleError(err, setError);
        }
    };

    const handleForgotPassword = () => {
        navigate('/account/forgot');
    };

    const redirectToCreateAnAccount = () => {
        navigate('/account/create-an-account');
    };

    return (
        <div className='bg-gradient h-svh w-full'>
            <div className='centered bg-gradient-gray flex h-max w-[30rem] max-w-full flex-col items-center rounded-llg px-8 py-16 shadow-xl md:px-12'>
                <h1 className='w-full text-4xl font-bold tracking-tight'>Sign in</h1>
                <h2 className='w-full pt-2 tracking-wide opacity-90'>Welcome back to QuillStream.</h2>
                <form
                    onSubmit={handleSubmit}
                    className='flex w-full flex-col space-y-4 pt-12 *:rounded-llg *:border *:border-white/5 *:bg-light-grey *:px-6 *:py-3 *:focus-within:outline-none'
                    autoComplete='off'
                    spellCheck={false}>
                    <input type='text' autoFocus name='nameOrEmail' placeholder='Name or Email' value={formData.nameOrEmail} onChange={handleChange} />
                    <PasswordInput name='password' value={formData.password} onChange={handleChange} />
                </form>
                <Button data-secondary onClick={handleForgotPassword} className='mb-2 mt-4'>
                    Forgot Password
                </Button>
                <Button disabled={Object.values(formData).some((field) => field.length === 0)} className='w-2/3 py-3 disabled:text-white/60' onClick={handleSubmit}>
                    Sign In
                </Button>
                {error && <h6 className='mt-2 min-h-4 text-center text-red-400'>{error}</h6>}
                <Button data-secondary onClick={redirectToCreateAnAccount}>
                    Create an Account
                </Button>
            </div>
        </div>
    );
};

export default SignInPage;
