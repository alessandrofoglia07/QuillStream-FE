import { createContext, type PropsWithChildren, useState } from 'react';
import type { Notification } from '@/types';
import { FaCheckCircle as CheckIcon, FaTimesCircle as ErrorIcon, FaInfoCircle as InfoIcon, FaTimes as XIcon } from 'react-icons/fa';

type TimeoutNotification = Pick<Notification, 'message' | 'type'> & { timeout: ReturnType<typeof setTimeout> | null };

interface INotificationContext {
    setNotification: (notification: Notification) => void;
    clearNotification: () => void;
}

const NotificationContext = createContext<INotificationContext>({} as INotificationContext);

const Notification = ({ children }: PropsWithChildren) => {
    const [notification, setNotificationState] = useState<TimeoutNotification | null>(null);

    const clearNotification = () => setNotificationState(null);

    const setNotification = (newNotification: Notification) => {
        if (notification && notification.timeout) {
            clearTimeout(notification.timeout);
            clearNotification();
        }

        const timeout = setTimeout(() => {
            clearNotification();
        }, newNotification.duration || 5000);

        delete newNotification.duration;

        setNotificationState({ ...newNotification, timeout });
    };

    return (
        <NotificationContext.Provider value={{ setNotification, clearNotification }}>
            {children}
            {notification && (
                <div
                    style={{ borderLeftColor: notification.type === 'success' ? '#22c55e' : notification.type === 'error' ? '#f43f5e' : '#0ea5e9' }}
                    className='fixed bottom-12 right-0 grid h-24 w-96 grid-cols-[1.3fr_6fr_0.5fr] items-center gap-4 rounded-md border-l-[12px] bg-light-grey p-4 sm:right-6 md:right-12'>
                    <div className='self-center rounded-lg p-1'>
                        {notification.type === 'success' && <CheckIcon size={35} className='text-green-500' />}
                        {notification.type === 'error' && <ErrorIcon size={35} className='text-rose-500' />}
                        {notification.type === 'info' && <InfoIcon size={35} className='text-sky-500' />}
                    </div>
                    <div className='self-center'>
                        <h1 className='text-lg font-bold'>{notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}</h1>
                        <h2 className='text-sm text-white/80'>{notification.message}</h2>
                    </div>
                    <button className='self-start leading-[0] text-white/80' onClick={clearNotification}>
                        <XIcon />
                    </button>
                </div>
            )}
        </NotificationContext.Provider>
    );
};

export { NotificationContext, Notification };
