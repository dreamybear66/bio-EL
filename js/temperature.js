/**
 * Temperature Optimizer - Manual Navigation Implementation
 * Complete implementation with step-by-step manual navigation
 */

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api/v1';

// DOM Elements
const form = document.getElementById('temperatureForm');
const simulateBtn = document.getElementById('simulateBtn');
const resetBtn = document.getElementById('resetBtn');
const analysisContainer = document.getElementById('analysisContainer');
const analysisCaption = document.getElementById('analysisCaption');
const analysisNavigation = document.getElementById('analysisNavigation');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const navDots = document.getElementById('navDots');
const stepIndicator = document.getElementById('stepIndicator');

// Parameter Elements
const tempSlider = document.getElementById('temperature');
const durationSlider = document.getElementById('duration');
const moistureSlider = document.getElementById('moisture');
const batchSlider = document.getElementById('batchSize');

// Value Display Elements
const tempValue = document.getElementById('tempValue');
const durationValue = document.getElementById('durationValue');
const moistureValue = document.getElementById('moistureValue');
const batchValue = document.getElementById('batchValue');

// Treatment Type Selection
const treatmentOptions = document.querySelectorAll('.treatment-option');

// ==========================================
// REAL-TIME PARAMETER UPDATES
// ==========================================

tempSlider.addEventListener('input', (e) => {
    tempValue.textContent = `${e.target.value}°C`;
});

durationSlider.addEventListener('input', (e) => {
    durationValue.textContent = `${e.target.value}min`;
});

moistureSlider.addEventListener('input', (e) => {
    moistureValue.textContent = `${e.target.value}%`;
});

batchSlider.addEventListener('input', (e) => {
    batchValue.textContent = `${e.target.value}kg`;
});

// Treatment Type Selection
treatmentOptions.forEach(option => {
    option.addEventListener('click', () => {
        treatmentOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    });
});

// ==========================================
// MANUAL NAVIGATION CONTROLLER
// ==========================================

class ManualNavigationController {
    constructor() {
        this.steps = [];
        this.currentStep = 0;
    }

    setSteps(steps) {
        this.steps = steps;
        this.currentStep = 0;
        this.renderNavigation();
        this.showStep(0);
    }

    renderNavigation() {
        // Create navigation dots
        navDots.innerHTML = '';
        this.steps.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'nav-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToStep(index));
            navDots.appendChild(dot);
        });

        // Show navigation
        analysisNavigation.style.display = 'flex';
        this.updateButtons();
    }

    showStep(index) {
        if (index < 0 || index >= this.steps.length) return;

        this.currentStep = index;
        const step = this.steps[index];

        // Update content
        analysisContainer.innerHTML = step.content;

        // Update caption
        analysisCaption.textContent = step.caption;
        analysisCaption.classList.add('active');

        // Update step indicator
        stepIndicator.textContent = `Step ${index + 1} of ${this.steps.length}`;

        // Update dots
        document.querySelectorAll('.nav-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Update buttons
        this.updateButtons();

        // Execute step callback if exists
        if (step.callback) {
            setTimeout(() => step.callback(), 100);
        }
    }

    updateButtons() {
        prevBtn.disabled = this.currentStep === 0;
        nextBtn.disabled = this.currentStep === this.steps.length - 1;
    }

    next() {
        if (this.currentStep < this.steps.length - 1) {
            this.showStep(this.currentStep + 1);
        }
    }

    previous() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    goToStep(index) {
        this.showStep(index);
    }
}

const navigationController = new ManualNavigationController();

// Navigation button events
prevBtn.addEventListener('click', () => navigationController.previous());
nextBtn.addEventListener('click', () => navigationController.next());

