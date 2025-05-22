document.addEventListener('DOMContentLoaded', function() {
    const skinfoldImage = document.getElementById('skinfoldImage');
    const svgDotsContainer = document.getElementById('skinfoldDots');
    const infoDisplay = document.getElementById('infoDisplay');
    const infoTitle = document.getElementById('infoTitle');
    const infoContent = document.getElementById('infoContent');
    const closeButton = document.getElementById('closeButton');
    const interactiveArea = document.querySelector('.interactive-area');
    const detailsPanel = document.querySelector('.details-panel');
    let selectedDot = null; // Variable to keep track of the selected dot

    const videoPlayerContainer = document.getElementById('videoPlayerContainer');
    const youtubePlayer = document.getElementById('youtubePlayer');
    const closeVideoButton = document.getElementById('closeVideoButton');
    const videoId = "qZtZWQXZ9sI";

// Database of skinfold site information with coordinates
    const skinfoldData = {
        triceps: {
            title: "Triceps Skinfold®",
            instructions: `
                <h4>Triceps Skinfold Site® Identification</h4>
                <p><strong>Definition:</strong> The most posterior part of the Triceps when viewed from the side at the marked Mid-acromiale-radiale® level.</p>
                <p><strong>Subject position for site marking:</strong> When marking the sites for the Triceps skinfold the subject assumes the anatomical position.</p>
                <p><strong>Location of skinfold site:</strong> The Triceps® skinfold site is marked over the most posterior part of the Triceps when viewed from the side at the marked Mid-acromiale-radialeⓇ level.</p>

                <h4>Measurement Procedure</h4>
                <p><strong>Subject position for measurement:</strong> The subject assumes a relaxed standing position with the left arm hanging by the side. The right arm should be relaxed with the shoulder joint slightly externally rotated and elbow extended by the side of the body.</p>
                <p><strong>Method:</strong> The fold is parallel to the long axis of the arm.</p>
                <p><strong>General Technique Notes:</strong></p>
                <ul>
                    <li>The skinfold is picked up at the marked line. It should be grasped and lifted (raised) so that a double fold of skin plus the underlying subcutaneous adipose tissue is held between the thumb and index finger of the left hand. The near edge of the thumb and finger are in line with the marked site. The back of the hand should be facing the measurer. Care must be taken not to incorporate underlying muscle tissue in the grasp. If difficulty is encountered the subject should tense then relax the muscle until the tester is confident that only skin and subcutaneous tissue are in the grasp.</li>
                    <li>The nearest edge of the contact faces of the caliper are applied 1 cm away from the edge of the thumb and finger. The caliper should be placed at a depth of approximately mid-fingernail.</li>
                    <li>The caliper is held at 90&deg; to the surface of the skinfold site at all times. The hand grasping the skin remains holding the fold while the caliper is in contact with the skin.</li>
                    <li>Measurement is recorded two seconds after the full pressure of the caliper is applied.</li>
                </ul>`,
            x: "85.5%",
            y: "35.1%",
            videoId: videoId,
            startTime: 845,
            endTime: 864
        },
        subscapular: {
            title: "Subscapular Skinfold®",
            instructions: `
                <h4>Subscapular Skinfold Site® Identification</h4>
                <p><strong>Definition:</strong> The site 2 cm along a line running laterally and obliquely downward from the Subscapulare® landmark at a 45° angle.</p>
                <p><strong>Subject position for site marking:</strong> The subject assumes a relaxed standing position with the arms hanging by the sides.</p>
                <p><strong>Location of skinfold site:</strong> Use a tape measure to locate the point 2 cm from the Subscapulare® in a line 45° laterally downward.</p>

                <h4>Measurement Procedure</h4>
                <p><strong>Subject position for measurement:</strong> The subject assumes a relaxed standing position with the arms hanging by the sides.</p>
                <p><strong>Method:</strong> The line of the skinfold is determined by the natural fold lines of the skin (running laterally and obliquely downward at a 45° angle).</p>
                <p><strong>General Technique Notes:</strong></p>
                <ul>
                    <li>The skinfold is picked up at the marked line. It should be grasped and lifted (raised) so that a double fold of skin plus the underlying subcutaneous adipose tissue is held between the thumb and index finger of the left hand. The near edge of the thumb and finger are in line with the marked site. The back of the hand should be facing the measurer.</li>
                    <li>The nearest edge of the contact faces of the caliper are applied 1 cm away from the edge of the thumb and finger.</li>
                    <li>The caliper is held at 90&deg; to the surface of the skinfold site at all times. The hand grasping the skin remains holding the fold while the caliper is in contact with the skin.</li>
                    <li>Measurement is recorded two seconds after the full pressure of the caliper is applied.</li>
                </ul>`,
            x: "78.2%",
            y: "31.5%",
            videoId: videoId,
            startTime: 865,
            endTime: 881
        },
        biceps: {
            title: "Biceps Skinfold®",
            instructions: `
                <h4>Biceps Skinfold Site® Identification</h4>
                <p><strong>Definition:</strong> The most anterior part of the Biceps.</p>
                <p><strong>Subject position for site marking:</strong> When marking the sites for the Biceps® skinfold the subject assumes the anatomical position.</p>
                <p><strong>Location of skinfold site:</strong> The Biceps® skinfold site is marked over the most anterior part of the Biceps when viewed from the side at the marked Mid-acromiale-radialeⓇ level.</p>

                <h4>Measurement Procedure</h4>
                <p><strong>Subject position for measurement:</strong> The subject assumes a relaxed standing position with the left arm hanging by the side. The right arm should be relaxed with the shoulder joint slightly externally rotated and elbow extended by the side of the body.</p>
                <p><strong>Method:</strong> This skinfold is parallel to the long axis of the arm.</p>
                <p><strong>General Technique Notes:</strong></p>
                <ul>
                    <li>The skinfold is picked up at the marked line. Grasp a double fold of skin plus underlying subcutaneous adipose tissue between the thumb and index finger of the left hand. Ensure no underlying muscle tissue is in the grasp.</li>
                    <li>Apply caliper faces 1 cm away from thumb and finger, at approximately mid-fingernail depth.</li>
                    <li>Caliper at 90&deg; to skinfold surface. Maintain grasp during measurement.</li>
                    <li>Record measurement 2 seconds after full caliper pressure is applied.</li>
                </ul>`,
            x: "17.6%",
            y: "33.7%",
            videoId: videoId,
            startTime: 883,
            endTime: 889
        },
        iliac_crest: {
            title: "Iliac Crest Skinfold®",
            instructions: `
                <h4>Iliac Crest Skinfold Site® Identification</h4>
                <p><strong>Definition:</strong> The site at the centre of the skinfold raised immediately above the marked Iliocristale®.</p>
                <p><strong>Subject position for site marking:</strong> The subject assumes a relaxed position with the left arm hanging by the side and the right arm abducted to the horizontal.</p>
                <p><strong>Location of skinfold site:</strong> This skinfold is raised immediately superior to the Iliocristale®. Align the fingers of the left hand on the Iliocristale® landmark and exert pressure inwards so that the fingers roll over the iliac crest. Substitute the left thumb for these fingers and relocate the index finger a sufficient distance superior to the thumb so that this grasp becomes the skinfold to be measured. Mark the centre of the raised skinfold. The fold runs slightly downwards anteriorly as determined by the natural fold of the skin.</p>

                <h4>Measurement Procedure</h4>
                <p><strong>Subject position for measurement:</strong> The subject assumes a relaxed standing position with the left arm hanging by the side. The right arm should be either abducted or placed across the trunk.</p>
                <p><strong>Method:</strong> The line of the skinfold generally runs slightly downward posterior-anterior, as determined by the natural fold lines of the skin.</p>
                <p><strong>Note on nomenclature:</strong> Over the years there has been a lot of confusion about the nomenclature of skinfold sites over the ilioabdominal region. ISAK identifies the Iliac crest® and Supraspinale® skinfold sites. ISAK's Iliac crest site is very similar to the site that Durnin & Womersley (1974) called the suprailiac skinfold.</p>
                <p><strong>General Technique Notes:</strong></p>
                <ul>
                    <li>Grasp skinfold at marked site.</li>
                    <li>Apply caliper 1 cm from fingers, perpendicular to fold.</li>
                    <li>Record after 2 seconds.</li>
                </ul>`,
            x: "82.2%",
            y: "45.1%",
            videoId: videoId,
            startTime: 901,
            endTime: 917
        },
        supraspinale: {
            title: "Supraspinale Skinfold®",
            instructions: `
                <h4>Supraspinale Skinfold Site® Identification</h4>
                <p><strong>Definition:</strong> The site at the intersection of two lines: (1) the line from the marked Iliospinale® to the anterior axillary border, and (2) the horizontal line at the level of the marked Iliocristale®.</p>
                <p><strong>Subject position for site marking:</strong> The subject assumes a relaxed standing position with the arms hanging by the sides. The right arm may be abducted to the horizontal after the anterior axillary border has been identified.</p>
                <p><strong>Location of skinfold site:</strong> The fold runs slightly downwards and anteriorly as determined by the natural fold of the skin.</p>
                <p><strong>Nomenclature Note:</strong> This skinfold was originally named "suprailiac" by Parnell (1958) and Heath and Carter (1967), but since 1982 it has been known as the "supraspinale".</p>

                <h4>Measurement Procedure</h4>
                <p><strong>Subject position for measurement:</strong> The subject assumes a relaxed standing position with the arms hanging by the sides.</p>
                <p><strong>Method:</strong> The fold runs medially downward at about a 45° angle as determined by the natural fold of the skin.</p>
                <p><strong>Note:</strong> ISAK's Supraspinale site was termed the suprailiac by Parnell (1958) and Tanner (1964). ISAK'S Supraspinale skinfold site is a site used in the Heath-Carter somatotype system.</p>
                <p><strong>General Technique Notes:</strong></p>
                <ul>
                    <li>Grasp skinfold at marked site following its natural line.</li>
                    <li>Apply caliper 1 cm from fingers, perpendicular to fold.</li>
                    <li>Record after 2 seconds.</li>
                </ul>`,
            x: "22.9%",
            y: "43.5%",
            videoId: videoId,
            startTime: 919,
            endTime: 931
        },
        abdominal: {
            title: "Abdominal Skinfold®",
            instructions: `
                <h4>Abdominal Skinfold Site® Identification</h4>
                <p><strong>Definition:</strong> The site 5 cm to the right hand side of the omphalion (midpoint of the navel).</p>
                <p><strong>Subject position for site marking:</strong> The subject assumes a relaxed standing position with the arms hanging by the sides.</p>
                <p><strong>Location of skinfold site:</strong> This is a vertical fold raised 5 cm from the right hand side of the omphalion.</p>

                <h4>Measurement Procedure</h4>
                <p><strong>Subject position for measurement:</strong> The subject assumes a relaxed standing position with the arms hanging by the sides.</p>
                <p><strong>Method:</strong> This is a vertical fold. It is particularly important at this site that the measurer is sure the initial grasp is firm and broad since often the underlying musculature is poorly developed. This may result in an underestimation of the thickness of the subcutaneous layer of tissue. (Note: Do not place the fingers or caliper inside the navel.)</p>
                <p><strong>General Technique Notes:</strong></p>
                <ul>
                    <li>Grasp a firm, broad, vertical fold at the marked site.</li>
                    <li>Apply caliper 1 cm from fingers, perpendicular to fold.</li>
                    <li>Record after 2 seconds.</li>
                </ul>`,
            x: "25.6%",
            y: "43.9%",
            videoId: videoId,
            startTime: 933,
            endTime: 951
        },
        front_thigh: {
            title: "Front Thigh Skinfold®",
            instructions: `
                <h4>Front Thigh Skinfold Site® Identification</h4>
                <p><strong>Definition:</strong> The site at the mid-point of the distance between the Inguinal fold® and the anterior surface of the patella (Anterior patella®) on the midline of the thigh.</p>
                <p><strong>Subject position for site marking:</strong> The subject assumes a seated position with the torso erect and the arms hanging by the sides. The knee of the right leg should be bent at a right angle.</p>
                <p><strong>Location of skinfold site:</strong> The measurer stands facing the right side of the seated subject on the lateral side of the thigh. The site is marked parallel to the long axis of the thigh at the mid-point of the distance between the Inguinal fold® and the superior margin of the anterior surface of the patella (while the leg is bent). If there is difficulty locating the Inguinal fold® the subject should flex the hip to make a fold. Place a small horizontal mark at the level of the mid-point between the two landmarks. Now draw a perpendicular line to intersect the horizontal line. This perpendicular line is located in the midline of the thigh. If a tape is used be sure to avoid following the curvature of the surface of the skin.</p>

                <h4>Measurement Procedure</h4>
                <p><strong>Subject position for measurement:</strong> The subject assumes a seated position at the front edge of the box with the torso erect and the arms hanging by the sides. The knee of the right leg is usually bent at a right angle. In some subjects, this skinfold may be easier to take with the knee extended.</p>
                <p><strong>Method:</strong> Because of difficulties with this skinfold, three methods are recommended (record method A, B, or C).</p>
                <p><strong>Method A (Standard and Preferred):</strong> The measurer stands facing the right side of the subject on the lateral side of the thigh. The skinfold is raised at the marked site. The skinfold measurement is taken while the knee is bent.</p>
                <p><strong>Method B:</strong> If the fold is difficult to raise the subject is asked to assist by lifting with both hands the underside of the thigh to relieve the tension of the skin.</p>
                <p><strong>Method C:</strong> For subjects with particularly tight skinfolds, the subject is asked to assist by lifting the underside of the thigh as in (b). The recorder (standing on the medial aspect of the subject's thigh) assists by raising a fold with both hands at about 6 cm either side of the landmark. The measurer then raises the skinfold at the marked site.</p>
                <p>If the skinfold is difficult to take with the knee flexed, ask the subject to extend the knee. Any of the three methods (A, B and C) may be used with the knee extended if necessary.</p>
                <p>The skinfold is parallel to the long axis of the thigh.</p>
                <p><strong>General Technique Notes:</strong></p>
                <ul>
                    <li>Grasp skinfold at marked site, parallel to long axis of thigh.</li>
                    <li>Apply caliper 1 cm from fingers, perpendicular to fold.</li>
                    <li>Record after 2 seconds.</li>
                </ul>`,
            x: "23.2%",
            y: "60.4%",
            videoId: videoId,
            startTime: 953,
            endTime: 1022
        },
        medial_calf: {
            title: "Medial Calf Skinfold®",
            instructions: `
                <h4>Medial Calf Skinfold Site® Identification</h4>
                <p><strong>Definition:</strong> The site on the most medial aspect of the calf at the level of the maximal girth.</p>
                <p><strong>Subject position for site marking:</strong> The subject assumes a relaxed standing position with the arms hanging by the sides. The subject's feet should be separated with the weight evenly distributed.</p>
                <p><strong>Location of skinfold site:</strong> The level of the maximum girth is determined and marked with a small horizontal line on the medial aspect of the calf. The maximal girth is found by using the middle fingers to manipulate the position of the tape in a series of up or down measurements to determine the maximum girth. View the marked site from the front to locate the most medial point and mark this with an intersecting vertical line.</p>

                <h4>Measurement Procedure (Medial Calf Skinfold</h4>
                <p><strong>Subject position for measurement:</strong> The subject assumes a relaxed standing position with the arms hanging by the sides and the right foot placed on the box. The right knee is bent at about 90°.</p>
                <p><strong>Method:</strong> The subject's right foot is placed on a box with the calf relaxed. The fold is parallel to the long axis of the leg.</p>
                <p><strong>General Technique Notes:</strong></p>
                <ul>
                    <li>Grasp vertical skinfold at marked site (most medial point at maximum girth).</li>
                    <li>Apply caliper 1 cm from fingers, perpendicular to fold.</li>
                    <li>Record after 2 seconds.</li>
                </ul>`,
            x: "26.7%",
            y: "82.5%",
            videoId: videoId,
            startTime: 1024,
            endTime: 1041
        }
    };

    function createDot(siteKey, siteData) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", siteData.x);
        circle.setAttribute("cy", siteData.y);
        circle.setAttribute("r", "1.3%"); // Use fixed radius for all dots
        circle.setAttribute("data-site", siteKey);
        circle.classList.add("skinfold-dot"); // For styling
        svgDotsContainer.appendChild(circle);
        return circle;
    }

    // Create dots and add event listeners
    for (const siteKey in skinfoldData) {
        if (skinfoldData.hasOwnProperty(siteKey)) {
            const site = skinfoldData[siteKey];
            if (site.x && site.y) { // Ensure coordinates are present
                const dot = createDot(siteKey, site);
                dot.addEventListener('click', function(event) {
                    if (selectedDot) {
                        selectedDot.classList.remove('skinfold-dot-selected');
                    }
                    this.classList.add('skinfold-dot-selected');
                    selectedDot = this;

                    const clickedSiteKey = this.dataset.site;
                    const data = skinfoldData[clickedSiteKey];

                    if (data) {
                        // Show the details panel and shift layout
                        detailsPanel.classList.add('visible');
                        interactiveArea.classList.add('showing-info');

                        // Display text info
                        infoTitle.textContent = data.title;
                        infoContent.innerHTML = data.instructions;
                        infoDisplay.style.display = 'block';
                        infoDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });

                        // Display video
                        if (data.videoId && data.startTime !== undefined && data.endTime !== undefined) {
                            const embedUrl = `https://www.youtube.com/embed/${data.videoId}?start=${data.startTime}&end=${data.endTime}&autoplay=1&rel=0`;
                            youtubePlayer.src = embedUrl;
                            videoPlayerContainer.style.display = 'block';
                            videoPlayerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        } else {
                            // If no video data, hide player and clear src
                            videoPlayerContainer.style.display = 'none';
                            youtubePlayer.src = 'about:blank';
                        }
                    }
                });
            }
        }
    }

    if (closeButton) {
        closeButton.addEventListener('click', function() {
            // Hide the details panel and reset layout
            detailsPanel.classList.remove('visible');
            interactiveArea.classList.remove('showing-info');

            infoDisplay.style.display = 'none';
            
            // Also close video when main info is closed
            videoPlayerContainer.style.display = 'none';
            youtubePlayer.src = 'about:blank'; 

            // Deselect the dot if one is selected
            if (selectedDot) {
                selectedDot.classList.remove('skinfold-dot-selected');
                selectedDot = null;
            }
        });
    }

    if (closeVideoButton) {
        closeVideoButton.addEventListener('click', function() {
            videoPlayerContainer.style.display = 'none';
            youtubePlayer.src = 'about:blank'; // Stop video playback
        });
    }

    // Adjust dot positions if the image or window resizes (optional, but good for responsiveness)
    function adjustDotPositions() {
        const imageWidth = skinfoldImage.offsetWidth;
        const imageHeight = skinfoldImage.offsetHeight;
        const dots = svgDotsContainer.querySelectorAll('.skinfold-dot');

        // Check if image has loaded and has dimensions
        if (imageWidth === 0 || imageHeight === 0) {
            // Image not loaded yet, or hidden. Try again shortly.
            // Or, if the image is loaded but the container is not yet sized, this might also happen.
            // Ensure the image-container and image have appropriate CSS for sizing.
            return; 
        }

        dots.forEach(dot => {
            const siteKey = dot.dataset.site;
            const siteData = skinfoldData[siteKey];
            if (siteData && siteData.x && siteData.y) {
                // Current cx, cy, r are percentages. No need to recalculate for SVG if using percentages.
                // If they were absolute, you would recalculate them here based on imageWidth and imageHeight.
                // For example:
                // dot.setAttribute("cx", parseFloat(siteData.x) / 100 * imageWidth);
                // dot.setAttribute("cy", parseFloat(siteData.y) / 100 * imageHeight);
            }
        });
    }

    // Initial adjustment
    skinfoldImage.onload = adjustDotPositions; // Adjust when image is loaded
    window.addEventListener('resize', adjustDotPositions); // Adjust on window resize

    // If the image might already be loaded from cache before onload is set
    if (skinfoldImage.complete && skinfoldImage.naturalHeight !== 0) {
        adjustDotPositions();
    }
});