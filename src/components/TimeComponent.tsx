'use client';
import { useEffect, useState } from 'react';
import DateComponent from './DateComponent';

const TimeComponent = () => {
    const [currentTime, setCurrentTime] = useState<string>("");
    const [showColon, setShowColon] = useState<boolean>(true);

    const updateCurrentTime = () => {
        const now = new Date();

        const optionsTime: Intl.DateTimeFormatOptions = {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
        };
        const koreanTime = now.toLocaleTimeString("ko-KR", optionsTime);

        setCurrentTime(koreanTime );
        setShowColon(prev => !prev);
    };

    useEffect(() => {
        updateCurrentTime();
        const timer = setInterval(updateCurrentTime, 1000); // 1초마다 시간 업데이트
        return () => clearInterval(timer);
    }, []);

    

    
    return (
        <>            
            <div className="inline-flex flex-row  whitespace-nowrap">
                <div className="inline-flex flex-col justify-center">
                    <DateComponent />
                    {/* <span className="inline-flex mb-1 text-xs font-light">현재시간</span> */}
                    <div className="inline-flex flex-row text-[1.8em] leading-none font-medium">
                        {currentTime.split(":")[0]}<span className={`${showColon ? "opacity-30" : ""} justify-center align-middle w-/[20px/] leading-none h-full`}>:</span>{currentTime.split(":")[1]}
                    </div>
                    
                </div>
            </div>
        </>
    )
}

export default TimeComponent;