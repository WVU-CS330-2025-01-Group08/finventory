// Import the Express framework to handle routing
const express = require('express');

// Import Axios for making HTTP requests to external APIs
const axios = require('axios');

// Create a new router object from Express
const router = express.Router();

/*
  Route: GET /counties
  Description: Fetches county boundary data for West Virginia from the WV GIS ArcGIS REST API.
  The response is returned in GeoJSON format.
  This endpoint can be used to display county borders on a map.
*/
router.get('/counties', async (req, res) => {
    try {
        const response = await axios.get(
            'https://services.wvgis.wvu.edu/arcgis/rest/services/Boundaries/wv_political_boundary/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson'
        );
        res.json(response.data); // Return the GeoJSON response to the client
    } catch (error) {
        console.error('Error fetching county data:', error);
        res.status(500).json({ error: 'Failed to fetch county data' }); // Internal server error fallback
    }
});

/*
  Route: GET /trout-streams
  Description: Retrieves trout stream data from the WV GIS ArcGIS REST API.
  The data is also returned in GeoJSON format, useful for overlaying fishing streams on a map.
*/
router.get('/trout-streams', async (req, res) => {
    try {
        const response = await axios.get(
            'https://services.wvgis.wvu.edu/arcgis/rest/services/Applications/dnrRec_fishing/MapServer/4/query?where=1%3D1&outFields=*&outSR=4326&f=geojson'
        );
        res.json(response.data); // Send trout stream GeoJSON data to the frontend
    } catch (error) {
        console.error('Error fetching trout stream data:', error);
        res.status(500).json({ error: 'Failed to fetch trout stream data' }); // Fallback for errors
    }
});

// Export the router so it can be mounted in the main Express app
module.exports = router;