// ==========================================
// FORM SUBMISSION & API CALL
// ==========================================

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    simulateBtn.disabled = true;
    simulateBtn.innerHTML = `
        <div class="loading-spinner"></div>
        Running...
    `;

    try {
        const formData = new FormData(form);
        const params = {
            feed_type: formData.get('feed_type'),
            current_temperature: parseFloat(formData.get('current_temperature')),
            storage_duration: parseFloat(formData.get('storage_duration')),
            ambient_humidity: parseFloat(formData.get('ambient_humidity')),
            equipment_status: formData.get('equipment_status'),
            batch_size: parseFloat(formData.get('batch_size'))
        };

        let result;
        try {
            // Call API
            const response = await fetch(`${API_BASE_URL}/optimize/temperature`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            result = await response.json();
        } catch (error) {
            console.warn('Backend not available, using mock data for demonstration');

            // Mock data for demonstration when backend is not running
            result = {
                simulation_data: {
                    time_points: [0, 5, 10, 15, 20, 25, 30],
                    effectiveness: [0, 25, 45, 58, 65, 68, 70],
                    microbial_reduction: [0, 30, 50, 62, 67, 69, 70]
                },
                optimization: {
                    optimal_temperature: params.current_temperature + 2,
                    temperature_adjustment: 2,
                    effectiveness: 93.6,
                    efficiency_score: 93.6,
                    energy_consumption: 63.7,
                    carbon_footprint: 52.3,
                    water_usage: 15.0,
                    cost_estimate: 414.4,
                    parameter_comparison: [
                        { parameter: 'Temperature', current: `${params.current_temperature}°C`, optimal: `${params.current_temperature + 2}°C`, difference: '+2°C', status: 'good' },
                        { parameter: 'Duration', current: `${params.storage_duration}min`, optimal: `${params.storage_duration}min`, difference: '0min', status: 'good' }
                    ],
                    recommendations: [
                        {
                            title: 'Optimize Temperature Settings',
                            impact: 'High',
                            description: 'Increase temperature by 2°C for better microbial reduction while maintaining energy efficiency.',
                            category: 'Temperature Control'
                        },
                        {
                            title: 'Monitor Equipment Performance',
                            impact: 'Medium',
                            description: 'Regular maintenance can improve efficiency by 5-10%.',
                            category: 'Equipment'
                        }
                    ]
                }
            };
        }

        // Build analysis steps for manual navigation
        const steps = await buildAnalysisSteps(params, result);
        navigationController.setSteps(steps);

    } catch (error) {
        console.error('Optimization error:', error);
        showError('An unexpected error occurred. Please try again.');
    } finally {
        simulateBtn.disabled = false;
        simulateBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Run Simulation
        `;
    }
});

// ==========================================
// BUILD ANALYSIS STEPS FOR MANUAL NAVIGATION
// ==========================================

async function buildAnalysisSteps(params, result) {
    const steps = [];

    // Step 1: Initialization
    steps.push({
        content: `
            <div class="analysis-step">
                <div class="step-icon">🔄</div>
                <h3>Initializing Analysis</h3>
                <p>Processing treatment parameters...</p>
                <div class="loading-bar">
                    <div class="loading-progress"></div>
                </div>
            </div>
        `,
        caption: '🔄 Initializing optimization engine...',
        callback: null
    });

    // Step 2: Temperature Analysis
    steps.push({
        content: `
            <div class="analysis-step">
                <div class="step-icon">🌡️</div>
                <h3>Analyzing Temperature Parameters</h3>
                <div class="metric-display">
                    <div class="metric">
                        <span class="metric-label">Current Temperature</span>
                        <span class="metric-value">${params.current_temperature}°C</span>
                    </div>
                    <div class="metric-arrow">→</div>
                    <div class="metric">
                        <span class="metric-label">Optimal Temperature</span>
                        <span class="metric-value optimal">${result.optimization.optimal_temperature}°C</span>
                    </div>
                </div>
                <div class="adjustment-badge">
                    Adjustment: ${result.optimization.temperature_adjustment > 0 ? '+' : ''}${result.optimization.temperature_adjustment}°C
                </div>
            </div>
        `,
        caption: '🌡️ Analyzing temperature parameters and calculating optimal settings...',
        callback: null
    });

    // Step 3: Treatment Effectiveness Graph
    steps.push({
        content: `
            <div class="analysis-step">
                <div class="step-icon">📊</div>
                <h3>Treatment Effectiveness Over Time</h3>
                <div class="effectiveness-chart">
                    <canvas id="effectivenessChart" width="600" height="300"></canvas>
                </div>
            </div>
        `,
        caption: '📊 Simulating treatment effectiveness and microbial reduction over time...',
        callback: async () => {
            await drawEffectivenessChart(result.simulation_data);
        }
    });

    // Step 4: Environmental Impact
    steps.push({
        content: `
            <div class="analysis-step">
                <div class="step-icon">🌱</div>
                <h3>Environmental Impact Analysis</h3>
                <div class="impact-grid">
                    <div class="impact-card">
                        <div class="impact-icon">⚡</div>
                        <div class="impact-value">${result.optimization.energy_consumption} kWh</div>
                        <div class="impact-label">Energy</div>
                    </div>
                    <div class="impact-card">
                        <div class="impact-icon">🌍</div>
                        <div class="impact-value">${result.optimization.carbon_footprint} kg CO₂</div>
                        <div class="impact-label">Carbon</div>
                    </div>
                    <div class="impact-card">
                        <div class="impact-icon">💧</div>
                        <div class="impact-value">${result.optimization.water_usage} L</div>
                        <div class="impact-label">Water</div>
                    </div>
                    <div class="impact-card">
                        <div class="impact-icon">💰</div>
                        <div class="impact-value">₹${result.optimization.cost_estimate}</div>
                        <div class="impact-label">Cost</div>
                    </div>
                </div>
            </div>
        `,
        caption: '🌱 Analyzing environmental impact and sustainability metrics...',
        callback: null
    });

    // Step 5: Recommendations
    steps.push({
        content: `
            <div class="analysis-step">
                <div class="step-icon">💡</div>
                <h3>AI-Powered Recommendations</h3>
                <div class="recommendations-list">
                    ${result.optimization.recommendations.map(rec => `
                        <div class="recommendation-item">
                            <div class="rec-badge ${rec.impact.toLowerCase()}">${rec.impact}</div>
                            <h4>${rec.title}</h4>
                            <p>${rec.description}</p>
                            <span class="rec-category">${rec.category}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `,
        caption: '💡 Generating AI-powered optimization recommendations...',
        callback: null
    });

    // Step 6: Summary
    steps.push({
        content: `
            <div class="analysis-complete">
                <div class="complete-icon">✅</div>
                <h3>Analysis Complete!</h3>
                <p>Optimization recommendations generated successfully</p>
                <div class="summary-stats">
                    <div class="stat">
                        <span class="stat-value">${result.optimization.effectiveness}%</span>
                        <span class="stat-label">Effectiveness</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${result.optimization.efficiency_score}%</span>
                        <span class="stat-label">Efficiency</span>
                    </div>
                </div>
            </div>
        `,
        caption: '✅ Optimization complete! Review all steps using the navigation controls.',
        callback: null
    });

    return steps;
}

// ==========================================
// GRAPH RENDERING
// ==========================================

async function drawEffectivenessChart(simulationData) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for canvas to render

    const canvas = document.getElementById('effectivenessChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const padding = 50;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const timePoints = simulationData.time_points;
    const effectiveness = simulationData.effectiveness;
    const microbialReduction = simulationData.microbial_reduction;

    const maxValue = 100;
    const pointCount = timePoints.length;

    // Draw background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#F3F4F6';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 6; i++) {
        const x = padding + (chartWidth / 6) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
    }

    // Draw Y-axis
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw X-axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw Y-axis labels
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Inter';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= 4; i++) {
        const value = maxValue - (maxValue / 4) * i;
        const y = padding + (chartHeight / 4) * i;
        ctx.fillText(Math.round(value), padding - 10, y);
    }

    // Draw Y-axis label
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 13px Inter';
    ctx.fillText('Percentage (%)', 0, 0);
    ctx.restore();

    // Draw X-axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Inter';

    const maxTime = timePoints[timePoints.length - 1];
    for (let i = 0; i <= 6; i++) {
        const time = Math.round((maxTime / 6) * i);
        const x = padding + (chartWidth / 6) * i;
        ctx.fillText(time, x, height - padding + 10);
    }

    // Draw X-axis label
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 13px Inter';
    ctx.fillText('Time (minutes)', width / 2, height - 15);

    // Draw area under microbial reduction curve
    ctx.fillStyle = 'rgba(237, 28, 36, 0.1)';
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);

    for (let i = 0; i < pointCount; i++) {
        const x = padding + (chartWidth / (pointCount - 1)) * i;
        const y = padding + chartHeight - (microbialReduction[i] / maxValue) * chartHeight;
        ctx.lineTo(x, y);
    }

    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw microbial reduction line
    ctx.strokeStyle = '#ED1C24';
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let i = 0; i < pointCount; i++) {
        const x = padding + (chartWidth / (pointCount - 1)) * i;
        const y = padding + chartHeight - (microbialReduction[i] / maxValue) * chartHeight;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();

    // Draw effectiveness line
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let i = 0; i < pointCount; i++) {
        const x = padding + (chartWidth / (pointCount - 1)) * i;
        const y = padding + chartHeight - (effectiveness[i] / maxValue) * chartHeight;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();

    // Draw legend
    const legendY = padding + 20;
    const legendX = padding + 20;

    // Treatment Effectiveness legend
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(legendX, legendY);
    ctx.lineTo(legendX + 20, legendY);
    ctx.stroke();

    ctx.fillStyle = '#10B981';
    ctx.font = '12px Inter';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Treatment Effectiveness', legendX + 30, legendY);

    // Microbial Reduction legend
    ctx.strokeStyle = '#ED1C24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(legendX + 200, legendY);
    ctx.lineTo(legendX + 220, legendY);
    ctx.stroke();

    ctx.fillStyle = '#ED1C24';
    ctx.fillText('Microbial Reduction', legendX + 230, legendY);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function showError(message) {
    analysisContainer.innerHTML = `
        <div class="error-message">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>Error</h3>
            <p>${message}</p>
        </div>
    `;
}

// Reset Button
resetBtn.addEventListener('click', () => {
    form.reset();
    tempValue.textContent = '56°C';
    durationValue.textContent = '70min';
    moistureValue.textContent = '11%';
    batchValue.textContent = '1600kg';

    analysisContainer.innerHTML = `
        <div class="analysis-placeholder">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E9ECEF" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <p>Click "Run Simulation" to start analysis</p>
        </div>
    `;

    analysisNavigation.style.display = 'none';
    analysisCaption.classList.remove('active');
});
