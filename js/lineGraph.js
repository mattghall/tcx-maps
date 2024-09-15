function drawLineGraphs(elevations, speeds, times, granularity) {
    debugLog("drawLineGraphs()");

    const averagedElevations = averageDataPoints(elevations, granularity);
    const averagedSpeeds = averageDataPoints(speeds, granularity);

    // Pass color for elevation and speed lines
    drawElevation(averagedElevations, times, elevationLineColor);
    drawSpeed(averagedSpeeds, times, speedLineColor);
}
