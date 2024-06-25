import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/MainPage';
import RegisterPage from '@/pages/account/RegisterPage';
import LoginPage from '@/pages/account/LoginPage';
import ConfirmPage from '@/pages/account/ConfirmPage';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />

            <Route path='/account/register' element={<RegisterPage />} />
            <Route path='/account/confirm' element={<ConfirmPage />} />
            <Route path='/account/login' element={<LoginPage />} />
        </Routes>
    );
};

export default App;
