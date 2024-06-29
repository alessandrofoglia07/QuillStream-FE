import React, { useState } from 'react';
import { userPool } from '@/utils/userPool';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { useNavigate, useParams } from 'react-router-dom';
import PasswordInput from '@/components/PasswordInput';
import { ZodError } from 'zod';
import { passwordSchema } from '@/utils/schemas/authSchemas';
import useRedirectToAccount from '@/hooks/useRedirectToAccount';

const ResetPage: React.FC = () => {
    useRedirectToAccount();
    const { email, code } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            passwordSchema.parse(formData.newPassword);
            if (!email || !code) throw new Error('An error occurred. Please try again.');
            if (formData.newPassword !== formData.confirmPassword) throw new Error('Passwords do not match.');

            const user = new CognitoUser({ Username: email, Pool: userPool });

            user.confirmPassword(code, formData.newPassword, {
                onSuccess: () => {
                    navigate('/account/signin', { state: { message: 'Password successfully changed. Please log in.' } });
                },
                onFailure: (err) => {
                    setError(err.message || 'An error occurred. Please try again.');
                }
            });
        } catch (err) {
            if (err instanceof ZodError) {
                setError(err.errors[0]?.message || 'An error occurred. Please try again.');
            } else if (err instanceof Error) {
                setError(err.message || 'An error occurred. Please try again.');
            } else if (typeof err === 'string') {
                setError(err);
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className='bg-gradient h-svh w-full'>
            <div className='centered bg-gradient-gray flex h-max w-[30rem] max-w-full flex-col items-center rounded-llg px-8 py-16 shadow-xl md:px-12'>
                <h1 className='w-full text-4xl font-bold tracking-tight'>Change Password</h1>
                <h2 className='w-full pt-2 tracking-wide opacity-90'>Please enter a new password for your account.</h2>
                <form
                    onSubmit={handleSubmit}
                    className='flex w-full flex-col space-y-4 pb-2 pt-8 *:rounded-llg *:border *:border-gray-600/50 *:bg-light-grey *:px-6 *:py-3 *:focus-within:outline-none'
                    autoComplete='off'
                    spellCheck={false}>
                    <PasswordInput name='newPassword' placeholder='New Password' value={formData.newPassword} onChange={handleChange} />
                    <PasswordInput name='confirmPassword' placeholder='Confirm New Password' value={formData.confirmPassword} onChange={handleChange} />
                </form>
                {error && <h6 className='min-h-6 text-center text-red-400'>{error}</h6>}
                <button
                    disabled={!formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword}
                    className='mt-4 w-2/3 rounded-llg border border-gray-600/50 bg-light-grey/70 px-16 py-3 transition-colors duration-75 disabled:bg-light-grey disabled:text-white/60'
                    onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default ResetPage;
