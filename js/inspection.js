// ==========================================
// QUALITY INSPECTION - MAIN SCRIPT
// ==========================================

/**
 * Global variables for camera and analysis
 */
let videoStream = null;
let currentImageData = null;

// DOM Elements
const cameraBtn = document.getElementById('cameraBtn');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const cameraPreview = document.getElementById('cameraPreview');
const videoElement = document.getElementById('videoElement');
const capturedImage = document.getElementById('capturedImage');
const uploadedImage = document.getElementById('uploadedImage');
const captureBtn = document.getElementById('captureBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultsContainer = document.getElementById('resultsContainer');
const resultImage = document.getElementById('resultImage');
const qualityPercentage = document.getElementById('qualityPercentage');
const progressBar = document.getElementById('progressBar');
const statusBadge = document.getElementById('statusBadge');
const recommendationText = document.getElementById('recommendationText');
const rescanBtn = document.getElementById('rescanBtn');

// ==========================================
// CAMERA FUNCTIONALITY
// ==========================================

/**
 * Initialize camera access
 */
async function startCamera() {
    try {
        // Request camera permission and access
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment', // Use back camera on mobile
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });

        // Set video source
        videoElement.srcObject = videoStream;

        // Show camera preview
        cameraPreview.classList.add('active');
        captureBtn.classList.add('active');

        // Hide captured/uploaded images
        capturedImage.classList.remove('active');
        uploadedImage.classList.remove('active');

        // Disable camera button while active
        cameraBtn.disabled = true;
        uploadBtn.disabled = false;

        console.log('Camera started successfully');
    } catch (error) {
        console.error('Camera access error:', error);
        alert('Unable to access camera. Please ensure you have granted camera permissions or try uploading an image instead.');
    }
}

/**
 * Stop camera stream
 */
function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
        videoElement.srcObject = null;
    }
    cameraBtn.disabled = false;
}

/**
 * Capture photo from video stream
 */
function capturePhoto() {
    // Create canvas to capture frame
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convert to image data
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    currentImageData = imageDataUrl;

    // Display captured image
    capturedImage.src = imageDataUrl;
    capturedImage.classList.add('active');

    // Hide video element
    videoElement.style.display = 'none';
    uploadedImage.classList.remove('active');

    // Stop camera
    stopCamera();

    // Hide capture button, show analyze button
    captureBtn.classList.remove('active');
    analyzeBtn.style.display = 'block';

    console.log('Photo captured successfully');
}

// ==========================================
// IMAGE UPLOAD FUNCTIONALITY
// ==========================================

/**
 * Handle image upload
 */
function handleImageUpload(event) {
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG or PNG)');
        return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        alert('File size too large. Please upload an image smaller than 10MB.');
        return;
    }

    // Read file
    const reader = new FileReader();

    reader.onload = function (e) {
        currentImageData = e.target.result;

        // Display uploaded image
        uploadedImage.src = currentImageData;
        uploadedImage.classList.add('active');

        // Show camera preview container
        cameraPreview.classList.add('active');

        // Hide video and captured image
        videoElement.style.display = 'none';
        capturedImage.classList.remove('active');

        // Stop camera if running
        stopCamera();

        // Show analyze button
        analyzeBtn.style.display = 'block';
        captureBtn.classList.remove('active');

        console.log('Image uploaded successfully');
    };

    reader.onerror = function () {
        alert('Error reading file. Please try again.');
    };

    reader.readAsDataURL(file);
}

// ==========================================
// QUALITY ANALYSIS SIMULATION
// ==========================================

/**
 * Simulate image quality analysis
 * In a real application, this would call an AI/ML backend
 */
async function analyzeImage() {
    if (!currentImageData) {
        alert('Please capture or upload an image first.');
        return;
    }

    // Show loading spinner
    loadingSpinner.classList.add('active');
    resultsContainer.classList.remove('active');

    // Simulate analysis delay
    setTimeout(async () => {
        // Analyze image quality
        const analysis = await generateQualityScore(currentImageData);
        const qualityScore = analysis.qualityScore;
        const isBad = analysis.isBad;

        // Determine safety status
        const isSafe = qualityScore >= 70;

        // Display results
        displayResults(qualityScore, isSafe, isBad);

        // Hide loading, show results
        loadingSpinner.classList.remove('active');
        resultsContainer.classList.add('active');
    }, 1500);
}

/**
 * Analyze image to detect feedstock quality
 * Returns object with isBad flag and quality score
 */
