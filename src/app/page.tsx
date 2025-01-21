import TimeComponent from "@/components/TimeComponent";
import WeatherComponent from "@/components/WeatherComponent";
import WeatherComponent2 from "@/components/WeatherComponent2";

export default function Home() {
  
  return (
    <div className="grid items-center justify-items-center min-h-screen font-[family-name:var(--font-jost)]">
      <main className="flex flex-col items-center text-white">
        <div className="flex flex-row mt-1 relative bottom-0 justify-around w-full bg-stone-950 text-wrap ">
          <TimeComponent />
          <WeatherComponent locationName="서울 금천구 가산동" nx="58" ny="125" />
        </div>
        <div className="flex flex-row mt-1 relative bottom-0 justify-around w-full bg-stone-950 text-wrap text-white">
          <TimeComponent />
          <WeatherComponent locationName="부산 사하구 하단1동" nx="96" ny="74" />
        </div>
        <div className="flex flex-row mt-1 relative bottom-0 justify-around w-full bg-stone-950 text-wrap text-white">
          <TimeComponent />
          <WeatherComponent locationName="김포 구래동" nx="54" ny="128" />       
        </div>
        
        <div className="flex flex-row mt-1 relative bottom-0 justify-around w-full bg-stone-950 text-wrap text-white">
          <TimeComponent />
          <WeatherComponent locationName="세종 어진동" nx="56" ny="104" />
        </div>

        <div className="flex flex-row mt-1 relative bottom-0 justify-around w-full bg-stone-950 text-wrap text-white">
          <TimeComponent />
          <WeatherComponent locationName="제주 제주시" nx="53" ny="38" />
        </div>
        <div className="flex flex-row mt-1 relative bottom-0 justify-around w-full bg-stone-950 text-wrap text-white">
          <TimeComponent />
          <WeatherComponent locationName="울릉군 울릉읍" nx="127" ny="127" />
        </div>

      </main>
      
      <WeatherComponent2 locationName="서울 금천구 가산동" nx="58" ny="125" />
    </div>
  );
}
