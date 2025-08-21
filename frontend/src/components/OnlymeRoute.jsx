import React, {useEffect} from "react";
import { Navigate } from "react-router-dom";

const OnlymeRoute = ({children}) => { 
    const userId =localStorage.getItem('userId'); //지금 로그인한 유저
    const writerId =String(localStorage.getItem('writer')); //디테일페이지에서 뽑은 writerID
    console.log("비교", writerId , "   :", userId);
    useEffect(() => {
        return () => {
            // 언마운트될 때 writer 지우기
            localStorage.removeItem('writer');
        };
    }, [])
    if(writerId && userId && writerId !==userId){
        alert('접근 권한이 없습니다.');
        return <Navigate to ='/dashboard' replace/>;
    }
    

    return children;
};

export default OnlymeRoute;