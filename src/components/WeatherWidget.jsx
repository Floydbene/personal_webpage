import { useQuery } from '@tanstack/react-query';

const WEATHER_CODES = {
  0: { label: 'Clear sky', icon: '\u2600\uFE0F' },
  1: { label: 'Mainly clear', icon: '\uD83C\uDF24\uFE0F' },
  2: { label: 'Partly cloudy', icon: '\u26C5' },
  3: { label: 'Overcast', icon: '\u2601\uFE0F' },
  45: { label: 'Foggy', icon: '\uD83C\uDF2B\uFE0F' },
  48: { label: 'Rime fog', icon: '\uD83C\uDF2B\uFE0F' },
  51: { label: 'Light drizzle', icon: '\uD83C\uDF26\uFE0F' },
  53: { label: 'Drizzle', icon: '\uD83C\uDF26\uFE0F' },
  55: { label: 'Dense drizzle', icon: '\uD83C\uDF27\uFE0F' },
  61: { label: 'Light rain', icon: '\uD83C\uDF27\uFE0F' },
  63: { label: 'Rain', icon: '\uD83C\uDF27\uFE0F' },
  65: { label: 'Heavy rain', icon: '\uD83C\uDF27\uFE0F' },
  71: { label: 'Light snow', icon: '\uD83C\uDF28\uFE0F' },
  73: { label: 'Snow', icon: '\u2744\uFE0F' },
  75: { label: 'Heavy snow', icon: '\u2744\uFE0F' },
  77: { label: 'Snow grains', icon: '\u2744\uFE0F' },
  80: { label: 'Light showers', icon: '\uD83C\uDF26\uFE0F' },
  81: { label: 'Showers', icon: '\uD83C\uDF27\uFE0F' },
  82: { label: 'Heavy showers', icon: '\u26C8\uFE0F' },
  85: { label: 'Snow showers', icon: '\uD83C\uDF28\uFE0F' },
  86: { label: 'Heavy snow showers', icon: '\uD83C\uDF28\uFE0F' },
  95: { label: 'Thunderstorm', icon: '\u26A1' },
  96: { label: 'Thunderstorm + hail', icon: '\u26A1' },
  99: { label: 'Thunderstorm + heavy hail', icon: '\u26A1' },
};

const getPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 5000 }
    );
  });

const WeatherWidget = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['weather'],
    queryFn: async () => {
      let coords;
      try {
        coords = await getPosition();
      } catch {
        // Fallback to London
        coords = { latitude: 51.51, longitude: -0.13 };
      }

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true&timezone=auto`
      );
      if (!res.ok) throw new Error('Weather API error');
      const json = await res.json();

      // Reverse geocode for city name
      let city = 'Your location';
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=&latitude=${coords.latitude}&longitude=${coords.longitude}&count=1`
        );
        if (geoRes.ok) {
          const geoJson = await geoRes.json();
          if (geoJson.results?.[0]?.name) {
            city = geoJson.results[0].name;
          }
        }
      } catch {
        // Keep default
      }

      return { ...json.current_weather, city };
    },
    staleTime: 1000 * 60 * 15,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="widget-card weather-widget">
        <div className="widget-label">Weather</div>
        <div className="widget-value" style={{ opacity: 0.5 }}>Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="widget-card weather-widget">
        <div className="widget-label">Weather</div>
        <div className="widget-value">--</div>
      </div>
    );
  }

  const weatherInfo = WEATHER_CODES[data.weathercode] || { label: 'Unknown', icon: '\uD83C\uDF0D' };

  return (
    <div className="widget-card weather-widget">
      <div className="widget-label">Weather</div>
      <div className="weather-main">
        <span className="weather-icon">{weatherInfo.icon}</span>
        <span className="weather-temp">{Math.round(data.temperature)}&deg;C</span>
      </div>
      <div className="weather-desc">{weatherInfo.label}</div>
      <div className="weather-wind">{data.windspeed} km/h wind</div>
    </div>
  );
};

export default WeatherWidget;
