'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import TimeComponent from './TimeComponent';

interface WeatherItem {
    category: string;
    fcstTime: string;
    fcstValue: string;
  }

interface WeatherComponent2Props {
    locationName?: string;
    nx: string;
    ny: string;
}


const WeatherComponent2: React.FC<WeatherComponent2Props> = ({locationName, nx, ny}) => { 
    const [weather, setWeather] = useState<WeatherItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatetime, setUpdatetime] = useState<string[]>([]);

    const getWeatherIcon = (category: 'SKY' | 'PTY', value: string) => {
      const now = new Date();
      const currentHour = now.getHours();

      const isNightTime = currentHour >= 18 || currentHour < 6;
      
      const iconMap: { [key in 'SKY' | 'PTY']: { [key: string]: string } } = {
          'SKY': {
              '1': isNightTime ? '/moon.svg' : '/sunny.svg',
              '3': isNightTime ? '/night-cloudy.svg' : '/clear-cloudy.svg',
              '4': '/cloudy.svg'
          },
          'PTY': {              
              '1': '/rain.svg',       //비
              '2': '/rain-snow.svg',  //비,눈
              '3': '/snow.svg',       //눈
              '4': '/rain.svg',       //소나기
              '5': '/rain.svg',       //빗방울
              '6': '/rain-snow.svg',  //빗방울눈날림  
              '7': '/snow.svg'        //눈날림              
          }
      };
      return iconMap[category]?.[value] || '/clear-cloudy.svg';
    };
    
    const filterCategory = (category: string) =>
      weather.filter((item) => item.category === category);

    const getSkyText = (skyValue: string) => {
      const skytxt = [
        "맑음", "","구름 많음", "흐림"
      ];
      return skytxt[parseInt(skyValue) - 1];
    }

    const getPtyText = (ptyValue: string) => {
      const ptytxt = [
        "없음", "비", "비/눈", "눈", "소나기", "빗방울", "비/눈 날림", "눈 날림"
      ];
      return ptytxt[parseInt(ptyValue)];
    }

    const getWindDirection = (vecValue: string) => {
      const vectxt = [
        "북", "북북동", "북동", "동북동", "동", "동남동", "남동", "남남동",
        "남", "남남서", "남서", "서남서", "서", "서북서", "북서", "북북서", "북"
      ];
      const index = Math.floor((parseFloat(vecValue) + 22.5 * 0.5) / 22.5);
      // console.log(index);
      // console.log(vectxt[index % 16]);
      return vectxt[index % 16];
    }
    

    // 날씨 데이터 호출
    const fetchWeather =  useCallback(async () => {
      const now = new Date();
      
      // 한국 표준시로 변환
      const optionsDate: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      };
      const optionsTime: Intl.DateTimeFormatOptions = {
          timeZone: 'Asia/Seoul',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
      };

      let baseDate = new Intl.DateTimeFormat('ko-KR', optionsDate).format(now).replace(/\.\s?/g, '');
      const [baseTimeHour, baseTimeMinute] = new Intl.DateTimeFormat('ko-KR', optionsTime).format(now).split(':');

      if (parseInt(baseTimeHour) === 0 && parseInt(baseTimeMinute) < 46) {
        const previousDate = new Date(now);
        previousDate.setDate(now.getDate() - 1);
        baseDate = new Intl.DateTimeFormat('ko-KR', optionsDate).format(previousDate).replace(/\.\s?/g, '');
      }

      let baseTime;
      if (parseInt(baseTimeMinute) < 30) {
        const previousHour = (parseInt(baseTimeHour) - 1 + 24) % 24;
        baseTime = `${previousHour < 10 ? '0' : ''}${previousHour}30`;
      } else {
        baseTime = `${baseTimeHour}${parseInt(baseTimeMinute) < 50 ? '00' : '30'}`;
      }


      try{
        const res = await fetch(`/api/weather?baseDate=${baseDate}&baseTime=${baseTime}&nx=${nx}&ny=${ny}`);
        const data = await res.json();
        if (data.response?.body?.items?.item) {
          setWeather(data.response.body.items.item);
          setUpdatetime([data.response.body.items.item[0].baseDate, data.response.body.items.item[0].baseTime]);
        } else {
            console.error('데이터 응답 형식이 올바르지 않습니다.');
        }
      } catch (error) {
          console.error("날씨 데이터를 가져오는 중 오류 발생: ", error);
      } finally {
          setLoading(false);
      }  
      
    },[nx, ny]);


    useEffect(() => {
      fetchWeather();
      const weatherTimer = setInterval(fetchWeather, 3600000); 
      // 1시간 = 3600000ms, 30분 = 1800000ms,  10분 = 600000ms, 1분 = 60000ms
      return () => clearInterval(weatherTimer);
    }, [fetchWeather]);
    
      

    
    return (
      <>
        <div className="inline-flex flex-col justify-center relative w-auto rounded-2xl bg-gray-100 m-0 pt-10 pb-10 pl-6 pr-6  whitespace-nowrap text-stone-600">
          
          
          {loading ? (
          <div className="inline-flex flex-col justify-center items-center">
            <p>Loading...</p>
          </div>
          ) : (            
          <div className="flex-col justify-center items-center">
            
            <div className="flex flex-row justify-between">
              <div className="flex-col">
                <div className="inline-flex justify-start items-center text-xs mb-10 p-0">
                  <span className="flex flex-row items-center relative w-[20px] h-[20px] mr-2">
                    <Image
                        className="m-auto"
                        src="/location.svg"                  
                        fill
                        style={{
                          objectFit: "contain",                    
                        }}                  
                        alt="위치"
                      />
                    </span> {locationName}
                </div>
                <div className="flex ml-5 mr-5 justify-start text-8xl leading-none font-light">
                  {filterCategory("T1H")[0]?.fcstValue} <div className="text-4xl font-extralight leading-normal"> ℃</div>
                </div>
              </div>

              <div className="text-xs">
                <TimeComponent />
              </div>
            </div>

              <div className="flex flex-row mt-10 mb-10">
                <div className="inline-flex flex-row">
                  <div className="justify-center items-center">
                    <span className="flex flex-row items-center relative w-[110px] h-[110px]">
                      <Image
                        className="m-auto"                      
                        src={filterCategory("PTY")[0]?.fcstValue === '0' ? getWeatherIcon("SKY", filterCategory("SKY")[0]?.fcstValue || "0") : getWeatherIcon("PTY", filterCategory("PTY")[0]?.fcstValue || "0")}
                        fill
                        style={{
                          objectFit: "contain",
                        }}
                        alt="날씨상태"
                      />
                      
                    </span>
                    <span className="flex mt-4 justify-center text-base">{filterCategory("PTY")[0]?.fcstValue === '0' ? getSkyText(filterCategory("SKY")[0]?.fcstValue) : getPtyText(filterCategory("PTY")[0]?.fcstValue)}</span>
                  </div>
                </div>

                <div className="inline-flex flex-col ml-10 whitespace-nowrap">

                  <div className="justify-start mt-2 mb-2">
                    <div className="inline-flex flex-col justify-center align-middle items-center">
                      <span className="relative w-[1em] h-[1em]">
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
                      <span className="inline-flex justify-center text-xs mt-1 text-sky-700">습도</span>
                    </div>
                    <div className="inline-flex flex-col justify-center ml-5 w-20">
                    {filterCategory("REH")[0]?.fcstValue} %
                    </div>
                  </div>

                  <div className="justify-start mt-2 mb-2">
                    <div className="inline-flex flex-col justify-center align-middle items-center">
                      <span className="relative w-[1em] h-[1em]">
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
                      <span className="inline-flex justify-center text-xs mt-1 text-sky-700">풍향</span>
                    </div>
                    <div className="inline-flex flex-col justify-center ml-5">          
                    {getWindDirection(filterCategory("VEC")[0]?.fcstValue)}
                    </div>
                  </div>

                  <div className="justify-start mt-2 mb-2">
                    <div className="inline-flex flex-col justify-center align-middle items-center">
                      <span className="relative w-[1em] h-[1em]">
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
                      <span className="inline-flex justify-center text-xs mt-1 text-sky-700">풍속</span>
                    </div>
                    <div className="inline-flex flex-col justify-center ml-5">
                      {filterCategory("WSD")[0]?.fcstValue} m/s
                    </div>
                  </div>

                </div>
              </div>

          </div>
            
          )}
          
          <div className="flex text-xs justify-end font-light text-gray-600 absolute right-3 bottom-1">
            {updatetime.length > 0 ? (
              `기상청 공공 API 제공 : ${updatetime[0].slice(0, 4)}.${updatetime[0].slice(4, 6)}.${updatetime[0].slice(6)} ${updatetime[1].slice(0, 2)}:${updatetime[1].slice(2)} 업데이트`
            ) : null}
          </div>
        </div>
        

      </>
    )
};

export default WeatherComponent2;