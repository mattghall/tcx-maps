document.addEventListener('DOMContentLoaded', function () {
    debugLog("DOMContentLoaded() in dataDisplay.js");

    $('#displayTypeSelector').change(function () {
        // Get the selected display type
        var selectedDisplayType = $(this).val();
        console.log("Display type changed to: " + selectedDisplayType);
        switch (selectedDisplayType) {
            case "line":
                $('#dataRangeSelector').attr("min", 1);
                $('#dataRangeSelector').attr("step", 1);
                $('#dataRangeSelector').attr("max", 100);
                $('#dataRangeSelector').val(1);
                break;
            case "bar-points":
                $('#dataRangeSelector').attr("min", 1);
                $('#dataRangeSelector').attr("step", 1);
                $('#dataRangeSelector').attr("max", 100);
                $('#dataRangeSelector').val(1);
                break;
            case "bar-time":
                $('#dataRangeSelector').attr("min", 0.5);
                $('#dataRangeSelector').attr("step", 0.5);
                $('#dataRangeSelector').attr("max", 60);
                $('#dataRangeSelector').val(1.0);
                break;
            case "bar-distance":
                $('#dataRangeSelector').attr("min", 0.1);
                $('#dataRangeSelector').attr("step", 0.1);
                $('#dataRangeSelector').attr("max", 2);
                $('#dataRangeSelector').val(1.0);
                break;
            default:
                console.error("Unknown display type: " + displayType);
        }
        // Call updateDataRange or any other function you need to trigger
        updateDataRange();
    });

    $(document).ready(function() {
        // Change color variables dynamically based on color picker values
        $('#mapBarColor').on('input', function() {
            mapBarColor = $(this).val();
            updateMapRange();
        });

        $('#elevationBarColor').on('input', function() {
            elevationBarColor = $(this).val();
            updateDataRange(); // Redraw graph with new colors
        });
    
        $('#elevationLineColor').on('input', function() {
            elevationLineColor = $(this).val();
            updateDataRange(); // Redraw graph with new colors
        });
    
        $('#speedBarColor').on('input', function() {
            speedBarColor = $(this).val();
            updateDataRange(); // Redraw graph with new colors
        });
    
        $('#speedLineColor').on('input', function() {
            speedLineColor = $(this).val();
            updateDataRange(); // Redraw graph with new colors
        });

        $('#barTransparency').on('input', function() {
            barTransparency = $(this).val();
            updateDataRange();  // Redraw the bar graphs with the new transparency
        });
    });
    

    // Add event listener for the data range selector
    const dataRangeSelector = document.getElementById('dataRangeSelector');
    const dataRangeValueDisplay = document.getElementById('dataRangeValue');

    // Function to update the data points displayed in elevation and speed graphs
    function updateDataRange() {
        debugLog("updateDataRange()");

        // Ensure that TCXData exists and has the necessary data
        if (!window.TCXData || !window.TCXData.elevations || !window.TCXData.speeds || !window.TCXData.times || !window.TCXData.distances) {
            debugLog("window.TCXData is undefined or missing necessary data.");
            return;
        }

        // Get the current value of the range selector
        const dataRangeValue = parseFloat(document.getElementById('dataRangeSelector').value);
        debugLog("Data range updated to:", dataRangeValue);

        // Update the displayed range value in the span
        document.getElementById('dataRangeValue').textContent = dataRangeValue;

        // Get the selected display type from the dropdown
        const displayType = document.getElementById('displayTypeSelector').value;
        debugLog("Display type selected:", displayType);

        const { elevations, speeds, times, distances } = window.TCXData;

        // Call the appropriate rendering function based on display type
        switch (displayType) {
            case "line":
                drawLineGraphs(elevations, speeds, times, dataRangeValue);
                break;
            case "bar-points":
                drawBarPointsWithSmoothLine(elevations, speeds, times, dataRangeValue);
                break;
            case "bar-time":
                drawBarTime(elevations, speeds, times, dataRangeValue);
                break;
            case "bar-distance":
                drawBarDistance(elevations, speeds, distances, dataRangeValue);
                break;
            default:
                console.error("Unknown display type: " + displayType);
                drawLineGraphs(elevations, speeds, times, dataRangeValue);
        }

    }



    function drawElevation(elevations, times, lineColor) {
        const canvas = document.getElementById('elevationCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        const minElev = Math.min(...elevations);
        const maxElev = Math.max(...elevations);
        const bufferX = canvas.width * 0.05;
        const bufferY = canvas.height * 0.05;
    
        const scaleTime = (index) => bufferX + (index / (elevations.length - 1)) * (canvas.width - 2 * bufferX);
        const scaleElev = (elev) => bufferY + ((elev - minElev) / (maxElev - minElev)) * (canvas.height - 2 * bufferY);
    
        ctx.beginPath();
        ctx.moveTo(scaleTime(0), canvas.height - scaleElev(elevations[0]));
    
        for (let i = 1; i < elevations.length; i++) {
            ctx.lineTo(scaleTime(i), canvas.height - scaleElev(elevations[i]));
        }
    
        // Apply the color for the elevation line
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        debugLog("Elevation line graph drawn successfully.");
    }
    

    function drawSpeed(speeds, times, lineColor) {
        const canvas = document.getElementById('speedCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        const minSpeed = Math.min(...speeds);
        const maxSpeed = Math.max(...speeds);
        const bufferX = canvas.width * 0.05;
        const bufferY = canvas.height * 0.05;
    
        const scaleTime = (index) => bufferX + (index / (speeds.length - 1)) * (canvas.width - 2 * bufferX);
        const scaleSpeed = (speed) => bufferY + ((speed - minSpeed) / (maxSpeed - minSpeed)) * (canvas.height - 2 * bufferY);
    
        ctx.beginPath();
        ctx.moveTo(scaleTime(0), canvas.height - scaleSpeed(speeds[0]));
    
        for (let i = 1; i < speeds.length; i++) {
            ctx.lineTo(scaleTime(i), canvas.height - scaleSpeed(speeds[i]));
        }
    
        // Apply the color for the speed line
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        debugLog("Speed line graph drawn successfully.");
    }
    


    // Expose updateDataRange to global scope
    window.updateDataRange = updateDataRange;
    window.drawSpeed = drawSpeed;
    window.drawElevation = drawElevation;

    // Add event listener to update graphs when the data range slider is changed
    dataRangeSelector.addEventListener('input', updateDataRange);

    // Ensure the function is called after the data is parsed
    if (window.TCXData) {
        debugLog("Data already loaded. Initializing graphs.");
        updateDataRange(); // Trigger initial rendering if the data is already loaded
    }
});
