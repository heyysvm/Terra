const OW_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE = 'https://api.openweathermap.org/data/2.5';

export async function getWeather(city = 'Gaya', lat = null, lon = null) {
  if (!OW_KEY) {
    return getMockWeather();
  }

  try {
    let url;
    if (lat && lon) {
      url = `${BASE}/weather?lat=${lat}&lon=${lon}&appid=${OW_KEY}&units=metric&lang=hi`;
    } else {
      url = `${BASE}/weather?q=${city},IN&appid=${OW_KEY}&units=metric&lang=hi`;
    }

    const res = await fetch(url);
    if (!res.ok) return getMockWeather();

    const data = await res.json();
    return {
      city: data.name,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      main: data.weather[0].main,
    };
  } catch (e) {
    console.error('Weather fetch error:', e);
    return getMockWeather();
  }
}

function getMockWeather() {
  return {
    city: 'गया, बिहार',
    temp: 34,
    feelsLike: 38,
    tempMin: 28,
    tempMax: 37,
    humidity: 72,
    windSpeed: 14,
    description: 'आंशिक बादल',
    icon: '02d',
    main: 'Clouds',
    isMock: true,
  };
}

export function getWeatherIcon(main) {
  const icons = {
    Clear: '☀️',
    Clouds: '⛅',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️',
  };
  return icons[main] || '🌤️';
}
