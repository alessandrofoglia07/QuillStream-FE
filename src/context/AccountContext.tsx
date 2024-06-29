import { type PropsWithChildren, createContext } from 'react';
import { userPool } from '@/utils/userPool';
import { AuthenticationDetails, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import { passwordSchema } from '@/utils/schemas/authSchemas';

interface IAuthContext {
    authenticate: (Username: string, Password: string) => Promise<CognitoUserSession>;
    getSession: () => Promise<CognitoUserSession | null>;
    logout: () => void;
}

const AccountContext = createContext<IAuthContext>({} as IAuthContext);

const Account = ({ children }: PropsWithChildren) => {
    const getSession = async () => {
        return await new Promise<CognitoUserSession | null>((resolve, reject) => {
            const user = userPool.getCurrentUser();
            if (!user) return reject();
            user.getSession((err: Error | null, session: CognitoUserSession | null) => {
                if (err) reject(err);
                else resolve(session);
            });
        });
    };

    const authenticate = async (UsernameOrEmail: string, Password: string) => {
        return await new Promise<CognitoUserSession>((resolve, reject) => {
            if (!UsernameOrEmail || !Password) {
                reject('Please fill in all fields.');
            } else if (!passwordSchema.safeParse(Password).success) {
                reject('Invalid password.');
            } else {
                const cognitoUser = new CognitoUser({ Username: UsernameOrEmail, Pool: userPool });

                const authenticationDetails = new AuthenticationDetails({ Username: UsernameOrEmail, Password });

                cognitoUser.authenticateUser(authenticationDetails, {
                    onSuccess: (data) => resolve(data),
                    onFailure: (err) => reject(err)
                });
            }
        });
    };

    const logout = () => {
        const user = userPool.getCurrentUser();
        if (!user) return;
        user.signOut();
    };

    return <AccountContext.Provider value={{ authenticate, getSession, logout }}>{children}</AccountContext.Provider>;
};

export { Account, AccountContext };