async function analyzeImageQuality(imageData) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Resize for analysis (smaller = faster)
            const maxSize = 200;
            const scale = Math.min(maxSize / img.width, maxSize / img.height);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;

            // Analyze color characteristics
            let totalBrightness = 0;
            let darkPixels = 0;
            let greenishPixels = 0;
            let grayishPixels = 0;
            let whiteishPixels = 0;
            let colorfulPixels = 0;

            const pixelCount = pixels.length / 4;

            for (let i = 0; i < pixels.length; i += 4) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];

                const brightness = (r + g + b) / 3;
                totalBrightness += brightness;

                // Count dark pixels (potential mold/contamination)
                if (brightness < 80) darkPixels++;

                // Count greenish pixels (mold indicator)
                if (g > r && g > b && g > 100) greenishPixels++;

                // Count grayish/white pixels (mold/fungus)
                const colorDiff = Math.max(r, g, b) - Math.min(r, g, b);
                if (colorDiff < 30 && brightness > 150) whiteishPixels++;
                if (colorDiff < 30 && brightness > 80 && brightness < 150) grayishPixels++;

                // Count colorful pixels (good feedstock usually has warm colors)
                if (colorDiff > 50) colorfulPixels++;
            }

            const avgBrightness = totalBrightness / pixelCount;
            const darkRatio = darkPixels / pixelCount;
            const greenRatio = greenishPixels / pixelCount;
            const whiteRatio = whiteishPixels / pixelCount;
            const grayRatio = grayishPixels / pixelCount;
            const colorfulRatio = colorfulPixels / pixelCount;

            // Detect bad feedstock characteristics
            const isBad = (
                avgBrightness < 100 ||  // Very dark overall
                darkRatio > 0.5 ||      // More than 50% dark pixels
                greenRatio > 0.15 ||    // Significant green (mold)
                whiteRatio > 0.25 ||    // Lots of white (fungus)
                grayRatio > 0.3 ||      // Lots of gray (mold)
                (darkRatio > 0.3 && colorfulRatio < 0.2) // Dark and not colorful
            );

            let qualityScore;
            if (isBad) {
                // Bad feedstock: 20-40%
                const baseScore = 20;
                const randomFactor = Math.random() * 20;
                qualityScore = Math.round(baseScore + randomFactor);
            } else {
                // Good feedstock: 80-100%
                const baseScore = 80;
                const randomFactor = Math.random() * 20;
                qualityScore = Math.round(baseScore + randomFactor);
            }

            resolve({ isBad, qualityScore, metrics: { avgBrightness, darkRatio, greenRatio, whiteRatio } });
        };

        img.src = imageData;
    });
}

/**
 * Generate quality score (wrapper for backward compatibility)
 */
async function generateQualityScore(imageData) {
    const analysis = await analyzeImageQuality(imageData);
    return analysis;
}

/**
 * Generate detailed analysis text based on quality score and contamination status
 */
