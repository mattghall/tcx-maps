// Set DEBUG to true in development, false in production
const DEBUG = true;

// Custom log function that only logs if DEBUG is true
function debugLog(...args) {
    if (DEBUG) {
        console.log(...args);
    }
}

// Haversine formula to calculate distance between two lat/lon points
function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371000; // Radius of Earth in meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
}

// Function to average data points based on a specified range
function averageDataPoints(data, range) {
    const averagedData = [];
    for (let i = 0; i < data.length; i += range) {
        const slice = data.slice(i, i + range);
        const average = slice.reduce((acc, val) => acc + val, 0) / slice.length;
        averagedData.push(average);
    }
    return averagedData;
}

// Utility function to initialize range selectors
function initializeRangeSelectors(totalPoints) {
    document.getElementById('mapRangeEnd').max = 100; // Always max 100 for map end
    document.getElementById('mapRangeEnd').value = 100;
    document.getElementById('mapRangeStart').value = 0;
}

function drawRoundedBar(ctx, x, y, width, height, radius) {
    if (radius === undefined) {
        radius = 5; // Default radius
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

function drawSmoothLine(ctx, data, xStart, xStep, min, max, height, bufferY) {
    ctx.beginPath();
    for (let i = 0; i < data.length - 1; i++) {
        const x1 = xStart + i * xStep;
        const x2 = xStart + (i + 1) * xStep;

        const y1 = bufferY + ((data[i] - min) / (max - min)) * (height - 2 * bufferY);
        const y2 = bufferY + ((data[i + 1] - min) / (max - min)) * (height - 2 * bufferY);

        const cpX = (x1 + x2) / 2; // Control point for quadratic curve
        ctx.quadraticCurveTo(cpX, height - y1, x2, height - y2);
    }
    ctx.strokeStyle = 'blue'; // Set the line color
    ctx.lineWidth = 2; // Set the line width
    ctx.stroke();
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
