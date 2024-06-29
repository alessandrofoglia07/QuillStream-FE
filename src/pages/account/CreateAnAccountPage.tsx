import React, { useContext, useState } from 'react';
import { formSchemaSubmit } from '@/utils/schemas/authSchemas';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { userPool } from '@/utils/userPool';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '@/components/PasswordInput';
import useRedirectToAccount from '@/hooks/useRedirectToAccount';
import { NotificationContext } from '@/context/NotificationContext';
import type { Notification } from '@/types';
import { handleError } from '@/utils/handleError';

interface Form {
    name: string;
    email: string;
    password: string;
}

const CreateAnAccountPage: React.FC = () => {
    useRedirectToAccount();
    const navigate = useNavigate();
    const { setNotification } = useContext(NotificationContext);

    const [formData, setFormData] = useState<Form>({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            formSchemaSubmit.parse(formData);
            setError(null);

            const email = new CognitoUserAttribute({ Name: 'email', Value: formData.email });

            userPool.signUp(formData.name, formData.password, [email], [], (err) => {
                if (err) {
                    console.log(err);
                    setError(err.message || 'An error occurred. Please try again.');
                } else {
                    const notification: Notification = {
                        message: 'Account created successfully. Please verify your email.',
                        type: 'success'
                    };
                    setNotification(notification);
                    navigate(`/account/confirm?name=${formData.name}`);
                }
            });
        } catch (err) {
            handleError(err, setError);
        }
    };

    const redirectToSignIn = () => {
        navigate('/account/signin');
    };

    return (
        <div className='bg-gradient h-svh w-full'>
            <div className='centered bg-gradient-gray flex h-max w-[30rem] max-w-full flex-col items-center rounded-llg px-8 py-16 shadow-xl md:px-12'>
                <h1 className='w-full text-4xl font-bold tracking-tight'>Create an account</h1>
                <h2 className='w-full pt-2 tracking-wide opacity-90'>QuillStream accounts are private and secure.</h2>
                <form
                    onSubmit={handleSubmit}
                    className='flex w-full flex-col space-y-4 pb-2 pt-12 *:rounded-llg *:border *:border-gray-600/50 *:bg-light-grey *:px-6 *:py-3 *:focus-within:outline-none'
                    autoComplete='off'
                    spellCheck={false}>
                    <input type='text' name='name' autoFocus placeholder='Name' value={formData.name} onChange={handleChange} />
                    <input type='email' name='email' placeholder='Email' value={formData.email} onChange={handleChange} />
                    <PasswordInput name='password' value={formData.password} onChange={handleChange} />
                </form>
                <button
                    disabled={Object.values(formData).some((field) => field.length === 0)}
                    className='mt-4 w-2/3 rounded-llg border border-gray-600/50 bg-light-grey/70 py-3 transition-colors duration-75 disabled:bg-light-grey disabled:text-white/60'
                    onClick={handleSubmit}>
                    Create an account
                </button>
                {error && <h6 className='mt-2 min-h-4 text-center text-red-400'>{error}</h6>}
                <button onClick={redirectToSignIn} className='mt-2 rounded-llg bg-transparent px-8 py-2 text-white/60 transition-colors duration-75 hover:bg-light-grey'>
                    Sign In
                </button>
            </div>
        </div>
    );
};

export default CreateAnAccountPage;
