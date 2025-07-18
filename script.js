document.addEventListener('DOMContentLoaded', function() {
    const skinfoldImage = document.getElementById('skinfoldImage');
    const svgDotsContainer = document.getElementById('skinfoldDots');
    const infoDisplay = document.getElementById('infoDisplay');
    const infoTitle = document.getElementById('infoTitle');
    const infoContent = document.getElementById('infoContent');
    const closeButton = document.getElementById('closeButton');
    const interactiveArea = document.querySelector('.interactive-area');
    const detailsPanel = document.querySelector('.details-panel');
    const taskSelectContainer = document.getElementById('taskSelectContainer');
    const mainTitle = document.getElementById('mainTitle');
    const taskDescription = document.getElementById('taskDescription');
    let selectedDot = null;
    let currentTask = 'landmarks';

    const videoPlayerContainer = document.getElementById('videoPlayerContainer');
    const youtubePlayer = document.getElementById('youtubePlayer');
    const closeVideoButton = document.getElementById('closeVideoButton');
    const restartVideoButton = document.getElementById('restartVideoButton');
    const videoId = "qZtZWQXZ9sI";
    let currentVideoStartTime = 0;
    let currentVideoEndTime = 0;

    // Add coordinate finder functionality
    let coordinateFindingMode = false;
    const imageContainer = document.querySelector('.image-container');
    
    // Developer mode variables
    let developerMode = false;
    let currentSiteIndex = 0;
    let currentTaskSites = [];
    const developerPanel = document.getElementById('developerPanel');
    const currentSiteSpan = document.getElementById('currentSite');
    const clickPromptSpan = document.getElementById('clickPrompt');
    const prevSiteButton = document.getElementById('prevSite');
    const nextSiteButton = document.getElementById('nextSite');
    const outputCoordsButton = document.getElementById('outputCoords');
    const hideOverlaysCheckbox = document.getElementById('hideOverlays');
    const lockYAxisCheckbox = document.getElementById('lockYAxis');
    const lockedYValueSpan = document.getElementById('lockedYValue');
    const definitionText = document.getElementById('definitionText');
    let alignmentCoordinates = {};
    let lastYCoordinate = null;
    let previewLine = null;
    let isWaitingForEndPoint = false;
    let startPoint = null;

    // Task descriptions for each type
    const taskDescriptions = {
        skinfolds: "Click on a marked point on the image to learn how to measure the skinfold at that site.",
        landmarks: "Click on a marked point on the image to learn how to locate the anatomical landmark.",
        lengths: "Click on a marked point on the image to learn how to measure body lengths.",
        girths: "Click on a marked point on the image to learn how to measure body girths.",
        breadths: "Click on a marked point on the image to learn how to measure body breadths."
    };

    // Variable to store loaded anatomical data
    let taskData = null;

    // Function to load anatomical data from JSON file
    async function loadAnatomicalData() {
        try {
            const response = await fetch('anatomical-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            taskData = await response.json();
            console.log('Anatomical data loaded successfully');
            
            // Initialize with the new default task after data is loaded
            loadTaskData(currentTask);
        } catch (error) {
            console.error('Error loading anatomical data:', error);
            // You could show a user-friendly error message here
            alert('Failed to load measurement data. Please refresh the page and try again.');
        }
    }

    // Add coordinate finder and developer mode event listeners
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key.toLowerCase() === 'c') {
            e.preventDefault();
            coordinateFindingMode = !coordinateFindingMode;
            document.body.style.cursor = coordinateFindingMode ? 'crosshair' : 'default';
            
            // Hide/show measurement elements when coordinate finding mode is toggled
            const allMeasurementElements = svgDotsContainer.querySelectorAll('.measurement-element, .measurement-dot');
            allMeasurementElements.forEach(element => {
                if (coordinateFindingMode) {
                    element.style.display = 'none';
                } else {
                    element.style.display = '';
                }
            });
            
            // Add visual feedback to indicate coordinate finding mode is active
            if (coordinateFindingMode) {
                // Add a subtle overlay or indicator
                document.body.classList.add('coordinate-finding-active');
                console.log('Coordinate finding mode: ON - All measurement elements hidden');
            } else {
                document.body.classList.remove('coordinate-finding-active');
                console.log('Coordinate finding mode: OFF - Measurement elements restored');
            }
        }
        
        // Toggle developer mode with Alt+D
        if (e.altKey && e.key.toLowerCase() === 'd') {
            e.preventDefault();
            toggleDeveloperMode();
        }
    });

    imageContainer.addEventListener('click', function(e) {
        if (!coordinateFindingMode && !developerMode) return;

        const rect = skinfoldImage.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);

        if (coordinateFindingMode) {
            // Original coordinate finding functionality
            const tempDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            tempDot.setAttribute("cx", x + "%");
            tempDot.setAttribute("cy", y + "%");
            tempDot.setAttribute("r", "1.3%");
            tempDot.setAttribute("fill", "yellow");
            tempDot.setAttribute("stroke", "black");
            svgDotsContainer.appendChild(tempDot);

            console.log(`Coordinates: x: "${x}%", y: "${y}%"`);

            setTimeout(() => {
                svgDotsContainer.removeChild(tempDot);
            }, 2000);
        } else if (developerMode && currentTaskSites.length > 0) {
            // Developer mode alignment functionality
            const currentSite = currentTaskSites[currentSiteIndex];
            if (!alignmentCoordinates[currentTask]) {
                alignmentCoordinates[currentTask] = {};
            }
            
            // Apply Y-axis lock if enabled - use first click's Y if no previous Y is set
            let finalY = y;
            if (lockYAxisCheckbox.checked) {
                if (lastYCoordinate !== null) {
                    finalY = lastYCoordinate;
                } else {
                    // First click of the site - this will become the locked Y value
                    lastYCoordinate = y;
                    updateLockedYDisplay();
                }
            }
            
            // Store coordinates for current site
            const siteData = taskData[currentTask][currentSite];
            if (siteData.type === "line") {
                // For lines, determine if this is start or end point based on clicks
                if (!alignmentCoordinates[currentTask][currentSite]) {
                    alignmentCoordinates[currentTask][currentSite] = { startX: x + "%", startY: finalY + "%" };
                    lastYCoordinate = finalY;
                    updateLockedYDisplay();
                    clickPromptSpan.textContent = `${currentSite} - Click END point`;
                    
                    // Set up preview line
                    startPoint = { x: parseFloat(x), y: parseFloat(finalY) };
                    isWaitingForEndPoint = true;
                    createPreviewLine();
                } else {
                    alignmentCoordinates[currentTask][currentSite].endX = x + "%";
                    alignmentCoordinates[currentTask][currentSite].endY = finalY + "%";
                    lastYCoordinate = finalY;
                    updateLockedYDisplay();
                    
                    // Clean up preview line
                    removePreviewLine();
                    isWaitingForEndPoint = false;
                    startPoint = null;
                    
                    nextSite();
                }
            } else if (siteData.type === "ellipse") {
                // For ellipses, get center point first, then radius points
                if (!alignmentCoordinates[currentTask][currentSite]) {
                    alignmentCoordinates[currentTask][currentSite] = { centerX: x + "%", centerY: finalY + "%" };
                    lastYCoordinate = finalY;
                    updateLockedYDisplay();
                    clickPromptSpan.textContent = `${currentSite} - Click edge for radius`;
                } else {
                    const centerX = parseFloat(alignmentCoordinates[currentTask][currentSite].centerX);
                    const centerY = parseFloat(alignmentCoordinates[currentTask][currentSite].centerY);
                    const radiusX = Math.abs(parseFloat(x) - centerX).toFixed(1);
                    const radiusY = Math.abs(parseFloat(y) - centerY).toFixed(1);
                    alignmentCoordinates[currentTask][currentSite].radiusX = radiusX + "%";
                    alignmentCoordinates[currentTask][currentSite].radiusY = radiusY + "%";
                    nextSite();
                }
            } else {
                // Regular dots
                alignmentCoordinates[currentTask][currentSite] = { x: x + "%", y: finalY + "%" };
                lastYCoordinate = finalY;
                updateLockedYDisplay();
                nextSite();
            }
            
            // Show temporary marker (use finalY to show where the point was actually placed)
            const tempDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            tempDot.setAttribute("cx", x + "%");
            tempDot.setAttribute("cy", finalY + "%");
            tempDot.setAttribute("r", "1.0%");
            tempDot.setAttribute("fill", lockYAxisCheckbox.checked ? "#00BFFF" : "#FF4444");
            tempDot.setAttribute("stroke", "#000000");
            tempDot.setAttribute("stroke-width", "2");
            svgDotsContainer.appendChild(tempDot);

            setTimeout(() => {
                if (svgDotsContainer.contains(tempDot)) {
                    svgDotsContainer.removeChild(tempDot);
                }
            }, 1000);
        }
    });

    // Mouse move event for preview line
    imageContainer.addEventListener('mousemove', function(e) {
        if (!developerMode || !isWaitingForEndPoint || !startPoint) return;

        const rect = skinfoldImage.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        let y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        
        // Apply Y-axis lock if enabled
        if (lockYAxisCheckbox.checked && lastYCoordinate !== null) {
            y = lastYCoordinate;
        }

        updatePreviewLine(parseFloat(x), parseFloat(y));
    });

    // Function to handle collapsible sections
    function setupCollapsibleSections() {
        document.querySelectorAll('.collapsible-header').forEach(header => {
            header.classList.add('collapsed');
        });
        document.querySelectorAll('.collapsible-content').forEach(content => {
            content.classList.add('collapsed');
        });

        document.querySelectorAll('.collapsible-header').forEach(header => {
            header.addEventListener('click', function() {
                this.classList.toggle('collapsed');
                
                const content = this.nextElementSibling;
                if (content && content.classList.contains('collapsible-content')) {
                    content.classList.toggle('collapsed');
                }
            });
        });
    }

    function createMeasurementElement(siteKey, siteData, taskType) {
        const element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        element.setAttribute("data-site", siteKey);
        element.setAttribute("data-task", taskType);
        element.classList.add("measurement-element", `${taskType}-element`);

        if (siteData.type === "line") {
            // Create line with endpoints for lengths and breadths
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", siteData.startX);
            line.setAttribute("y1", siteData.startY);
            line.setAttribute("x2", siteData.endX);
            line.setAttribute("y2", siteData.endY);
            line.classList.add("measurement-line");
            element.appendChild(line);

            // Create endpoint circles
            const startCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            startCircle.setAttribute("cx", siteData.startX);
            startCircle.setAttribute("cy", siteData.startY);
            startCircle.setAttribute("r", "1.0%");
            startCircle.classList.add("measurement-endpoint");
            element.appendChild(startCircle);

            const endCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            endCircle.setAttribute("cx", siteData.endX);
            endCircle.setAttribute("cy", siteData.endY);
            endCircle.setAttribute("r", "1.0%");
            endCircle.classList.add("measurement-endpoint");
            element.appendChild(endCircle);

        } else if (siteData.type === "ellipse") {
            // Create dashed arc (half-ellipse) for girths - only show front portion
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            
            // Parse the percentage values
            const centerX = parseFloat(siteData.centerX);
            const centerY = parseFloat(siteData.centerY);
            const radiusX = parseFloat(siteData.radiusX);
            const radiusY = parseFloat(siteData.radiusY);
            
            // Calculate arc endpoints
            const startX = centerX - radiusX;
            const startY = centerY;
            const endX = centerX + radiusX;
            const endY = centerY;
            
            // Create an arc that curves downward (front of body)
            // Using a more pronounced curve by adjusting the control point  
            const pathData = `M ${startX} ${startY} Q ${centerX} ${centerY + radiusY} ${endX} ${endY}`;
            
            path.setAttribute("d", pathData);
            path.classList.add("measurement-arc");

            // Apply rotation if specified
            if (siteData.rotationAngle !== undefined) {
                path.setAttribute("transform", `rotate(${siteData.rotationAngle} ${centerX} ${centerY})`);
            }

            element.appendChild(path);
        } else {
            // Fallback to dot for landmarks and skinfolds
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", siteData.x);
            circle.setAttribute("cy", siteData.y);
            circle.setAttribute("r", "1.3%");
            circle.setAttribute("data-site", siteKey);
            circle.setAttribute("data-task", taskType);
            circle.classList.add("measurement-dot", `${taskType}-dot`);
            element.appendChild(circle);
        }

        svgDotsContainer.appendChild(element);
        return element;
    }

    function clearAllElements() {
        const elements = svgDotsContainer.querySelectorAll('.measurement-element, .measurement-dot');
        elements.forEach(element => element.remove());
        selectedDot = null;
    }

    function loadTaskData(taskType) {
        clearAllElements();
        hideInfoPanel();
        
        if (taskType === 'breadths') {
            skinfoldImage.src = 'Blank-Sillouette-With-Side.png';
        } else {
            skinfoldImage.src = 'Blank-Sillouette.png';
        }

        if (!taskData) return;
        
        const data = taskData[taskType];
        if (!data) return;

        // Create elements for the current task
        for (const siteKey in data) {
            if (data.hasOwnProperty(siteKey)) {
                const site = data[siteKey];
                let element;
                
                if (taskType === 'lengths' || taskType === 'breadths' || taskType === 'girths') {
                    element = createMeasurementElement(siteKey, site, taskType);
                } else {
                    // For skinfolds and landmarks, use the original dot creation
                    if (site.x && site.y) {
                        element = createDot(siteKey, site, taskType);
                    }
                }
                
                if (element) {
                    element.addEventListener('click', function(event) {
                        if (selectedDot) {
                            selectedDot.classList.remove('element-selected');
                        }
                        this.classList.add('element-selected');
                        selectedDot = this;

                        const clickedSiteKey = this.dataset.site;
                        const currentTaskData = taskData[currentTask];
                        const siteData = currentTaskData[clickedSiteKey];

                        if (siteData) {
                            showInfoPanel(siteData);
                        }
                    });
                }
            }
        }
    }

    function createDot(siteKey, siteData, taskType) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", siteData.x);
        circle.setAttribute("cy", siteData.y);
        circle.setAttribute("r", "1.3%");
        circle.setAttribute("data-site", siteKey);
        circle.setAttribute("data-task", taskType);
        circle.classList.add("measurement-dot", `${taskType}-dot`);
        svgDotsContainer.appendChild(circle);
        return circle;
    }

    function generateInstructionsHTML(data) {
        let html = '';
        
        // Generate HTML based on the data structure
        if (data.identification) {
            // For skinfolds and landmarks - they have identification sections
            const sectionType = currentTask === 'skinfolds' ? 'Site Identification' : 'Landmark Identification';
            const isCollapsed = currentTask === 'skinfolds' ? ' collapsed' : '';
            
            html += `<div class="collapsible-section">`;
            html += `<h4 class="collapsible-header${isCollapsed}">${data.title} ${sectionType}</h4>`;
            html += `<div class="collapsible-content${isCollapsed}">`;
            html += `<p><strong>Definition:</strong> ${data.identification.definition}</p>`;
            html += `<p><strong>Subject position${currentTask === 'skinfolds' ? ' for site marking' : ''}:</strong> ${data.identification.subjectPosition}</p>`;
            
            if (data.identification.location) {
                html += `<p><strong>Location of ${currentTask === 'skinfolds' ? 'skinfold site' : 'landmark'}:</strong> ${data.identification.location}</p>`;
            }
            if (data.identification.technique) {
                html += `<p><strong>Palpation technique:</strong> ${data.identification.technique}</p>`;
            }
            if (data.identification.nomenclatureNote) {
                html += `<p><strong>Nomenclature Note:</strong> ${data.identification.nomenclatureNote}</p>`;
            }
            
            html += `</div></div>`;
        }
        
        if (data.measurement) {
            // For anything with measurement procedures
            const sectionTitle = currentTask === 'skinfolds' ? 'Measurement Procedure' : 
                                currentTask === 'lengths' ? 'Length Measurement' :
                                currentTask === 'girths' ? 'Girth Measurement' :
                                currentTask === 'breadths' ? 'Breadth Measurement' : 'Measurement';
            
            html += `<div class="collapsible-section">`;
            html += `<h4 class="collapsible-header">${sectionTitle}</h4>`;
            html += `<div class="collapsible-content">`;
            html += `<p><strong>Definition:</strong> ${data.measurement.definition}</p>`;
            html += `<p><strong>Subject position${currentTask === 'skinfolds' ? ' for measurement' : ''}:</strong> ${data.measurement.subjectPosition}</p>`;
            
            if (data.measurement.method) {
                html += `<p><strong>Method:</strong> ${data.measurement.method}</p>`;
            }
            if (data.measurement.technique) {
                html += `<p><strong>Measurement technique:</strong> ${data.measurement.technique}</p>`;
            }
            if (data.measurement.notes) {
                html += `<p><strong>Note${currentTask === 'skinfolds' ? ' on nomenclature' : ''}:</strong> ${data.measurement.notes}</p>`;
            }
            if (data.measurement.methods) {
                // Special handling for front thigh skinfold multiple methods
                data.measurement.methods.forEach(method => {
                    html += `<p><strong>${method.name}:</strong> ${method.description}</p>`;
                });
                if (data.measurement.additionalNotes) {
                    html += `<p>${data.measurement.additionalNotes}</p>`;
                }
            }
            if (data.measurement.techniques) {
                html += `<p><strong>General Technique Notes:</strong></p><ul>`;
                data.measurement.techniques.forEach(technique => {
                    html += `<li>${technique}</li>`;
                });
                html += `</ul>`;
            }
            
            html += `</div></div>`;
        }
        
        return html;
    }

    function showInfoPanel(data) {
        detailsPanel.classList.add('visible');
        interactiveArea.classList.add('showing-info');

        infoTitle.textContent = data.title;
        infoContent.innerHTML = generateInstructionsHTML(data);
        
        setupCollapsibleSections();
        infoDisplay.style.display = 'block';
        infoDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Handle video for skinfolds and landmarks
        if ((currentTask === 'skinfolds' || currentTask === 'landmarks') && data.videoId && data.startTime !== undefined && data.endTime !== undefined) {
            currentVideoStartTime = data.startTime;
            currentVideoEndTime = data.endTime;
            const embedUrl = `https://www.youtube.com/embed/${data.videoId}?start=${currentVideoStartTime}&end=${currentVideoEndTime}&autoplay=1&rel=0`;
            youtubePlayer.src = embedUrl;
            videoPlayerContainer.style.display = 'block';
            videoPlayerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            videoPlayerContainer.style.display = 'none';
            youtubePlayer.src = 'about:blank';
            currentVideoStartTime = 0;
            currentVideoEndTime = 0;
        }
    }

    function hideInfoPanel() {
        detailsPanel.classList.remove('visible');
        interactiveArea.classList.remove('showing-info');
        infoDisplay.style.display = 'none';
        videoPlayerContainer.style.display = 'none';
        youtubePlayer.src = 'about:blank';

        if (selectedDot) {
            selectedDot.classList.remove('element-selected');
            selectedDot = null;
        }
    }

    // New event listener for task buttons
    taskSelectContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('task-button')) {
            const selectedTask = event.target.dataset.task;
            if (selectedTask === currentTask) return; // Do nothing if the same task is clicked

            // Update active button
            const currentActiveButton = taskSelectContainer.querySelector('.task-button.active');
            if (currentActiveButton) {
                currentActiveButton.classList.remove('active');
            }
            event.target.classList.add('active');

            currentTask = selectedTask;
            taskDescription.textContent = taskDescriptions[currentTask];
            loadTaskData(currentTask);
            
            // Reinitialize developer sites if in developer mode
            if (developerMode) {
                initializeDeveloperSites();
            }
        }
    });

    // Event listeners for buttons
    if (closeButton) {
        closeButton.addEventListener('click', hideInfoPanel);
    }

    if (closeVideoButton) {
        closeVideoButton.addEventListener('click', function() {
            videoPlayerContainer.style.display = 'none';
            youtubePlayer.src = 'about:blank';
        });
    }

    if (restartVideoButton) {
        restartVideoButton.addEventListener('click', function() {
            if (currentVideoStartTime > 0) {
                const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${currentVideoStartTime}&end=${currentVideoEndTime}&autoplay=1&rel=0`;
                youtubePlayer.src = embedUrl;
            }
        });
    }

    // Resize handling
    function adjustDotPositions() {
        const imageWidth = skinfoldImage.offsetWidth;
        const imageHeight = skinfoldImage.offsetHeight;
        
        if (imageWidth === 0 || imageHeight === 0) {
            return;
        }
    }

    skinfoldImage.onload = adjustDotPositions;
    window.addEventListener('resize', adjustDotPositions);

    if (skinfoldImage.complete && skinfoldImage.naturalHeight !== 0) {
        adjustDotPositions();
    }

    // Developer mode functions
    function toggleDeveloperMode() {
        developerMode = !developerMode;
        if (developerMode) {
            startDeveloperMode();
        } else {
            stopDeveloperMode();
        }
    }

    function startDeveloperMode() {
        developerPanel.style.display = 'block';
        document.body.classList.add('developer-mode-active');
        
        // Hide measurement elements based on checkbox state
        toggleOverlayVisibility();
        
        // Initialize sites for current task
        initializeDeveloperSites();
        console.log('Developer mode: ON - Ready to align overlays for', currentTask);
    }

    function stopDeveloperMode() {
        developerPanel.style.display = 'none';
        document.body.classList.remove('developer-mode-active');
        
        // Restore measurement elements
        const allMeasurementElements = svgDotsContainer.querySelectorAll('.measurement-element, .measurement-dot');
        allMeasurementElements.forEach(element => {
            element.style.display = '';
        });
        
        currentSiteIndex = 0;
        currentTaskSites = [];
        lastYCoordinate = null;
        updateLockedYDisplay();
        
        // Clean up preview line
        removePreviewLine();
        isWaitingForEndPoint = false;
        startPoint = null;
        
        console.log('Developer mode: OFF');
    }

    function initializeDeveloperSites() {
        if (!taskData || !taskData[currentTask]) return;
        
        currentTaskSites = Object.keys(taskData[currentTask]);
        currentSiteIndex = 0;
        lastYCoordinate = null;
        updateLockedYDisplay();
        
        // Clean up any existing preview line
        removePreviewLine();
        isWaitingForEndPoint = false;
        startPoint = null;
        
        if (currentTaskSites.length > 0) {
            updateDeveloperDisplay();
        }
    }

    function updateDeveloperDisplay() {
        if (currentTaskSites.length === 0) return;
        
        const currentSite = currentTaskSites[currentSiteIndex];
        const siteData = taskData[currentTask][currentSite];
        
        currentSiteSpan.textContent = `${currentSite} (${currentSiteIndex + 1}/${currentTaskSites.length})`;
        
        // Set prompt based on site type
        if (siteData.type === "line") {
            clickPromptSpan.textContent = `${currentSite} - Click START point`;
        } else if (siteData.type === "ellipse") {
            clickPromptSpan.textContent = `${currentSite} - Click CENTER point`;
        } else {
            clickPromptSpan.textContent = `${currentSite} - Click dot position`;
        }
        
        // Update definition display
        updateSiteDefinition(siteData);
    }

    function updateSiteDefinition(siteData) {
        let definition = 'No definition available';
        
        // Get definition from the appropriate section
        if (siteData.identification && siteData.identification.definition) {
            definition = siteData.identification.definition;
        } else if (siteData.measurement && siteData.measurement.definition) {
            definition = siteData.measurement.definition;
        }
        
        // Add location info if available
        if (siteData.identification && siteData.identification.location) {
            definition += ' Location: ' + siteData.identification.location;
        }
        
        definitionText.textContent = definition;
    }

    function toggleOverlayVisibility() {
        const allMeasurementElements = svgDotsContainer.querySelectorAll('.measurement-element, .measurement-dot');
        const shouldHide = hideOverlaysCheckbox.checked;
        
        allMeasurementElements.forEach(element => {
            element.style.display = shouldHide ? 'none' : '';
        });
    }

    function updateLockedYDisplay() {
        if (lastYCoordinate !== null) {
            lockedYValueSpan.textContent = `(Y: ${lastYCoordinate}%)`;
        } else {
            lockedYValueSpan.textContent = '';
        }
    }

    function createPreviewLine() {
        if (!startPoint) return;
        
        previewLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        previewLine.setAttribute("x1", startPoint.x + "%");
        previewLine.setAttribute("y1", startPoint.y + "%");
        previewLine.setAttribute("x2", startPoint.x + "%");
        previewLine.setAttribute("y2", startPoint.y + "%");
        previewLine.setAttribute("stroke", "#FF6B35");
        previewLine.setAttribute("stroke-width", "2");
        previewLine.setAttribute("opacity", "0.8");
        previewLine.style.pointerEvents = "none";
        svgDotsContainer.appendChild(previewLine);
    }

    function updatePreviewLine(endX, endY) {
        if (!previewLine || !startPoint) return;
        
        previewLine.setAttribute("x2", endX + "%");
        previewLine.setAttribute("y2", endY + "%");
    }

    function removePreviewLine() {
        if (previewLine && svgDotsContainer.contains(previewLine)) {
            svgDotsContainer.removeChild(previewLine);
        }
        previewLine = null;
    }

    function nextSite() {
        // Clean up preview line when switching sites
        removePreviewLine();
        isWaitingForEndPoint = false;
        startPoint = null;
        
        // Clear Y-axis lock when moving to new site
        lastYCoordinate = null;
        updateLockedYDisplay();
        
        currentSiteIndex++;
        if (currentSiteIndex >= currentTaskSites.length) {
            currentSiteIndex = 0;
        }
        updateDeveloperDisplay();
    }

    function prevSite() {
        // Clean up preview line when switching sites
        removePreviewLine();
        isWaitingForEndPoint = false;
        startPoint = null;
        
        // Clear Y-axis lock when moving to new site
        lastYCoordinate = null;
        updateLockedYDisplay();
        
        currentSiteIndex--;
        if (currentSiteIndex < 0) {
            currentSiteIndex = currentTaskSites.length - 1;
        }
        updateDeveloperDisplay();
    }

    function outputCoordinates() {
        if (Object.keys(alignmentCoordinates).length === 0) {
            console.log('No alignment coordinates recorded yet.');
            return;
        }
        
        console.log('Alignment Coordinates:');
        console.log(JSON.stringify(alignmentCoordinates, null, 2));
        
        // Also copy to clipboard if possible
        if (navigator.clipboard) {
            navigator.clipboard.writeText(JSON.stringify(alignmentCoordinates, null, 2))
                .then(() => console.log('Coordinates copied to clipboard'))
                .catch(err => console.log('Failed to copy to clipboard:', err));
        }
    }

    // Developer panel event listeners
    if (prevSiteButton) {
        prevSiteButton.addEventListener('click', prevSite);
    }
    
    if (nextSiteButton) {
        nextSiteButton.addEventListener('click', nextSite);
    }
    
    if (outputCoordsButton) {
        outputCoordsButton.addEventListener('click', outputCoordinates);
    }
    
    if (hideOverlaysCheckbox) {
        hideOverlaysCheckbox.addEventListener('change', function() {
            if (developerMode) {
                toggleOverlayVisibility();
            }
        });
    }
    
    if (lockYAxisCheckbox) {
        lockYAxisCheckbox.addEventListener('change', function() {
            if (!this.checked) {
                lastYCoordinate = null;
                updateLockedYDisplay();
            }
        });
    }

    // Load anatomical data and initialize the application
    loadAnatomicalData();
}); 