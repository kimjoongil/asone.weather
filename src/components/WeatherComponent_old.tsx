
'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface WeatherItem {
    category: string;
    fcstTime: string;
    fcstValue: string;
  }

interface WeatherComponent_oldProps {
    locationName?: string;
    nx: string;
    ny: string;
}

const WeatherComponent_old: React.FC<WeatherComponent_oldProps> = ({locationName, nx, ny}) => { 
    const [weather, setWeather] = useState<WeatherItem[]>([]);
    const [loading, setLoading] = useState(true);

   
    const [updatetime, setUpdatetime] = useState<string[]>([]);


    

    useEffect(() => {
    
        // 날씨 데이터 호출
        const fetchWeather = async () => {
          const now = new Date();

          const optionsDate: Intl.DateTimeFormatOptions = {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
          };
          const baseDate = now.toLocaleDateString("ko-KR", optionsDate).replace(/. /g, "").replace(".", "");
                    
          const optionsTime: Intl.DateTimeFormatOptions = {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
          };
          //const koreanTime = now.toLocaleTimeString("ko-KR", optionsTime);
          let baseTimeHour = now.toLocaleTimeString("ko-KR", optionsTime).slice(0, 2);
          const baseTimeMinute = now.toLocaleTimeString("ko-KR", optionsTime).slice(3, 5);
          baseTimeHour = (parseInt(baseTimeMinute) < 30 ? (parseInt(baseTimeHour) - 1) : baseTimeHour).toString();
          baseTimeHour = parseInt(baseTimeHour) < 10 ? "0" + baseTimeHour : baseTimeHour;

          const baseTime = baseTimeHour + baseTimeMinute;          

    
          const res = await fetch(`/api/weather?baseDate=${baseDate}&baseTime=${baseTime}&nx=${nx}&ny=${ny}`);
          const data = await res.json();
          if (data.response) {
            setWeather(data.response.body.items.item);
            setUpdatetime([data.response.body.items.item[0].baseDate, data.response.body.items.item[0].baseTime]);
          }
          setLoading(false);
        };
    
        fetchWeather();

        const weatherTimer = setInterval(() => {
            fetchWeather();
        }, 3600000); // 1시간 = 3600000ms
            
        // 타이머 정리
        return () => {
          
          clearInterval(weatherTimer);
        };

      }, [locationName, nx, ny]);
    
      // 날씨 카테고리 필터링 함수
      const filterCategory = (category: string) =>
        weather.filter((item) => item.category === category);

    
    return (
      <>
        <div className="inline-flex flex-col justify-center w-auto rounded-md bg-slate-800 m-4 pt-2 pb-2 pl-6 pr-6  whitespace-nowrap">
          <div className="inline-flex justify-start items-center text-xs text-white m-0 p-0">
            {locationName}  
          </div>
          {loading ? (
          <div className="inline-flex flex-col justify-center items-center">
            <p>Loading...</p>
          </div>
          ) : (
            
          <div className="inline-flex flex-row justify-center items-center">           
              
            <div className="flex flex-row justify-center">

              {filterCategory("PTY")[0]?.fcstValue === "0" ? (
                <>
                  {filterCategory("SKY")[0]?.fcstValue === "1" ? (
                    <>
                      <span className="flex flex-row items-center relative w-[50px] h-[40px]">
                        <Image
                          className="m-auto"
                          src="/sunny.svg"                      
                          fill
                          style={{
                            objectFit: "contain",
                          }}
                          alt="맑음"
                        />

                        
                      </span>
                    </>
                  ) : filterCategory("SKY")[0]?.fcstValue === "3" ? (
                    <>
                      <span className="flex flex-row items-center relative w-[50px] h-[40px]">
                        <Image
                          className="m-auto"
                          src="/clear-cloudy.svg"                      
                          fill
                          style={{
                            objectFit: "contain",
                          }}
                          alt="구름 많음"
                        />
                        
                      </span>
                    </>
                  ) : filterCategory("SKY")[0]?.fcstValue === "4" ? (
                    <>
                      <span className="flex flex-row items-center relative w-[50px] h-[40px]">
                        <Image
                          className="m-auto"
                          src="/cloudy.svg"                      
                          fill
                          style={{
                            objectFit: "contain",
                          }}
                          alt="흐림"
                        />
                        
                      </span>
                    </>
                  ):(
                    <>
                      <span className="flex flex-row items-center relative w-[50px] h-[40px]">
                        <Image
                          className="m-auto"
                          src="/sunny.svg"                      
                          fill
                          style={{
                            objectFit: "contain",
                          }}
                          alt="맑음"
                        />
                        
                      </span>
                    </>
                  )}
                </>
              ) : (
                <>
                  {filterCategory("PTY")[0]?.fcstValue === "1" ? (
                    
                      <span className="flex flex-row items-center relative w-[50px] h-[40px]">
                        <Image
                          className="m-auto"
                          src="/rain.svg"                      
                          fill
                          style={{
                            objectFit: "contain",
                          }}
                          alt="비"
                        />
                        
                      </span>
                    
                  ) : filterCategory("PTY")[0]?.fcstValue === "2" ? (
                    
                      <span className="flex flex-row items-center relative w-[50px] h-[40px]">
                        <Image
                          className="m-auto"
                          src="/rain-snow.svg"                      
                          fill
                          style={{
                            objectFit: "contain",
                          }}
                          alt="비/눈"
                        />
                        
                      </span>
                    
                  ) : filterCategory("PTY")[0]?.fcstValue === "3" ? (
                    
                      <span className="flex flex-row items-center relative w-[50px] h-[40px]">
                        <Image
                          className="m-auto"
                          src="/snow.svg"                      
                          fill
                          style={{
                            objectFit: "contain",
                          }}
                          alt="눈"
                        />
                        
                      </span>
                    
                  ) : filterCategory("PTY")[0]?.fcstValue === "4" ? (
                    
                      <span className="flex flex-row items-center relative w-[50px] h-[40px]">
                        <Image
                          className="m-auto"
                          src="/rain.svg"                      
                          fill
                          style={{
                            objectFit: "contain",
                          }}
                          alt="소나기"
                        />
                        
                      </span>
                    
                  ) : filterCategory("PTY")[0]?.fcstValue === "5" ? (
                    
                      <span className="flex flex-row items-center relative w-[50px] h-[40px]">
                        <Image
                          className="m-auto"
                          src="/rain.svg"                      
                          fill
                          style={{
                            objectFit: "contain",
                          }}
                          alt="빗방울"
                        />
                        
                      </span>
                    
                  ) : filterCategory("PTY")[0]?.fcstValue === "6" ? (
                    
                      <span className="flex flex-row items-center relative w-[50px] h-[40px]">
                        <Image
                          className="m-auto"
                          src="/rain-snow.svg"                      
                          fill
                          style={{
                            objectFit: "contain",
                          }}
                          alt="빗방울눈날림"
                        />
                      </span>
                    
                  ) :(
                    <span className="flex flex-row items-center relative w-[50px] h-[40px]">
                        <Image
                          className="m-auto"
                          src="/snow.svg"                      
                          fill
                          style={{
                            objectFit: "contain",
                          }}
                          alt="눈날림"
                        />
                    </span>
                  )}                 
                </>
              )}                
            </div>

            <div className="ml-4 justify-center text-[50px] leading-none text-yellow-200 ">{filterCategory("T1H")[0]?.fcstValue}°</div>
          </div>
            
          )}
          
        </div>
        
        <div className="inline-flex flex-row justify-center w-auto rounded-md whitespace-nowrap m-2 text-3xl">

          <div className="inline-flex flex-col justify-center">
            <span className="items-center justify-center relative w-[40px] h-[30px]">
                <Image
                  className="m-auto"
                  src="/water.svg"                  
                  fill
                  style={{
                    objectFit: "contain",                    
                  }}                  
                  alt="습도"
                />            
            </span>
            <span className="inline-flex justify-center text-xs mt-1 text-cyan-300">습도</span>
          </div>
          <div className="inline-flex flex-col justify-center ml-5">
          {filterCategory("REH")[0]?.fcstValue} %
          </div>
        </div>

        <div className="inline-flex flex-row justify-center w-auto rounded-md whitespace-nowrap m-2 text-3xl">
          <div className="inline-flex flex-col justify-center">
            <span className="items-center justify-center relative w-[30px] h-[30px]">
                <Image
                  className="m-auto"
                  src="/direction.svg"                      
                  fill
                  style={{
                    objectFit: "contain",                    
                  }}
                  alt="풍향"
                />            
            </span>
            <span className="inline-flex justify-center text-xs mt-1 text-cyan-300">풍향</span>
          </div>
          <div className="inline-flex flex-col justify-center ml-5">
          {filterCategory("VEC")[0]?.fcstValue} deg
          </div>
        </div>

        <div className="inline-flex flex-row justify-center w-auto rounded-md whitespace-nowrap m-2 text-3xl">
          <div className="inline-flex flex-col justify-center">
            <span className="items-center justify-center relative w-[30px] h-[30px]">
                <Image
                  className="m-auto"
                  src="/wind.svg"                      
                  fill
                  style={{
                    objectFit: "contain",                    
                  }}
                  alt="풍속"
                />            
            </span>
            <span className="inline-flex justify-center text-xs mt-1 text-cyan-300">풍속</span>
          </div>
          <div className="inline-flex flex-col justify-center ml-5">
          {filterCategory("WSD")[0]?.fcstValue} m/s
          </div>
        </div>
        <div className="flex text-xs justify-end font-light text-gray-600 absolute right-3 bottom-1">
          {updatetime.length > 0 ? (
            `기상청 공공 API 제공 : ${updatetime[0].slice(0, 4)}.${updatetime[0].slice(4, 6)}.${updatetime[0].slice(6)} ${updatetime[1].slice(0, 2)}:${updatetime[1].slice(2)} 업데이트`
          ) : null}
        </div>
      </>
    )
};

export default WeatherComponent_old;