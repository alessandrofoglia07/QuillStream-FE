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

axios.interceptors.response.use(response => response, async (err) => {
    const config = err.config;
    if (err.response?.status === 401 && !config.__isRetryRequest) {
        config.__isRetryRequest = true;
        config.__retryCount = config.__retryCount || 0;

        const user = userPool.getCurrentUser();
        if (user) {
            try {
                await new Promise<void>((resolve, reject) => {
                    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
                        if (err) reject(err);
                        else {
                            const accessToken = session!.getAccessToken().getJwtToken();
                            config.headers['Authorization'] = `Bearer ${accessToken}`;
                            resolve();
                        }
                    });
                });
                return axios(config);
            } catch (err) {
                console.error('Failed to refresh session: ', err);
            }
        }
    }

    if (config.__retryCount < 3) {
        config.__retryCount++;
        return new Promise((resolve) => {
            setTimeout(() => resolve(axios(config)), 1000);
        });
    }

    if (err.response?.status === 401) {
        userPool.getCurrentUser()?.signOut();
    }
    return Promise.reject(err);
});

export default axios;