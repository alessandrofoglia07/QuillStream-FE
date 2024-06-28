import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/components/App';
import '@/style.css';
import { BrowserRouter } from 'react-router-dom';
import { Notification } from './context/NotificationContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Notification>
                <App />
            </Notification>
        </BrowserRouter>
    </React.StrictMode>
);
