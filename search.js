import axios from 'axios';

export default async function handler(req, res) {
    const { q } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!q) return res.status(400).json({ error: 'Arama sorgusu eksik.' });

    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${apiKey}`;
    try {
        const response = await axios.get(url);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Arama verisi alınamadı' });
    }
}