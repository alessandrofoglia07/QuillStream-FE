import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/MainPage';
import CreateAnAccountPage from '@/pages/account/CreateAnAccountPage';
import SignInPage from '@/pages/account/SignInPage';
import ConfirmPage from '@/pages/account/ConfirmPage';
import ForgotPage from '@/pages/account/ForgotPage';
import ResetPage from '@/pages/account/ResetPage';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />

            <Route path='/account/create-an-account' element={<CreateAnAccountPage />} />
            <Route path='/account/confirm' element={<ConfirmPage />} />
            <Route path='/account/signin' element={<SignInPage />} />
            <Route path='/account/forgot' element={<ForgotPage />} />
            <Route path='/account/reset/:email/:code' element={<ResetPage />} />
        </Routes>
    );
};

export default App;