function generateAnalysisText(qualityScore, isBad = false) {
    if (isBad) {
        // Bad feedstock analysis (20-40%)
        const badAnalyses = [
            {
                range: [35, 40],
                status: 'Poor Quality - Contamination Detected',
                details: 'Significant quality issues detected in feedstock sample. Visual analysis reveals extensive mold growth with white/gray fungal colonies visible throughout the material. Dark discoloration indicates advanced decomposition. Moisture content appears critically high (>25%), creating ideal conditions for mycotoxin production. Material shows severe structural degradation with visible fungal webbing. This feedstock poses serious health risks to livestock.',
                metrics: {
                    moldContamination: 78,
                    decomposition: 72,
                    moistureContent: 28,
                    mycotoxinRisk: 85,
                    structuralIntegrity: 22
                },
                warnings: [
                    'CRITICAL: Extensive mold contamination detected',
                    'High mycotoxin risk - potential aflatoxin presence',
                    'Excessive moisture content promotes bacterial growth',
                    'Material shows advanced decomposition',
                    'Unsuitable for animal consumption'
                ]
            },
            {
                range: [30, 34],
                status: 'Very Poor Quality - Severe Contamination',
                details: 'Critical contamination levels detected. Sample exhibits heavy mold infestation with multiple fungal species present (white, green, and gray colonies). Extreme moisture damage evident with visible fungal mycelia forming web-like structures. Dark brown/black discoloration suggests advanced rot and possible mycotoxin accumulation. Material integrity severely compromised. Immediate disposal required to prevent cross-contamination.',
                metrics: {
                    moldContamination: 85,
                    decomposition: 80,
                    moistureContent: 32,
                    mycotoxinRisk: 92,
                    structuralIntegrity: 15
                },
                warnings: [
                    'CRITICAL: Severe mold infestation - multiple species',
                    'DANGER: Very high mycotoxin risk',
                    'Critical moisture levels - active fungal growth',
                    'Advanced decomposition - material breakdown',
                    'REJECT: Immediate disposal required'
                ]
            },
            {
                range: [25, 29],
                status: 'Unsafe - Heavy Contamination',
                details: 'Extreme contamination detected with widespread fungal colonization. Heavy mold growth covers majority of sample surface with thick fungal mat formation. Pink/purple discoloration on corn indicates Fusarium mold (highly toxic). White cottony growth suggests Aspergillus presence. Material completely unsuitable for feed use. Poses severe health hazards including respiratory issues, digestive problems, and potential fatalities in livestock.',
                metrics: {
                    moldContamination: 92,
                    decomposition: 88,
                    moistureContent: 35,
                    mycotoxinRisk: 96,
                    structuralIntegrity: 8
                },
                warnings: [
                    'DANGER: Extreme mold contamination',
                    'Fusarium detected - highly toxic mycotoxins',
                    'Aspergillus present - aflatoxin producer',
                    'Material completely degraded',
                    'REJECT: Severe health hazard - do not use'
                ]
            },
            {
                range: [20, 24],
                status: 'Hazardous - Complete Rejection Required',
                details: 'Catastrophic contamination levels. Sample shows complete fungal takeover with dense mold colonies covering entire surface. Multiple toxic mold species identified including pink Fusarium, white Aspergillus, and green Penicillium. Material has undergone complete decomposition with total structural failure. Mycotoxin levels presumed extremely dangerous. This material represents a biohazard and must be handled with protective equipment during disposal.',
                metrics: {
                    moldContamination: 98,
                    decomposition: 95,
                    moistureContent: 40,
                    mycotoxinRisk: 99,
                    structuralIntegrity: 2
                },
                warnings: [
                    'BIOHAZARD: Complete mold colonization',
                    'Multiple toxic species - extreme danger',
                    'Presumed lethal mycotoxin levels',
                    'Total material failure',
                    'REJECT: Biohazard - protective equipment required for disposal'
                ]
            }
        ];

        const analysis = badAnalyses.find(a => qualityScore >= a.range[0] && qualityScore <= a.range[1]) || badAnalyses[badAnalyses.length - 1];
        return analysis;
    }

    // Good feedstock analysis (80-100%)
    const analyses = [
        {
            range: [95, 100],
            status: 'Excellent Quality',
            details: 'Outstanding feedstock quality detected. Pellets show exceptional uniformity with consistent golden-tan coloration indicating optimal processing. Particle size distribution is highly uniform (±2mm variance). No visible contaminants or foreign materials detected. Moisture content appears optimal at 10-12% based on visual texture analysis. Surface integrity excellent with minimal breakage or dust.',
            metrics: {
                uniformity: 98,
                colorConsistency: 97,
                sizeDistribution: 96,
                contamination: 0,
                moistureContent: 11
            }
        },
        {
            range: [90, 94],
            status: 'Excellent Quality',
            details: 'Premium feedstock quality confirmed. Pellets demonstrate excellent uniformity with consistent color throughout the sample. Particle sizes are well-distributed with minimal variation. No contamination detected. Moisture content within ideal range (10-13%). Minor surface variations present but well within acceptable parameters.',
            metrics: {
                uniformity: 94,
                colorConsistency: 93,
                sizeDistribution: 92,
                contamination: 0,
                moistureContent: 12
            }
        },
        {
            range: [85, 89],
            status: 'Very Good Quality',
            details: 'High-quality feedstock verified. Pellets show very good uniformity with consistent golden-brown coloration. Particle size distribution is well-controlled. No significant contaminants observed. Moisture content appears appropriate (11-14%). Some minor color variations noted but within quality standards.',
            metrics: {
                uniformity: 89,
                colorConsistency: 88,
                sizeDistribution: 87,
                contamination: 0,
                moistureContent: 13
            }
        },
        {
            range: [80, 84],
            status: 'Good Quality',
            details: 'Good quality feedstock confirmed. Pellets display acceptable uniformity with generally consistent coloration. Particle sizes are reasonably uniform with some natural variation. No harmful contaminants detected. Moisture content within acceptable range (12-15%). Minor inconsistencies present but meet quality standards.',
            metrics: {
                uniformity: 84,
                colorConsistency: 83,
                sizeDistribution: 82,
                contamination: 0,
                moistureContent: 14
            }
        }
    ];

    // Find matching analysis based on score
    const analysis = analyses.find(a => qualityScore >= a.range[0] && qualityScore <= a.range[1]) || analyses[analyses.length - 1];

    return analysis;
}

/**
 * Display analysis results with detailed metrics
 */
