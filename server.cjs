
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let latestReading = null;

app.get('/', (req, res) => {
    res.send('SIH Sensor Backend is running!');
});

app.post('/api/sensor', (req, res) => {
    latestReading = {
        ...req.body,
        receivedAt: new Date().toISOString()
    };

    console.log('Sensor data received:', latestReading);

    res.json({
        success: true,
        message: 'Sensor data received'
    });
});

app.get('/api/sensor', (req, res) => {
    res.json(latestReading || {
        message: 'No sensor data received yet'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on port ${PORT}`);
});
