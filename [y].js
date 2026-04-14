import axios from 'axios';

export default async function handler(req, res) {
    const { layer, z, x, y } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!layer || !z || !x || !y) {
        return res.status(400).send('Eksik harita parametreleri.');
    }

    const url = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${apiKey}`;
    
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 günlük tarayıcı önbelleği (Performans için)
        res.status(200).send(response.data);
    } catch (error) {
        res.status(500).send('Harita katmanı alınamadı.');
    }
}