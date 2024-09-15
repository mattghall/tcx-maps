document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('downloadPath').addEventListener('click', function () {
        const canvas = document.getElementById('pathCanvas');
        const link = document.createElement('a');
        link.download = 'map_path.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    debugLog("DOMContentLoaded() in mapDisplay.js");

    // Add event listeners for map range start and end inputs
    document.getElementById('mapRangeStart').addEventListener('input', updateMapRange);
    document.getElementById('mapRangeEnd').addEventListener('input', updateMapRange);

    debugLog("Map range event listeners added.");

    // Function to update the map display based on the range selection
    function updateMapRange() {
        debugLog("updateMapRange()");

        const { latitudes, longitudes } = window.TCXData;

        // Ensure that latitudes and longitudes are available and valid
        if (!latitudes || latitudes.length === 0) {
            debugLog("No latitudes available for map rendering.");
            return;
        }

        // Retrieve the start and end values from the range sliders
        const mapStart = parseInt(document.getElementById('mapRangeStart').value);
        const mapEnd = parseInt(document.getElementById('mapRangeEnd').value);

        debugLog(`Map range updated: Start ${mapStart}% - End ${mapEnd}%`);

        // Ensure that the start value is less than the end value
        if (mapStart >= mapEnd) {
            alert("Start range must be less than end range.");
            debugLog("Invalid map range: start range is greater than or equal to end range.");
            return;
        }

        // Calculate the start and end indices based on the selected percentage range
        const startIndex = Math.floor((mapStart / 100) * latitudes.length);
        const endIndex = Math.floor((mapEnd / 100) * latitudes.length);

        debugLog(`Rendering map from index ${startIndex} to ${endIndex} out of ${latitudes.length} total points.`);

        // Select the corresponding latitudes and longitudes for the map range
        const selectedLatitudes = latitudes.slice(startIndex, endIndex);
        const selectedLongitudes = longitudes.slice(startIndex, endIndex);

        // Draw the path based on the selected latitudes and longitudes
        drawPath(selectedLatitudes, selectedLongitudes);
    }

    // Expose updateMapRange to global scope
    window.updateMapRange = updateMapRange;

    // Function to draw the path on the map canvas
    function drawPath(latitudes, longitudes) {
        debugLog("drawPath()");
    
        const canvas = document.getElementById('pathCanvas');
        const ctx = canvas.getContext('2d');
    
        // Ensure that latitudes and longitudes have data
        if (!latitudes.length) {
            debugLog("No latitudes to draw the path.");
            return;
        }
    
        // Calculate the minimum and maximum latitude and longitude values for scaling
        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLon = Math.min(...longitudes);
        const maxLon = Math.max(...longitudes);
    
        // Calculate the aspect ratio of the data (longitude to latitude)
        const latRange = maxLat - minLat;
        const lonRange = maxLon - minLon;
        const dataAspectRatio = lonRange / latRange;
    
        // Resize canvas to match the data aspect ratio
        canvas.height = canvas.width / dataAspectRatio;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // Define the buffer (5% of the canvas width and height)
        const bufferX = canvas.width * 0.05;
        const bufferY = canvas.height * 0.05;
    
        // Adjust scaling to include the buffer
        const scaleLat = (lat) => bufferY + ((lat - minLat) / latRange) * (canvas.height - 2 * bufferY);
        const scaleLon = (lon) => bufferX + ((lon - minLon) / lonRange) * (canvas.width - 2 * bufferX);
    
        // Begin drawing the path on the canvas
        ctx.beginPath();
        ctx.moveTo(scaleLon(longitudes[0]), canvas.height - scaleLat(latitudes[0]));
    
        for (let i = 1; i < latitudes.length; i++) {
            ctx.lineTo(scaleLon(longitudes[i]), canvas.height - scaleLat(latitudes[i]));
        }
    
        // Set the stroke style and draw the path
        ctx.strokeStyle = mapBarColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    
        debugLog("Map path drawn successfully.");
    }
    
    
    

    // Expose drawPath to global scope (optional, if needed)
    window.drawPath = drawPath;
});
