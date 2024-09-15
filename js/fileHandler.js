document.addEventListener('DOMContentLoaded', function () {
    debugLog("fileHandler.js()");

    // Add the event listener for file upload
    document.getElementById('tcxFileInput').addEventListener('change', handleFileUpload);

    let latitudes = [];
    let longitudes = [];
    let elevations = [];
    let times = [];
    let speeds = [];

    // Function to handle file upload
    function handleFileUpload(event) {
        debugLog("handleFileUpload()");

        const file = event.target.files[0];
        if (file) {
            debugLog("File selected:", file.name);
            const reader = new FileReader();
            reader.onload = function (e) {
                const xmlContent = e.target.result;
                debugLog("File loaded successfully. Beginning to parse.");
                parseTCXFile(xmlContent);
            };
            reader.readAsText(file);
        } else {
            debugLog("No file selected.");
        }
    }

    // Function to parse the TCX file and extract the required data
    function parseTCXFile(xmlContent) {
        debugLog("parseTCXFile()");
    
        const latitudes = [];
        const longitudes = [];
        const elevations = [];
        const times = [];
        const speeds = [];
        const distances = [];  // Add distances array
    
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, "application/xml");
    
        const trackpoints = xmlDoc.getElementsByTagName("Trackpoint");
    
        for (let i = 0; i < trackpoints.length; i++) {
            const trackpoint = trackpoints[i];
    
            const latitude = trackpoint.getElementsByTagName("LatitudeDegrees")[0]?.textContent;
            const longitude = trackpoint.getElementsByTagName("LongitudeDegrees")[0]?.textContent;
            const elevation = trackpoint.getElementsByTagName("AltitudeMeters")[0]?.textContent;
            const time = trackpoint.getElementsByTagName("Time")[0]?.textContent;
            const speed = trackpoint.getElementsByTagName("ns3:Speed")[0]?.textContent;
            const distance = trackpoint.getElementsByTagName("DistanceMeters")[0]?.textContent;
    
            if (latitude && longitude) {
                latitudes.push(parseFloat(latitude));
                longitudes.push(parseFloat(longitude));
            }
    
            if (elevation) {
                elevations.push(parseFloat(elevation));
            }
    
            if (time) {
                times.push(new Date(time).getTime());
            }
    
            if (speed) {
                speeds.push(parseFloat(speed) * 3.6);  // Convert m/s to km/h
            }
    
            if (distance) {
                distances.push(parseFloat(distance));  // Store distance in meters
            }
        }
    
        // Store parsed data in the global window.TCXData object
        window.TCXData = { latitudes, longitudes, elevations, times, speeds, distances };
    
        debugLog("Data parsed and stored in global TCXData object:", window.TCXData);
    
        // Initialize range selectors and update graphs/map
        if (latitudes.length > 0) {
            initializeRangeSelectors(latitudes.length);
            updateMapRange();
            updateDataRange();
        }
    }
    

    // Calculate speeds between points and store them (this is no longer used, but kept for reference)
    function calculateSpeeds() {
        debugLog("calculateSpeeds()");
        speeds = []; // We won't need this function anymore since speed is being parsed directly from the file
    }

    document.getElementById('downloadElevation').addEventListener('click', function () {
        const canvas = document.getElementById('elevationCanvas');
        const link = document.createElement('a');
        link.download = 'elevation_graph.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    document.getElementById('downloadSpeed').addEventListener('click', function () {
        const canvas = document.getElementById('speedCanvas');
        const link = document.createElement('a');
        link.download = 'speed_graph.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    // Initialize Feather icons
    feather.replace();

});
