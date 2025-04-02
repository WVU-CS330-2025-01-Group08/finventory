const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/counties', async (req, res) => {
    try {
        const response = await axios.get(
            'https://services.wvgis.wvu.edu/arcgis/rest/services/Boundaries/wv_political_boundary/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson'
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching county data:', error);
        res.status(500).json({ error: 'Failed to fetch county data' });
    }
});

module.exports = router;