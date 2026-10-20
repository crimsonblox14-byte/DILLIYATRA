import React, { useEffect, useState } from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudFog,
  Wind,
  Droplets,
  RefreshCw,
  Compass,
  Calendar,
} from 'lucide-react';

interface WeatherData {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    is_day: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchWeather = async () => {
    setLoading(true);
    try {
      let data: WeatherData | null = null;
      try {
        const res = await fetch('/api/weather');
        if (res.ok) {
          data = await res.json();
        }
      } catch (e) {
        console.warn('Server weather proxy error, trying direct API:', e);
      }

      if (!data || !data.current) {
        const directRes = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FKolkata'
        );
        if (directRes.ok) {
          data = await directRes.json();
        }
      }

      if (data && data.current) {
        setWeather(data);
        const now = new Date();
        setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.warn('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // Refresh every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const toTemp = (celsius: number) => {
    if (unit === 'F') {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(celsius)}°C`;
  };

  // Convert WMO Weather Code to condition label and icon
  const getWeatherInfo = (code: number, isDay: number = 1) => {
    if (code === 0) {
      return {
        label: isDay ? 'Clear Sky' : 'Clear Night',
        icon: <Sun className="w-8 h-8 text-amber-400" />,
        smallIcon: <Sun className="w-4 h-4 text-amber-400" />,
      };
    }
    if (code === 1 || code === 2) {
      return {
        label: 'Partly Cloudy',
        icon: <CloudSun className="w-8 h-8 text-blue-300" />,
        smallIcon: <CloudSun className="w-4 h-4 text-blue-300" />,
      };
    }
    if (code === 3) {
      return {
        label: 'Overcast',
        icon: <Cloud className="w-8 h-8 text-slate-300" />,
        smallIcon: <Cloud className="w-4 h-4 text-slate-300" />,
      };
    }
    if (code >= 45 && code <= 48) {
      return {
        label: 'Hazy / Morning Fog',
        icon: <CloudFog className="w-8 h-8 text-slate-400" />,
        smallIcon: <CloudFog className="w-4 h-4 text-slate-400" />,
      };
    }
    if (code >= 51 && code <= 67) {
      return {
        label: 'Light Showers',
        icon: <CloudRain className="w-8 h-8 text-blue-400" />,
        smallIcon: <CloudRain className="w-4 h-4 text-blue-400" />,
      };
    }
    if (code >= 80) {
      return {
        label: 'Passing Rain',
        icon: <CloudRain className="w-8 h-8 text-blue-400" />,
        smallIcon: <CloudRain className="w-4 h-4 text-blue-400" />,
      };
    }
    return {
      label: 'Pleasant & Fair',
      icon: <Sun className="w-8 h-8 text-amber-300" />,
      smallIcon: <Sun className="w-4 h-4 text-amber-300" />,
    };
  };

  // Tourism travel advice based on current temperature
  const getTravelAdvice = (temp: number) => {
    if (temp > 33) {
      return 'Warm afternoon ahead. Plan outdoor monuments (Red Fort, Qutub Minar) before 11:00 AM or after 4:30 PM. Stay hydrated.';
    }
    if (temp >= 22 && temp <= 33) {
      return 'Great sightseeing weather today. Ideal for exploring Humayun’s Tomb gardens, Lodhi Gardens, and sunset walks at India Gate.';
    }
    return 'Crisp pleasant air. Excellent for Old Delhi morning food walks and heritage havelis.';
  };

  const currentInfo = weather ? getWeatherInfo(weather.current.weather_code, weather.current.is_day) : null;

  return (
    <div className="p-5 md:p-6 rounded-2xl bg-[#09101f] border border-blue-500/25 shadow-xl shadow-black/50 text-slate-100 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-blue-950/70 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-white tracking-wide">
              New Delhi Live Weather
            </h3>
            <span className="text-[11px] text-slate-400">
              National Capital Region &bull; 28.6139° N, 77.2090° E
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Temperature unit switch */}
          <div className="flex items-center bg-[#0e172a] p-1 rounded-lg border border-blue-900/40 text-xs">
            <button
              onClick={() => setUnit('C')}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                unit === 'C' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => setUnit('F')}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                unit === 'F' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              °F
            </button>
          </div>

          <button
            onClick={fetchWeather}
            disabled={loading}
            className="p-1.5 rounded-lg bg-[#0e172a] hover:bg-blue-900/40 text-slate-300 hover:text-white border border-blue-900/40 transition-all cursor-pointer"
            title="Refresh weather"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Current Conditions Banner */}
      {weather && currentInfo ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Left: Temp and Icon */}
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40">
              {currentInfo.icon}
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {toTemp(weather.current.temperature_2m)}
              </div>
              <div className="text-xs font-semibold text-blue-300">
                {currentInfo.label}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Feels like {toTemp(weather.current.apparent_temperature)}
              </div>
            </div>
          </div>

          {/* Middle: Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#0c1426] border border-blue-950 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Humidity</span>
                <span className="font-bold text-white">{weather.current.relative_humidity_2m}%</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0c1426] border border-blue-950 flex items-center gap-2">
              <Wind className="w-4 h-4 text-teal-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Wind</span>
                <span className="font-bold text-white">{weather.current.wind_speed_10m} km/h</span>
              </div>
            </div>
          </div>

          {/* Right: Tourism travel advisory */}
          <div className="p-3 rounded-xl bg-[#0c1426] border border-blue-900/40 text-xs text-slate-300 leading-relaxed">
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block mb-1">
              Sightseeing Advice:
            </span>
            <p>{getTravelAdvice(weather.current.temperature_2m)}</p>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-xs text-slate-400 animate-pulse">
          Loading live New Delhi weather data...
        </div>
      )}

      {/* 5-Day Forecast Grid */}
      {weather && weather.daily && (
        <div className="pt-2 border-t border-blue-950/70">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>5-Day Weather Forecast</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {weather.daily.time.slice(0, 5).map((dateStr, idx) => {
              const code = weather.daily.weather_code[idx] || 0;
              const maxT = weather.daily.temperature_2m_max[idx];
              const minT = weather.daily.temperature_2m_min[idx];
              const info = getWeatherInfo(code, 1);

              let dayName = dateStr;
              if (idx === 0) dayName = 'Today';
              else if (idx === 1) dayName = 'Tomorrow';
              else {
                try {
                  const d = new Date(dateStr);
                  dayName = d.toLocaleDateString([], { weekday: 'short' });
                } catch {
                  dayName = `Day ${idx + 1}`;
                }
              }

              return (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#0b1222] border border-blue-950 hover:border-blue-800/50 transition-all text-center space-y-1"
                >
                  <span className="text-[11px] font-bold text-slate-300 block">{dayName}</span>
                  <div className="flex justify-center my-1">{info.smallIcon}</div>
                  <div className="text-xs font-bold text-white">{toTemp(maxT)}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{toTemp(minT)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {lastUpdated && (
        <div className="text-[10px] text-slate-500 text-right pt-1">
          Last updated at {lastUpdated} IST &bull; Powered by Open-Meteo
        </div>
      )}
    </div>
  );
};
