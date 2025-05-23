document.addEventListener('DOMContentLoaded', function() {
    const skinfoldImage = document.getElementById('skinfoldImage');
    const svgDotsContainer = document.getElementById('skinfoldDots');
    const infoDisplay = document.getElementById('infoDisplay');
    const infoTitle = document.getElementById('infoTitle');
    const infoContent = document.getElementById('infoContent');
    const closeButton = document.getElementById('closeButton');
    const interactiveArea = document.querySelector('.interactive-area');
    const detailsPanel = document.querySelector('.details-panel');
    const taskSelect = document.getElementById('taskSelect');
    const mainTitle = document.getElementById('mainTitle');
    const taskDescription = document.getElementById('taskDescription');
    let selectedDot = null;
    let currentTask = 'skinfolds';

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

    // Add coordinate finder event listeners
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key.toLowerCase() === 'c') {
            e.preventDefault();
            coordinateFindingMode = !coordinateFindingMode;
            document.body.style.cursor = coordinateFindingMode ? 'crosshair' : 'default';
            console.log('Coordinate finding mode:', coordinateFindingMode ? 'ON' : 'OFF');
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

    // Data structures for each task type
    const taskData = {
        skinfolds: {
            triceps: {
                title: "Triceps Skinfold®",
                instructions: `
                    <div class="collapsible-section">
                        <h4 class="collapsible-header collapsed">Triceps Skinfold Site® Identification</h4>
                        <div class="collapsible-content collapsed">
                            <p><strong>Definition:</strong> The most posterior part of the Triceps when viewed from the side at the marked Mid-acromiale-radiale® level.</p>
                            <p><strong>Subject position for site marking:</strong> When marking the sites for the Triceps skinfold the subject assumes the anatomical position.</p>
                            <p><strong>Location of skinfold site:</strong> The Triceps® skinfold site is marked over the most posterior part of the Triceps when viewed from the side at the marked Mid-acromiale-radialeⓇ level.</p>
                        </div>
                    </div>
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Measurement Procedure</h4>
                        <div class="collapsible-content">
                            <p><strong>Subject position for measurement:</strong> The subject assumes a relaxed standing position with the left arm hanging by the side. The right arm should be relaxed with the shoulder joint slightly externally rotated and elbow extended by the side of the body.</p>
                            <p><strong>Method:</strong> The fold is parallel to the long axis of the arm.</p>
                            <p><strong>General Technique Notes:</strong></p>
                            <ul>
                                <li>The skinfold is picked up at the marked line. It should be grasped and lifted (raised) so that a double fold of skin plus the underlying subcutaneous adipose tissue is held between the thumb and index finger of the left hand.</li>
                                <li>The nearest edge of the contact faces of the caliper are applied 1 cm away from the edge of the thumb and finger.</li>
                                <li>The caliper is held at 90° to the surface of the skinfold site at all times.</li>
                                <li>Measurement is recorded two seconds after the full pressure of the caliper is applied.</li>
                            </ul>
                        </div>
                    </div>`,
                x: "83.3%",
                y: "35.0%",
                videoId: videoId,
                startTime: 846,
                endTime: 864
            },
            subscapular: {
                title: "Subscapular Skinfold®",
                instructions: `
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Subscapular Skinfold Site® Identification</h4>
                        <div class="collapsible-content">
                            <p><strong>Definition:</strong> The site 2 cm along a line running laterally and obliquely downward from the Subscapulare® landmark at a 45° angle.</p>
                            <p><strong>Subject position for site marking:</strong> The subject assumes a relaxed standing position with the arms hanging by the sides.</p>
                            <p><strong>Location of skinfold site:</strong> Use a tape measure to locate the point 2 cm from the Subscapulare® in a line 45° laterally downward.</p>
                        </div>
                    </div>
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Measurement Procedure</h4>
                        <div class="collapsible-content">
                            <p><strong>Subject position for measurement:</strong> The subject assumes a relaxed standing position with the arms hanging by the sides.</p>
                            <p><strong>Method:</strong> The line of the skinfold is determined by the natural fold lines of the skin (running laterally and obliquely downward at a 45° angle).</p>
                            <p><strong>General Technique Notes:</strong></p>
                            <ul>
                                <li>The skinfold is picked up at the marked line. It should be grasped and lifted (raised) so that a double fold of skin plus the underlying subcutaneous adipose tissue is held between the thumb and index finger of the left hand.</li>
                                <li>The nearest edge of the contact faces of the caliper are applied 1 cm away from the edge of the thumb and finger.</li>
                                <li>The caliper is held at 90° to the surface of the skinfold site at all times.</li>
                                <li>Measurement is recorded two seconds after the full pressure of the caliper is applied.</li>
                            </ul>
                        </div>
                    </div>`,
                x: "78.2%",
                y: "31.5%",
                videoId: videoId,
                startTime: 865,
                endTime: 881
            },
            biceps: {
                title: "Biceps Skinfold®",
                instructions: `
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Biceps Skinfold Site® Identification</h4>
                        <div class="collapsible-content">
                            <p><strong>Definition:</strong> The most anterior part of the Biceps.</p>
                            <p><strong>Subject position for site marking:</strong> When marking the sites for the Biceps® skinfold the subject assumes the anatomical position.</p>
                            <p><strong>Location of skinfold site:</strong> The Biceps® skinfold site is marked over the most anterior part of the Biceps when viewed from the side at the marked Mid-acromiale-radialeⓇ level.</p>
                        </div>
                    </div>
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Measurement Procedure</h4>
                        <div class="collapsible-content">
                            <p><strong>Subject position for measurement:</strong> The subject assumes a relaxed standing position with the left arm hanging by the side. The right arm should be relaxed with the shoulder joint slightly externally rotated and elbow extended by the side of the body.</p>
                            <p><strong>Method:</strong> This skinfold is parallel to the long axis of the arm.</p>
                            <p><strong>General Technique Notes:</strong></p>
                            <ul>
                                <li>The skinfold is picked up at the marked line. Grasp a double fold of skin plus underlying subcutaneous adipose tissue between the thumb and index finger of the left hand.</li>
                                <li>Apply caliper faces 1 cm away from thumb and finger, at approximately mid-fingernail depth.</li>
                                <li>Caliper at 90° to skinfold surface. Maintain grasp during measurement.</li>
                                <li>Record measurement 2 seconds after full caliper pressure is applied.</li>
                            </ul>
                        </div>
                    </div>`,
                x: "17.0%",
                y: "34.2%",
                videoId: videoId,
                startTime: 883,
                endTime: 900
            },
            iliac_crest: {
                title: "Iliac Crest Skinfold®",
                instructions: `
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Iliac Crest Skinfold Site® Identification</h4>
                        <div class="collapsible-content">
                            <p><strong>Definition:</strong> The site at the centre of the skinfold raised immediately above the marked Iliocristale®.</p>
                            <p><strong>Subject position for site marking:</strong> The subject assumes a relaxed position with the left arm hanging by the side and the right arm abducted to the horizontal.</p>
                            <p><strong>Location of skinfold site:</strong> This skinfold is raised immediately superior to the Iliocristale®. Align the fingers of the left hand on the Iliocristale® landmark and exert pressure inwards so that the fingers roll over the iliac crest. Substitute the left thumb for these fingers and relocate the index finger a sufficient distance superior to the thumb so that this grasp becomes the skinfold to be measured. Mark the centre of the raised skinfold. The fold runs slightly downwards anteriorly as determined by the natural fold of the skin.</p>
                        </div>
                    </div>
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Measurement Procedure</h4>
                        <div class="collapsible-content">
                            <p><strong>Subject position for measurement:</strong> The subject assumes a relaxed standing position with the left arm hanging by the side. The right arm should be either abducted or placed across the trunk.</p>
                            <p><strong>Method:</strong> The line of the skinfold generally runs slightly downward posterior-anterior, as determined by the natural fold lines of the skin.</p>
                            <p><strong>Note on nomenclature:</strong> Over the years there has been a lot of confusion about the nomenclature of skinfold sites over the ilioabdominal region. ISAK identifies the Iliac crest® and Supraspinale® skinfold sites. ISAK's Iliac crest site is very similar to the site that Durnin & Womersley (1974) called the suprailiac skinfold.</p>
                            <p><strong>General Technique Notes:</strong></p>
                            <ul>
                                <li>Grasp skinfold at marked site.</li>
                                <li>Apply caliper 1 cm from fingers, perpendicular to fold.</li>
                                <li>Record after 2 seconds.</li>
                            </ul>
                        </div>
                    </div>`,
                x: "80.8%",
                y: "44.2%",
                videoId: videoId,
                startTime: 901,
                endTime: 917
            },
            supraspinale: {
                title: "Supraspinale Skinfold®",
                instructions: `
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Supraspinale Skinfold Site® Identification</h4>
                        <div class="collapsible-content">
                            <p><strong>Definition:</strong> The site at the intersection of two lines: (1) the line from the marked Iliospinale® to the anterior axillary border, and (2) the horizontal line at the level of the marked Iliocristale®.</p>
                            <p><strong>Subject position for site marking:</strong> The subject assumes a relaxed standing position with the arms hanging by the sides. The right arm may be abducted to the horizontal after the anterior axillary border has been identified.</p>
                            <p><strong>Location of skinfold site:</strong> The fold runs slightly downwards and anteriorly as determined by the natural fold of the skin.</p>
                            <p><strong>Nomenclature Note:</strong> This skinfold was originally named "suprailiac" by Parnell (1958) and Heath and Carter (1967), but since 1982 it has been known as the "supraspinale".</p>
                        </div>
                    </div>
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Measurement Procedure</h4>
                        <div class="collapsible-content">
                            <p><strong>Subject position for measurement:</strong> The subject assumes a relaxed standing position with the arms hanging by the sides.</p>
                            <p><strong>Method:</strong> The fold runs medially downward at about a 45° angle as determined by the natural fold of the skin.</p>
                            <p><strong>Note:</strong> ISAK's Supraspinale site was termed the suprailiac by Parnell (1958) and Tanner (1964). ISAK'S Supraspinale skinfold site is a site used in the Heath-Carter somatotype system.</p>
                            <p><strong>General Technique Notes:</strong></p>
                            <ul>
                                <li>Grasp skinfold at marked site following its natural line.</li>
                                <li>Apply caliper 1 cm from fingers, perpendicular to fold.</li>
                                <li>Record after 2 seconds.</li>
                            </ul>
                        </div>
                    </div>`,
                x: "22.9%",
                y: "43.5%",
                videoId: videoId,
                startTime: 919,
                endTime: 931
            },
            abdominal: {
                title: "Abdominal Skinfold®",
                instructions: `
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Abdominal Skinfold Site® Identification</h4>
                        <div class="collapsible-content">
                            <p><strong>Definition:</strong> The site 5 cm to the right hand side of the omphalion (midpoint of the navel).</p>
                            <p><strong>Subject position for site marking:</strong> The subject assumes a relaxed standing position with the arms hanging by the sides.</p>
                            <p><strong>Location of skinfold site:</strong> This is a vertical fold raised 5 cm from the right hand side of the omphalion.</p>
                        </div>
                    </div>
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Measurement Procedure</h4>
                        <div class="collapsible-content">
                            <p><strong>Subject position for measurement:</strong> The subject assumes a relaxed standing position with the arms hanging by the sides.</p>
                            <p><strong>Method:</strong> This is a vertical fold. It is particularly important at this site that the measurer is sure the initial grasp is firm and broad since often the underlying musculature is poorly developed. This may result in an underestimation of the thickness of the subcutaneous layer of tissue. (Note: Do not place the fingers or caliper inside the navel.)</p>
                            <p><strong>General Technique Notes:</strong></p>
                            <ul>
                                <li>Grasp a firm, broad, vertical fold at the marked site.</li>
                                <li>Apply caliper 1 cm from fingers, perpendicular to fold.</li>
                                <li>Record after 2 seconds.</li>
                            </ul>
                        </div>
                    </div>`,
                x: "25.4%",
                y: "42.8%",
                videoId: videoId,
                startTime: 933,
                endTime: 951
            },
            front_thigh: {
                title: "Front Thigh Skinfold®",
                instructions: `
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Front Thigh Skinfold Site® Identification</h4>
                        <div class="collapsible-content">
                            <p><strong>Definition:</strong> The site at the mid-point of the distance between the Inguinal fold® and the anterior surface of the patella (Anterior patella®) on the midline of the thigh.</p>
                            <p><strong>Subject position for site marking:</strong> The subject assumes a seated position with the torso erect and the arms hanging by the sides. The knee of the right leg should be bent at a right angle.</p>
                            <p><strong>Location of skinfold site:</strong> The measurer stands facing the right side of the seated subject on the lateral side of the thigh. The site is marked parallel to the long axis of the thigh at the mid-point of the distance between the Inguinal fold® and the superior margin of the anterior surface of the patella (while the leg is bent). If there is difficulty locating the Inguinal fold® the subject should flex the hip to make a fold. Place a small horizontal mark at the level of the mid-point between the two landmarks. Now draw a perpendicular line to intersect the horizontal line. This perpendicular line is located in the midline of the thigh. If a tape is used be sure to avoid following the curvature of the surface of the skin.</p>
                        </div>
                    </div>
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Measurement Procedure</h4>
                        <div class="collapsible-content">
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
                            </ul>
                        </div>
                    </div>`,
                x: "23.2%",
                y: "61.0%",
                videoId: videoId,
                startTime: 953,
                endTime: 1022
            },
            medial_calf: {
                title: "Medial Calf Skinfold®",
                instructions: `
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Medial Calf Skinfold Site® Identification</h4>
                        <div class="collapsible-content">
                            <p><strong>Definition:</strong> The site on the most medial aspect of the calf at the level of the maximal girth.</p>
                            <p><strong>Subject position for site marking:</strong> The subject assumes a relaxed standing position with the arms hanging by the sides. The subject's feet should be separated with the weight evenly distributed.</p>
                            <p><strong>Location of skinfold site:</strong> The level of the maximum girth is determined and marked with a small horizontal line on the medial aspect of the calf. The maximal girth is found by using the middle fingers to manipulate the position of the tape in a series of up or down measurements to determine the maximum girth. View the marked site from the front to locate the most medial point and mark this with an intersecting vertical line.</p>
                        </div>
                    </div>
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Measurement Procedure (Medial Calf Skinfold)</h4>
                        <div class="collapsible-content">
                            <p><strong>Subject position for measurement:</strong> The subject assumes a relaxed standing position with the arms hanging by the sides and the right foot placed on the box. The right knee is bent at about 90°.</p>
                            <p><strong>Method:</strong> The subject's right foot is placed on a box with the calf relaxed. The fold is parallel to the long axis of the leg.</p>
                            <p><strong>General Technique Notes:</strong></p>
                            <ul>
                                <li>Grasp vertical skinfold at marked site (most medial point at maximum girth).</li>
                                <li>Apply caliper 1 cm from fingers, perpendicular to fold.</li>
                                <li>Record after 2 seconds.</li>
                            </ul>
                        </div>
                    </div>`,
                x: "26.3%",
                y: "79.5%",
                videoId: videoId,
                startTime: 1025,
                endTime: 1041
            }
        },
        landmarks: {
            acromiale: {
                title: "Acromiale®",
                instructions: `
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Landmark Identification</h4>
                        <div class="collapsible-content">
                            <p><strong>Definition:</strong> The most lateral point on the lateral border of the acromial process of the scapula.</p>
                            <p><strong>Subject position:</strong> The subject assumes a relaxed standing position.</p>
                            <p><strong>Palpation technique:</strong> Palpate laterally along the spine of the scapula to the acromial process. The landmark is at the most lateral point of the lateral border of the acromion.</p>
                        </div>
                    </div>`,
                x: "82.0%",
                y: "25.0%"
            },
            radiale: {
                title: "Radiale®",
                instructions: `
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Landmark Identification</h4>
                        <div class="collapsible-content">
                            <p><strong>Definition:</strong> The most proximal and lateral point on the head of the radius.</p>
                            <p><strong>Subject position:</strong> The subject's elbow is flexed at 90° with the palm facing medially.</p>
                            <p><strong>Palpation technique:</strong> Palpate in the depression on the posterior/lateral aspect of the extended elbow between the head of the radius and the capitulum of the humerus.</p>
                        </div>
                    </div>`,
                x: "85.0%",
                y: "45.0%"
            },
            stylion: {
                title: "Stylion®",
                instructions: `
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Landmark Identification</h4>
                        <div class="collapsible-content">
                            <p><strong>Definition:</strong> The most distal point on the styloid process of the radius.</p>
                            <p><strong>Subject position:</strong> The subject's arm is in the anatomical position.</p>
                            <p><strong>Palpation technique:</strong> Palpate the distal end of the radius on the lateral aspect of the wrist to locate the styloid process.</p>
                        </div>
                    </div>`,
                x: "88.0%",
                y: "55.0%"
            }
        },
        lengths: {
            arm_length: {
                title: "Arm Length®",
                instructions: `
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Length Measurement</h4>
                        <div class="collapsible-content">
                            <p><strong>Definition:</strong> The distance from Acromiale® to Radiale® landmarks.</p>
                            <p><strong>Subject position:</strong> Standing with arms relaxed at sides.</p>
                            <p><strong>Measurement technique:</strong> Use a large sliding caliper or segmometer to measure the straight-line distance between the two landmarks.</p>
                        </div>
                    </div>`,
                startX: "82.0%",
                startY: "25.0%",
                endX: "85.0%",
                endY: "45.0%",
                type: "line"
            },
            forearm_length: {
                title: "Forearm Length®",
                instructions: `
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Length Measurement</h4>
                        <div class="collapsible-content">
                            <p><strong>Definition:</strong> The distance from Radiale® to Stylion® landmarks.</p>
                            <p><strong>Subject position:</strong> Standing with arms relaxed at sides.</p>
                            <p><strong>Measurement technique:</strong> Use a large sliding caliper or segmometer to measure the straight-line distance between the two landmarks.</p>
                        </div>
                    </div>`,
                startX: "85.0%",
                startY: "45.0%",
                endX: "88.0%",
                endY: "55.0%",
                type: "line"
            }
        },
        girths: {
            arm_girth: {
                title: "Arm Girth (Relaxed)®",
                instructions: `
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Girth Measurement</h4>
                        <div class="collapsible-content">
                            <p><strong>Definition:</strong> The girth of the arm at the marked Mid-acromiale-radiale® level with the arm relaxed.</p>
                            <p><strong>Subject position:</strong> Standing with arms relaxed at sides.</p>
                            <p><strong>Measurement technique:</strong> Pass the tape around the arm at the marked level, ensuring it lies in a plane perpendicular to the long axis of the arm.</p>
                        </div>
                    </div>`,
                centerX: "82.0%",
                centerY: "38.0%",
                radiusX: "3.0%",
                radiusY: "1.5%",
                type: "ellipse"
            },
            waist_girth: {
                title: "Waist Girth®",
                instructions: `
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Girth Measurement</h4>
                        <div class="collapsible-content">
                            <p><strong>Definition:</strong> The girth at the narrowest point between the lower costal border and the iliac crest.</p>
                            <p><strong>Subject position:</strong> Standing with arms relaxed at sides.</p>
                            <p><strong>Measurement technique:</strong> Pass the tape horizontally around the waist at the narrowest point, usually at the end of normal expiration.</p>
                        </div>
                    </div>`,
                centerX: "50.0%",
                centerY: "48.0%",
                radiusX: "8.0%",
                radiusY: "3.0%",
                type: "ellipse"
            }
        },
        breadths: {
            biacromial: {
                title: "Biacromial Breadth®",
                instructions: `
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Breadth Measurement</h4>
                        <div class="collapsible-content">
                            <p><strong>Definition:</strong> The straight-line distance between the most lateral points on the acromial processes.</p>
                            <p><strong>Subject position:</strong> Standing in the anatomical position.</p>
                            <p><strong>Measurement technique:</strong> Use a large sliding caliper with the subject's arms relaxed at their sides.</p>
                        </div>
                    </div>`,
                startX: "82.0%",
                startY: "25.0%",
                endX: "18.0%",
                endY: "25.0%",
                type: "line"
            },
            biiliocristal: {
                title: "Biiliocristal Breadth®",
                instructions: `
                    <div class="collapsible-section">
                        <h4 class="collapsible-header">Breadth Measurement</h4>
                        <div class="collapsible-content">
                            <p><strong>Definition:</strong> The straight-line distance between the most lateral points on the iliac crests.</p>
                            <p><strong>Subject position:</strong> Standing in the anatomical position.</p>
                            <p><strong>Measurement technique:</strong> Use a large sliding caliper, applying firm pressure to compress soft tissues.</p>
                        </div>
                    </div>`,
                startX: "77.0%",
                startY: "45.0%",
                endX: "23.0%",
                endY: "45.0%",
                type: "line"
            }
        }
    };

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

    function showInfoPanel(data) {
        detailsPanel.classList.add('visible');
        interactiveArea.classList.add('showing-info');

        infoTitle.textContent = data.title;
        infoContent.innerHTML = data.instructions;
        
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

    // Task selector event listener
    taskSelect.addEventListener('change', function() {
        currentTask = this.value;
        taskDescription.textContent = taskDescriptions[currentTask];
        loadTaskData(currentTask);
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

    // Initialize with skinfolds
    loadTaskData('skinfolds');
});