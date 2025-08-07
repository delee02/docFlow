import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({children}){
    console.log("토근",localStorage.getItem('accessToken'));
    const isLoggedIn = !!localStorage.getItem('accessToken');

    return isLoggedIn ? children : <Navigate to='/' replace/>
}

export default PrivateRoute;