// ==========================================
// AMULFEEDGUARD RISK ASSESSMENT CALCULATOR
// ==========================================

/**
 * Risk Assessment System
 * Calculates contamination risk based on multiple parameters
 */

// DOM Elements
const form = document.getElementById('riskAssessmentForm');
const resetBtn = document.getElementById('resetBtn');
const resultsDisplay = document.getElementById('resultsDisplay');
const riskScoreValue = document.getElementById('riskScoreValue');
const riskLevelBadge = document.getElementById('riskLevelBadge');
const riskRecommendation = document.getElementById('riskRecommendation');
const resultsBatchId = document.querySelector('.results-batch-id');

// Historical data for chart (simulated)
let historicalData = [
    { date: '13 Jan', score: 25, level: 'low' },
    { date: '14 Jan', score: 45, level: 'medium' },
    { date: '15 Jan', score: 28, level: 'low' },
    { date: '16 Jan', score: 52, level: 'medium' },
    { date: '17 Jan', score: 68, level: 'high' },
    { date: '18 Jan', score: 72, level: 'high' },
    { date: '19 Jan', score: 55, level: 'medium' }
];

// ==========================================
// RISK CALCULATION LOGIC
// ==========================================

/**
 * Calculate risk score based on weighted parameters
 * @param {Object} params - Assessment parameters
 * @returns {number} Risk score (0-100)
 */
function calculateRiskScore(params) {
    let score = 0;

    // 1. Moisture Level (Weight: 20%)
    // Higher moisture = higher risk
    const moistureLevel = parseFloat(params.moistureLevel);
    if (moistureLevel > 25) {
        score += 20;
    } else if (moistureLevel > 20) {
        score += 15;
    } else if (moistureLevel > 15) {
        score += 10;
    } else {
        score += 5;
    }

    // 2. Temperature (Weight: 15%)
    // Optimal growth temp for microbes: 20-37°C
    const temperature = parseFloat(params.temperature);
    if (temperature >= 20 && temperature <= 37) {
        score += 15;
    } else if (temperature > 37 || temperature < 10) {
        score += 8;
    } else {
        score += 5;
    }

    // 3. Storage Time (Weight: 15%)
    // Longer storage = higher risk
    const storageTime = parseInt(params.storageTime);
    if (storageTime > 30) {
        score += 15;
    } else if (storageTime > 14) {
        score += 12;
    } else if (storageTime > 7) {
        score += 8;
    } else {
        score += 3;
    }

    // 4. Previous Contamination (Weight: 25%)
    // Major risk factor
    const contamination = params.previousContamination;
    if (contamination === 'high') {
        score += 25;
    } else if (contamination === 'medium') {
        score += 18;
    } else if (contamination === 'low') {
        score += 10;
    } else {
        score += 0;
    }

    // 5. Ambient Humidity (Weight: 10%)
    // Higher humidity = higher risk
    const humidity = parseFloat(params.ambientHumidity);
    if (humidity > 75) {
        score += 10;
    } else if (humidity > 60) {
        score += 7;
    } else if (humidity > 45) {
        score += 4;
    } else {
        score += 2;
    }

    // 6. Ventilation Status (Weight: 10%)
    // Poor ventilation = higher risk
    const ventilation = params.ventilationStatus;
    if (ventilation === 'poor') {
        score += 10;
    } else if (ventilation === 'moderate') {
        score += 5;
    } else {
        score += 2;
    }

    // 7. Feed Type (Weight: 5%)
    // Some feed types are more prone to contamination
    const feedType = params.feedType;
    if (feedType === 'silage') {
        score += 5;
    } else if (feedType === 'mixed') {
        score += 4;
    } else if (feedType === 'concentrate') {
        score += 3;
    } else {
        score += 2;
    }

    // Ensure score is within 0-100 range
    return Math.min(Math.max(Math.round(score), 0), 100);
}

/**
 * Classify risk level based on score
 * @param {number} score - Risk score
 * @returns {Object} Risk level info
 */
function classifyRiskLevel(score) {
    if (score <= 29) {
        return {
            level: 'low',
            label: '✓ Low Risk',
            recommendation: 'Batch meets all safety standards. Proceed with standard processing.',
            class: 'low'
        };
    } else if (score <= 59) {
        return {
            level: 'medium',
            label: '⚠ Medium Risk',
            recommendation: 'Enhanced monitoring required. Consider preventive treatment.',
            class: 'medium'
        };
    } else if (score <= 79) {
        return {
            level: 'high',
            label: '⚠ High Risk',
            recommendation: 'Immediate treatment mandatory. Isolate batch for processing.',
            class: 'high'
        };
    } else {
        return {
            level: 'critical',
            label: '✕ Critical Risk',
            recommendation: 'Reject batch. Implement emergency containment protocols.',
            class: 'critical'
        };
    }
}

