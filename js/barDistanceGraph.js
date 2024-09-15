function drawBarDistance(elevations, speeds, distances, granularity) {
    const elevationCanvas = document.getElementById('elevationCanvas');
    const elevationCtx = elevationCanvas.getContext('2d');
    elevationCtx.clearRect(0, 0, elevationCanvas.width, elevationCanvas.height);

    const speedCanvas = document.getElementById('speedCanvas');
    const speedCtx = speedCanvas.getContext('2d');
    speedCtx.clearRect(0, 0, speedCanvas.width, speedCanvas.height);

    const distanceRange = granularity * 1609.34;  // Convert miles to meters
    const numBars = Math.ceil(distances[distances.length - 1] / distanceRange);
    const barWidth = elevationCanvas.width / numBars;

    const minElev = Math.min(...elevations);
    const maxElev = Math.max(...elevations);
    const minSpeed = Math.min(...speeds);
    const maxSpeed = Math.max(...speeds);
    const bufferY = elevationCanvas.height * 0.05;

    // Draw Elevation Bars
    const elevationBarTops = [];
    for (let i = 0; i < numBars; i++) {
        const startDistance = i * distanceRange;
        const endDistance = startDistance + distanceRange;

        const filteredElev = elevations.filter((_, idx) => distances[idx] >= startDistance && distances[idx] < endDistance);
        if (filteredElev.length === 0) continue;

        const avgElev = filteredElev.reduce((sum, elev) => sum + elev, 0) / filteredElev.length;
        const barHeight = ((avgElev - minElev) / (maxElev - minElev)) * (elevationCanvas.height - 2 * bufferY);
        elevationCtx.fillStyle = hexToRgba(elevationBarColor, barTransparency);
        elevationCtx.fillRect(i * barWidth, elevationCanvas.height - barHeight - bufferY, barWidth, barHeight);

        elevationBarTops.push(avgElev);
    }

    // Draw Speed Bars
    const speedBarTops = [];
    for (let i = 0; i < numBars; i++) {
        const startDistance = i * distanceRange;
        const endDistance = startDistance + distanceRange;

        const filteredSpeed = speeds.filter((_, idx) => distances[idx] >= startDistance && distances[idx] < endDistance);
        if (filteredSpeed.length === 0) continue;

        const avgSpeed = filteredSpeed.reduce((sum, speed) => sum + speed, 0) / filteredSpeed.length;
        const barHeight = ((avgSpeed - minSpeed) / (maxSpeed - minSpeed)) * (speedCanvas.height - 2 * bufferY);
        speedCtx.fillStyle = hexToRgba(speedBarColor, barTransparency);
        speedCtx.fillRect(i * barWidth, speedCanvas.height - barHeight - bufferY, barWidth, barHeight);

        speedBarTops.push(avgSpeed);
    }

    // Draw smooth line for elevation
    drawSmoothLine(
        elevationCtx,
        elevationBarTops,
        0,
        barWidth,
        minElev,
        maxElev,
        elevationCanvas.height,
        bufferY
    );

    // Draw smooth line for speed
    drawSmoothLine(
        speedCtx,
        speedBarTops,
        0,
        barWidth,
        minSpeed,
        maxSpeed,
        speedCanvas.height,
        bufferY
    );
}
