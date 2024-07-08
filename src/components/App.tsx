import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/MainPage';
import CreateAnAccountPage from '@/pages/account/CreateAnAccountPage';
import SignInPage from '@/pages/account/SignInPage';
import ConfirmPage from '@/pages/account/ConfirmPage';
import ForgotPage from '@/pages/account/ForgotPage';
import ResetPage from '@/pages/account/ResetPage';
import DocumentPage from '@/pages/DocumentPage';
import PrivateRoutes from './PrivateRoutes';

const App: React.FC = () => {
    return (
        <Routes>
            <Route element={<PrivateRoutes />}>
                <Route path='/' element={<HomePage />} />
                <Route path='/documents/:documentId' element={<DocumentPage />} />
            </Route>

            <Route path='/account/create-an-account' element={<CreateAnAccountPage />} />
            <Route path='/account/confirm' element={<ConfirmPage />} />
            <Route path='/account/signin' element={<SignInPage />} />
            <Route path='/account/forgot' element={<ForgotPage />} />
            <Route path='/account/reset/:email/:code' element={<ResetPage />} />

            <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
    );
};

export default App;