function displayResults(qualityScore, isSafe, isBad = false) {
    // Get detailed analysis
    const analysis = generateAnalysisText(qualityScore, isBad);

    // Set result image
    resultImage.src = currentImageData;

    // Update quality percentage
    qualityPercentage.textContent = qualityScore + '%';

    // Animate circular progress bar
    const circumference = 2 * Math.PI * 90; // radius = 90
    const offset = circumference - (qualityScore / 100) * circumference;
    progressBar.style.strokeDashoffset = offset;

    // Update progress bar color based on quality
    if (isBad) {
        progressBar.style.stroke = '#ef4444'; // Red for bad feedstock
    } else {
        progressBar.style.stroke = '#10b981'; // Green for good feedstock
    }

    // Update status badge
    if (isBad) {
        statusBadge.textContent = `✗ ${analysis.status}`;
        statusBadge.className = 'status-badge status-unsafe';
    } else {
        statusBadge.textContent = `✓ ${analysis.status}`;
        statusBadge.className = 'status-badge status-safe';
    }

    // Update recommendation with detailed analysis
    if (isBad) {
        // Bad feedstock display
        const warningsHtml = analysis.warnings.map(w => `<div style="color: #dc2626; margin: 0.5rem 0; padding: 0.5rem; background: #fee2e2; border-left: 3px solid #dc2626; border-radius: 4px;">⚠️ ${w}</div>`).join('');

        recommendationText.innerHTML = `
            <strong style="color: #dc2626;">⚠️ CONTAMINATION DETECTED</strong><br><br>
            ${analysis.details}<br><br>
            <strong>Contamination Metrics:</strong><br>
            • Mold Contamination: ${analysis.metrics.moldContamination}%<br>
            • Decomposition Level: ${analysis.metrics.decomposition}%<br>
            • Moisture Content: ~${analysis.metrics.moistureContent}%<br>
            • Mycotoxin Risk: ${analysis.metrics.mycotoxinRisk}%<br>
            • Structural Integrity: ${analysis.metrics.structuralIntegrity}%<br><br>
            <strong>Critical Warnings:</strong><br>
            ${warningsHtml}<br>
            <strong style="color: #dc2626; font-size: 1.1rem;">❌ REJECTED - DO NOT USE FOR FEED</strong>
        `;
    } else {
        // Good feedstock display
        recommendationText.innerHTML = `
            <strong>Quality Analysis:</strong><br><br>
            ${analysis.details}<br><br>
            <strong>Key Metrics:</strong><br>
            • Pellet Uniformity: ${analysis.metrics.uniformity}%<br>
            • Color Consistency: ${analysis.metrics.colorConsistency}%<br>
            • Size Distribution: ${analysis.metrics.sizeDistribution}%<br>
            • Contamination Level: ${analysis.metrics.contamination}%<br>
            • Moisture Content: ~${analysis.metrics.moistureContent}%<br><br>
            <strong style="color: #10b981;">✓ APPROVED FOR PROCESSING</strong>
        `;
    }

    console.log(`Analysis complete: ${qualityScore}% - ${analysis.status}`);
}

// ==========================================
// RESET FUNCTIONALITY
// ==========================================

/**
 * Reset the inspection interface
 */
function resetInspection() {
    // Stop camera if running
    stopCamera();

    // Hide all previews
    cameraPreview.classList.remove('active');
    capturedImage.classList.remove('active');
    uploadedImage.classList.remove('active');
    videoElement.style.display = 'block';

    // Hide buttons
    captureBtn.classList.remove('active');
    analyzeBtn.style.display = 'none';

    // Reset results
    resultsContainer.classList.remove('active');
    loadingSpinner.classList.remove('active');

    // Clear current image data
    currentImageData = null;

    // Reset file input
    fileInput.value = '';

    // Enable buttons
    cameraBtn.disabled = false;
    uploadBtn.disabled = false;

    // Reset progress bar
    progressBar.style.strokeDashoffset = '565.48';
    qualityPercentage.textContent = '0%';
    statusBadge.textContent = 'Pending';
    statusBadge.className = 'status-badge';
    recommendationText.textContent = 'Upload or capture an image to begin analysis.';

    console.log('Inspection reset');
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Camera button click
cameraBtn.addEventListener('click', startCamera);

// Upload button click
uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

// File input change
fileInput.addEventListener('change', handleImageUpload);

// Capture button click
captureBtn.addEventListener('click', capturePhoto);

// Analyze button click
analyzeBtn.addEventListener('click', analyzeImage);

// Re-scan button click
rescanBtn.addEventListener('click', resetInspection);

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initialize the page
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Quality Inspection page initialized');

    // Check if camera is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('Camera API not available');
        cameraBtn.disabled = true;
        cameraBtn.textContent = 'Camera Not Available';
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopCamera();
});
