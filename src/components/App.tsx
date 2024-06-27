import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/MainPage';
import RegisterPage from '@/pages/account/RegisterPage';
import LoginPage from '@/pages/account/LoginPage';
import ConfirmPage from '@/pages/account/ConfirmPage';
import ForgotPage from '@/pages/account/ForgotPage';
import ResetPage from '@/pages/account/ResetPage';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />

            <Route path='/account/register' element={<RegisterPage />} />
            <Route path='/account/confirm' element={<ConfirmPage />} />
            <Route path='/account/login' element={<LoginPage />} />
            <Route path='/account/forgot' element={<ForgotPage />} />
            <Route path='/account/reset/:email/:code' element={<ResetPage />} />
        </Routes>
    );
};

export default App;
