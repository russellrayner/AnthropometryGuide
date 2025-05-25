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

    // Add coordinate finder event listeners
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
    });

    imageContainer.addEventListener('click', function(e) {
        if (!coordinateFindingMode) return;

        const rect = skinfoldImage.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);

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

        // Handle video for skinfolds
        if (currentTask === 'skinfolds' && data.videoId && data.startTime !== undefined && data.endTime !== undefined) {
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

    // Load anatomical data and initialize the application
    loadAnatomicalData();
}); 