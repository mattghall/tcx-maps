function drawBarPointsWithSmoothLine(elevations, speeds, times, granularity) {
    const elevationCanvas = document.getElementById('elevationCanvas');
    const elevationCtx = elevationCanvas.getContext('2d');
    elevationCtx.clearRect(0, 0, elevationCanvas.width, elevationCanvas.height);

    const speedCanvas = document.getElementById('speedCanvas');
    const speedCtx = speedCanvas.getContext('2d');
    speedCtx.clearRect(0, 0, speedCanvas.width, speedCanvas.height);

    const numBars = Math.ceil(elevations.length / granularity);
    const barWidth = elevationCanvas.width / numBars;

    const minElev = Math.min(...elevations);
    const maxElev = Math.max(...elevations);
    const minSpeed = Math.min(...speeds);
    const maxSpeed = Math.max(...speeds);
    const bufferY = elevationCanvas.height * 0.05;

    // Draw Elevation Bars
    const elevationBarTops = [];
    for (let i = 0; i < numBars; i++) {
        const startIdx = i * granularity;
        const endIdx = Math.min((i + 1) * granularity, elevations.length);

        const avgElev = elevations.slice(startIdx, endIdx).reduce((sum, elev) => sum + elev, 0) / (endIdx - startIdx);
        const barHeight = ((avgElev - minElev) / (maxElev - minElev)) * (elevationCanvas.height - 2 * bufferY);

        // Apply configurable color for bars
        elevationCtx.fillStyle = hexToRgba(elevationBarColor, barTransparency);
        elevationCtx.fillRect(i * barWidth, elevationCanvas.height - barHeight - bufferY, barWidth, barHeight);

        elevationBarTops.push(avgElev);
    }

    // Draw Speed Bars
    const speedBarTops = [];
    for (let i = 0; i < numBars; i++) {
        const startIdx = i * granularity;
        const endIdx = Math.min((i + 1) * granularity, speeds.length);

        const avgSpeed = speeds.slice(startIdx, endIdx).reduce((sum, speed) => sum + speed, 0) / (endIdx - startIdx);
        const barHeight = ((avgSpeed - minSpeed) / (maxSpeed - minSpeed)) * (speedCanvas.height - 2 * bufferY);

        // Apply configurable color for bars
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
        bufferY,
        elevationLineColor // Configurable line color for elevation
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
        bufferY,
        speedLineColor // Configurable line color for speed
    );
}

// Update drawSmoothLine to accept line color as a parameter
function drawSmoothLine(ctx, data, xStart, xStep, min, max, height, bufferY, lineColor) {
    ctx.beginPath();
    for (let i = 0; i < data.length - 1; i++) {
        const x1 = xStart + i * xStep;
        const x2 = xStart + (i + 1) * xStep;

        const y1 = bufferY + ((data[i] - min) / (max - min)) * (height - 2 * bufferY);
        const y2 = bufferY + ((data[i + 1] - min) / (max - min)) * (height - 2 * bufferY);

        const cpX = (x1 + x2) / 2; // Control point for quadratic curve
        ctx.quadraticCurveTo(cpX, height - y1, x2, height - y2);
    }

    ctx.strokeStyle = lineColor; // Use the configurable line color
    ctx.lineWidth = 2;
    ctx.stroke();
}
