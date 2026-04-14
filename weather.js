import axios from 'axios';

export default async function handler(req, res) {
    const { city, lat, lon } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
    let weatherUrl;

    if (!apiKey) {
        return res.status(401).json({ error: 'API Anahtarı eksik. Lütfen Vercel üzerinden WEATHER_API_KEY tanımlayın.' });
    }

    if (lat && lon) {
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=tr`;
    } else if (city) {
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=tr`;
    } else {
        return res.status(400).json({ error: 'Lütfen geçerli bir şehir veya koordinat girin.' });
    }

    try {
        const weatherRes = await axios.get(weatherUrl);
        const currentData = weatherRes.data;
        
        const { lat: reqLat, lon: reqLon } = currentData.coord;
        
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${reqLat}&lon=${reqLon}&units=metric&appid=${apiKey}&lang=tr`;
        const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${reqLat}&lon=${reqLon}&appid=${apiKey}`;
        
        const [forecastRes, aqiRes] = await Promise.all([ axios.get(forecastUrl), axios.get(aqiUrl) ]);
        
        res.status(200).json({ current: currentData, forecast: forecastRes.data, airQuality: aqiRes.data });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: 'Şehir bulunamadı' });
        } else if (error.response && error.response.status === 401) {
            res.status(401).json({ error: 'API Anahtarı geçersiz veya henüz aktif değil.' });
        } else {
            res.status(500).json({ error: 'Hava durumu verisi alınamadı.' });
        }
    }
}