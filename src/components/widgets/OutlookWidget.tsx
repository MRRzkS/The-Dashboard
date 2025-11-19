"use client";

import React, { useEffect, useState } from "react";
import { CloudRain, Cloud, Sun, CloudSnow, CloudLightning, Wind, Loader2, MapPin, Navigation } from "lucide-react";

interface WeatherData {
  temp: number;
  condition: number; // Open-Meteo uses codes (WMO)
  wind: number;
}

export const OutlookWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("No GPS");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // NO API KEY NEEDED. Direct line to Open-Meteo.
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          );
          
          if (!res.ok) throw new Error("Connection Failed");
          
          const data = await res.json();
          
          setWeather({
            temp: Math.round(data.current_weather.temperature),
            condition: data.current_weather.weathercode,
            wind: Math.round(data.current_weather.windspeed)
          });
        } catch (err) {
          setError("Data Unavailable");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Loc. Denied"); // Short error for aesthetics
        setLoading(false);
      }
    );
  }, []);

  // WMO Weather Code Interpretation
  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun size={32} className="text-[var(--mafia-accent)] mb-2" />;
    if (code >= 1 && code <= 3) return <Cloud size={32} className="text-gray-400 mb-2" />;
    if (code >= 45 && code <= 48) return <Wind size={32} className="text-gray-500 mb-2" />; // Fog
    if (code >= 51 && code <= 67) return <CloudRain size={32} className="text-blue-300 mb-2" />; // Drizzle/Rain
    if (code >= 71 && code <= 77) return <CloudSnow size={32} className="text-white mb-2" />; // Snow
    if (code >= 80 && code <= 82) return <CloudRain size={32} className="text-blue-500 mb-2" />; // Showers
    if (code >= 95) return <CloudLightning size={32} className="text-yellow-600 mb-2" />; // Thunder
    return <Cloud size={32} className="text-[var(--mafia-muted)] mb-2" />;
  };

  // WMO Code Text
  const getWeatherText = (code: number) => {
    if (code === 0) return "Clear Sky";
    if (code <= 3) return "Cloudy";
    if (code <= 67) return "Rainy";
    if (code <= 77) return "Snow";
    if (code >= 95) return "Storm";
    return "Overcast";
  };

  return (
    <div className="w-full h-full flex flex-col p-2 relative overflow-hidden">
      <div className="text-[10px] uppercase tracking-widest text-[var(--mafia-muted)] mb-1 z-10 flex justify-between">
        <span>Atmosphere</span>
        <span className="flex items-center gap-1"><Navigation size={8}/> GPS</span>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center z-10">
        {loading ? (
          <div className="flex flex-col items-center gap-2 opacity-50">
            <Loader2 size={20} className="animate-spin text-[var(--mafia-accent)]" />
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="text-[10px] text-[var(--mafia-danger)] uppercase">{error}</div>
          </div>
        ) : weather ? (
          <>
            {getWeatherIcon(weather.condition)}
            <div className="text-3xl md:text-4xl font-[family-name:var(--font-cinzel)] text-gray-200">
              {weather.temp}°
            </div>
            <div className="text-[10px] text-[var(--mafia-muted)] uppercase tracking-wider flex items-center gap-2 mt-1">
              <Wind size={10} /> {weather.wind} km/h • {getWeatherText(weather.condition)}
            </div>
          </>
        ) : null}
      </div>

      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
    </div>
  );
};