// ==========================================
// FORM HANDLING
// ==========================================

/**
 * Handle form submission
 */
form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Collect form data
    const formData = {
        batchId: document.getElementById('batchId').value,
        moistureLevel: document.getElementById('moistureLevel').value,
        temperature: document.getElementById('temperature').value,
        storageTime: document.getElementById('storageTime').value,
        feedType: document.getElementById('feedType').value,
        sourceLocation: document.getElementById('sourceLocation').value,
        previousContamination: document.getElementById('previousContamination').value,
        ambientHumidity: document.getElementById('ambientHumidity').value,
        ventilationStatus: document.getElementById('ventilationStatus').value
    };

    // Calculate risk score
    const score = calculateRiskScore(formData);
    const riskInfo = classifyRiskLevel(score);

    // Display results
    displayResults(formData.batchId, score, riskInfo);

    // Update historical data
    updateHistoricalData(score, riskInfo.level);

    // Scroll to results
    resultsDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

/**
 * Display assessment results
 */
function displayResults(batchId, score, riskInfo) {
    // Show results container
    resultsDisplay.style.display = 'block';

    // Update batch ID
    resultsBatchId.textContent = `Batch: ${batchId}`;

    // Animate score
    animateScore(score);

    // Update risk level badge
    riskLevelBadge.className = `risk-level-badge ${riskInfo.class}`;
    riskLevelBadge.querySelector('.badge-text').textContent = riskInfo.label;

    // Update recommendation
    riskRecommendation.textContent = riskInfo.recommendation;
}

/**
 * Animate score counter
 */
function animateScore(targetScore) {
    let currentScore = 0;
    const increment = targetScore / 30; // 30 frames
    const duration = 1000; // 1 second
    const frameTime = duration / 30;

    const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(timer);
        }
        riskScoreValue.textContent = Math.round(currentScore);
    }, frameTime);
}

/**
 * Reset form
 */
resetBtn.addEventListener('click', function () {
    form.reset();
    resultsDisplay.style.display = 'none';
});

// ==========================================
// HISTORICAL TRENDS CHART
// ==========================================

/**
 * Update historical data with new assessment
 */
function updateHistoricalData(score, level) {
    const today = new Date();
    const dateStr = today.getDate() + ' ' + today.toLocaleString('default', { month: 'short' });

    // Remove oldest entry and add new one
    historicalData.shift();
    historicalData.push({
        date: dateStr,
        score: score,
        level: level
    });

    // Redraw chart
    drawChart();
}

/**
 * Draw bar chart using Canvas
 */
function drawChart() {
    const canvas = document.getElementById('riskTrendsChart');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Chart settings
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / historicalData.length;
    const maxScore = 100;

    // Colors for risk levels
    const colors = {
        low: '#10B981',
        medium: '#F59E0B',
        high: '#F59E0B',
        critical: '#EF4444'
    };

    // Draw bars
    historicalData.forEach((data, index) => {
        const barHeight = (data.score / maxScore) * chartHeight;
        const x = padding + index * barWidth + barWidth * 0.2;
        const y = padding + chartHeight - barHeight;
        const width = barWidth * 0.6;

        // Draw bar
        ctx.fillStyle = colors[data.level];
        ctx.fillRect(x, y, width, barHeight);

        // Draw date label
        ctx.fillStyle = '#6C757D';
        ctx.font = '11px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(data.date, x + width / 2, height - 10);
    });

    // Draw Y-axis labels
    ctx.fillStyle = '#6C757D';
    ctx.font = '11px Inter';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        const value = (maxScore / 4) * i;
        const y = padding + chartHeight - (chartHeight / 4) * i;
        ctx.fillText(Math.round(value), padding - 10, y + 4);
    }

    // Draw grid lines
    ctx.strokeStyle = '#E9ECEF';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
}

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initialize the page
 */
document.addEventListener('DOMContentLoaded', function () {
    // Draw initial chart
    drawChart();

    // Redraw chart on window resize
    window.addEventListener('resize', drawChart);

    console.log('AmulFeedGuard Risk Assessment initialized');
});
