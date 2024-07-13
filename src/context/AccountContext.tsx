import { type PropsWithChildren, createContext } from 'react';
import { userPool } from '@/utils/userPool';
import { AuthenticationDetails, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import { passwordSchema } from '@/utils/schemas/authSchemas';

interface IAuthContext {
    authenticate: (Username: string, Password: string) => Promise<CognitoUserSession>;
    getSession: () => Promise<CognitoUserSession | null>;
    updateAppearance: (appearance: number) => Promise<void>;
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

    const updateAppearance = async (appearance: number) => {
        return await new Promise<void>((resolve, reject) => {
            if (appearance < 1 || appearance > 9) return reject('Appearance value out of range.');
            const user = userPool.getCurrentUser();
            if (!user) return reject('No user found.');
            user.getSession((err: Error | null) => {
                if (err) return reject(err);
                user.updateAttributes(
                    [
                        {
                            Name: 'custom:appearance',
                            Value: appearance.toString()
                        }
                    ],
                    (err) => {
                        if (err) return reject(err);
                        resolve();
                    }
                );
            });
        });
    };

    const logout = () => {
        const user = userPool.getCurrentUser();
        if (!user) return;
        user.signOut();
    };

    return <AccountContext.Provider value={{ authenticate, getSession, logout, updateAppearance }}>{children}</AccountContext.Provider>;
};

export { Account, AccountContext };
