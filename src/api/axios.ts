import { userPool } from '@/utils/userPool';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import axiosbase from 'axios';

const axios = axiosbase.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

axios.interceptors.request.use((config) => {
    const user = userPool.getCurrentUser();
    if (user) {
        user.getSession((err: Error | null, session: CognitoUserSession | null) => {
            if (err) {
                console.error(err);
            } else {
                const accessToken = session!.getAccessToken().getJwtToken();
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
        });
    }
    return config;
});

export default axios;