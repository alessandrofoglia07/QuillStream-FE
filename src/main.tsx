import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/components/App';
import '@/style.css';
import { BrowserRouter } from 'react-router-dom';
import { Notification } from './context/NotificationContext';
import { Account } from './context/AccountContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Account>
                <Notification>
                    <App />
                </Notification>
            </Account>
        </BrowserRouter>
    </React.StrictMode>
);
