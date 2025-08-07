import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({allowedRoles, children}) => {
    const userRole =localStorage.getItem('role');

    if(!allowedRoles.includes(userRole)){
        alert('접근 권한이 없습니다.');
        return <Navigate to ='/dashboard' replace/>;
    }

    return children;
};

export default ProtectedRoute;