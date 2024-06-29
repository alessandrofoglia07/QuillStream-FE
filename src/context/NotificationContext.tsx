import { createContext, type PropsWithChildren, useState, useRef, CSSProperties } from 'react';
import type { Notification } from '@/types';
import { FaCheckCircle as CheckIcon, FaTimesCircle as ErrorIcon, FaInfoCircle as InfoIcon, FaTimes as XIcon } from 'react-icons/fa';

interface TimeoutNotification extends Notification {
    duration: number;
    timeout: ReturnType<typeof setTimeout> | null;
}

interface INotificationContext {
    setNotification: (notification: Notification) => void;
    clearNotification: () => void;
}

const NotificationContext = createContext<INotificationContext>({} as INotificationContext);

const Notification = ({ children }: PropsWithChildren) => {
    const notificationRef = useRef<HTMLDivElement | null>(null);

    const [notification, setNotificationState] = useState<TimeoutNotification | null>(null);

    const clearNotification = () => {
        notificationRef.current?.classList.add('notification-exit-animation');

        if (notification && notification.timeout) {
            clearTimeout(notification.timeout);
        }
        setTimeout(() => {
            setNotificationState(null);
        }, 100);
    };

    const setNotification = (newNotification: Notification) => {
        if (notification && notification.timeout) {
            clearTimeout(notification.timeout);
            clearNotification();
        }

        const timeout =
            newNotification.duration !== -1
                ? setTimeout(() => {
                      clearNotification();
                  }, newNotification.duration || 10000)
                : null;

        setNotificationState({ ...newNotification, timeout, duration: newNotification.duration ?? 10000 });
    };

    return (
        <NotificationContext.Provider value={{ setNotification, clearNotification }}>
            {children}
            {notification && (
                <div
                    style={{ borderLeftColor: notification.type === 'success' ? '#22c55e' : notification.type === 'error' ? '#f43f5e' : '#0ea5e9' }}
                    ref={notificationRef}
                    className='notification-enter-animation fixed bottom-12 right-0 grid min-h-24 w-96 grid-cols-[1.3fr_6fr_0.5fr] items-center gap-4 rounded-md bg-light-grey p-4 shadow-md sm:right-6 md:right-12'>
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
                    {notification.duration !== -1 ? (
                        <div
                            style={{ '--duration': (notification.duration - 200) / 1000 } as CSSProperties}
                            className='duration-animation absolute h-1 w-full self-end rounded-l-full rounded-r-full bg-rose-500'
                        />
                    ) : (
                        <div className='absolute h-1 w-full self-end rounded-l-full rounded-r-full bg-rose-500' />
                    )}
                </div>
            )}
        </NotificationContext.Provider>
    );
};

export { NotificationContext, Notification };
