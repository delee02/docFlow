import React from "react";
import { Navigate } from "react-router-dom";

const OnlymeRoute = ({children}) => { 
    const userId =localStorage.getItem('userId'); //지금 로그인한 유저
    const writerId = localStorage.getItem('writer'); //디테일페이지에서 뽑은 writerID
    console.log("비교", typeof writerId , "   :", typeof userId);
    if(writerId !==userId){
        alert('접근 권한이 없습니다.');
        return <Navigate to ='/dashboard' replace/>;
    }

    localStorage.removeItem('writer');
    return children;
};

export default OnlymeRoute;