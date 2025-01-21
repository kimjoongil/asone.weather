'use client';
import { useEffect, useState } from 'react';

const DateComponent = () => {

    const [currentDate, setCurrentDate] = useState<string>("");

    const updateCurrentDate = () => {
        const now = new Date();

        const optionsDate: Intl.DateTimeFormatOptions = {
            year:"numeric",
            month: "2-digit",
            day: "2-digit",
            weekday: "long",
        };
        const koreanDate = now.toLocaleDateString("ko-KR", optionsDate);
               
        setCurrentDate(koreanDate);
    };

    useEffect(() => {
        updateCurrentDate();
        const timer = setInterval(updateCurrentDate, 1000); // 1초마다 시간 업데이트
        return () => clearInterval(timer);
    }, []);

    

    
    return (
        <>
            <div className="flex flex-col whitespace-nowrap">
                {currentDate}
            </div>
        </>
    )
}

export default DateComponent;