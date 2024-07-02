import React, { useContext, useState } from 'react';
import { userPool } from '@/utils/userPool';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { useNavigate, useParams } from 'react-router-dom';
import PasswordInput from '@/components/PasswordInput';
import { passwordSchema } from '@/utils/schemas/authSchemas';
import useRedirectToAccount from '@/hooks/useRedirectToAccount';
import { handleError } from '@/utils/handleError';
import { NotificationContext } from '@/context/NotificationContext';
import { Notification } from '@/types';
import Button from '@/components/CustomButton';

const ResetPage: React.FC = () => {
    useRedirectToAccount();
    const { email, code } = useParams();
    const navigate = useNavigate();
    const { setNotification } = useContext(NotificationContext);

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
                    const notification: Notification = {
                        message: 'Password successfully changed. Please log in.',
                        type: 'success'
                    };
                    setNotification(notification);
                    navigate('/account/signin');
                },
                onFailure: (err) => {
                    handleError(err, setError);
                }
            });
        } catch (err) {
            handleError(err, setError);
        }
    };

    return (
        <div className='bg-gradient h-svh w-full'>
            <div className='centered bg-gradient-gray flex h-max w-[30rem] max-w-full flex-col items-center rounded-llg px-8 py-16 shadow-xl md:px-12'>
                <h1 className='w-full text-4xl font-bold tracking-tight'>Change Password</h1>
                <h2 className='w-full pt-2 tracking-wide opacity-90'>Please enter a new password for your account.</h2>
                <form
                    onSubmit={handleSubmit}
                    className='flex w-full flex-col space-y-4 pb-2 pt-8 *:rounded-llg *:border *:border-white/5 *:bg-light-grey *:px-6 *:py-3 *:focus-within:outline-none'
                    autoComplete='off'
                    spellCheck={false}>
                    <PasswordInput name='newPassword' placeholder='New Password' value={formData.newPassword} onChange={handleChange} />
                    <PasswordInput name='confirmPassword' placeholder='Confirm New Password' value={formData.confirmPassword} onChange={handleChange} />
                </form>
                {error && <h6 className='min-h-6 text-center text-red-400'>{error}</h6>}
                <Button
                    disabled={!formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword}
                    className='mt-4 w-2/3 !py-3 disabled:text-white/60'
                    onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default ResetPage;
