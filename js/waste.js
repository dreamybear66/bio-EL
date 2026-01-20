/**
 * Waste Reduction Optimizer
 * API integration and analysis animations
 */

const API_BASE_URL = 'http://localhost:5000/api/v1';

// DOM Elements
const form = document.getElementById('wasteForm');
const simulateBtn = document.getElementById('simulateBtn');
const resetBtn = document.getElementById('resetBtn');
const analysisContainer = document.getElementById('analysisContainer');
const analysisCaption = document.getElementById('analysisCaption');
const resultsContent = document.getElementById('resultsContent');

// Parameter Elements
const quantitySlider = document.getElementById('quantity');
const spoilageSlider = document.getElementById('spoilage');

// Value Display Elements
const quantityValue = document.getElementById('quantityValue');
const spoilageValue = document.getElementById('spoilageValue');

// Summary Elements
const summaryQuantity = document.getElementById('summaryQuantity');
const summarySpoilage = document.getElementById('summarySpoilage');
const summaryStorage = document.getElementById('summaryStorage');
const summaryHandling = document.getElementById('summaryHandling');

// Real-time parameter updates
quantitySlider.addEventListener('input', (e) => {
    quantityValue.textContent = `${e.target.value}kg`;
    summaryQuantity.textContent = `${e.target.value} kg`;
});

spoilageSlider.addEventListener('input', (e) => {
    spoilageValue.textContent = `${e.target.value}%`;
    summarySpoilage.textContent = `${e.target.value}%`;
});

document.getElementById('storageMethod').addEventListener('change', (e) => {
    const storageNames = {
        'ambient': 'Ambient',
        'refrigerated': 'Refrigerated',
        'frozen': 'Frozen',
        'controlled': 'Controlled'
    };
    summaryStorage.textContent = storageNames[e.target.value];
});

document.getElementById('handlingFrequency').addEventListener('change', (e) => {
    const handlingNames = {
        'hourly': 'Hourly',
        'daily': 'Daily',
        'weekly': 'Weekly',
        'monthly': 'Monthly'
    };
    summaryHandling.textContent = handlingNames[e.target.value];
});

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    simulateBtn.disabled = true;
    simulateBtn.textContent = 'Optimizing...';

    try {
        const formData = new FormData(form);
        const params = {
            initial_quantity: parseFloat(formData.get('initial_quantity')),
            spoilage_percentage: parseFloat(formData.get('spoilage_percentage')),
            storage_method: formData.get('storage_method'),
            handling_frequency: formData.get('handling_frequency'),
            contamination_history: formData.get('contamination_history')
        };

        const response = await fetch(`${API_BASE_URL}/optimize/waste`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });

        if (!response.ok) throw new Error('API request failed');

        const result = await response.json();
        await runAnalysisAnimation(params, result);

    } catch (error) {
        console.error('Optimization error:', error);
        showError('Failed to connect to optimization server. Make sure the backend is running on localhost:5000');
    } finally {
        simulateBtn.disabled = false;
        simulateBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Optimize Waste
        `;
    }
});

// Analysis animation
async function runAnalysisAnimation(params, result) {
    analysisContainer.innerHTML = '';
    resultsContent.innerHTML = '';

    // Step 1: Initialize
    showCaption('🔄 Analyzing waste patterns and storage conditions...');
    analysisContainer.innerHTML = `
        <div class="analysis-step">
            <div class="step-icon">📊</div>
            <h3>Calculating Waste Metrics...</h3>
            <div class="loading-bar"><div class="loading-progress"></div></div>
        </div>
    `;
    await delay(1000);

    // Step 2: Waste breakdown
    showCaption('🗑️ Identifying preventable vs unavoidable waste...');
    const opt = result.optimization;
    analysisContainer.innerHTML = `
        <div class="analysis-step">
            <div class="step-icon">🗑️</div>
            <h3>Waste Breakdown Analysis</h3>
            <div class="metric-display">
                <div class="metric">
                    <span class="metric-label">Current Waste</span>
                    <span class="metric-value">${opt.current_waste} kg</span>
                </div>
                <div class="metric-arrow">→</div>
                <div class="metric">
                    <span class="metric-label">Optimized</span>
                    <span class="metric-value optimal">${opt.optimized_waste} kg</span>
                </div>
            </div>
            <div class="adjustment-badge">
                Reduction: ${opt.waste_reduction_percentage}%
            </div>
        </div>
    `;
    await delay(1500);

    // Step 3: Cost savings
    showCaption('💰 Calculating cost savings and ROI...');
    analysisContainer.innerHTML = `
        <div class="analysis-step">
            <div class="step-icon">💰</div>
            <h3>Cost Savings Analysis</h3>
            <div class="impact-grid">
                <div class="impact-card">
                    <div class="impact-icon">📦</div>
                    <div class="impact-value">${opt.salvageable_quantity} kg</div>
                    <div class="impact-label">Salvageable</div>
                </div>
                <div class="impact-card">
                    <div class="impact-icon">💰</div>
                    <div class="impact-value">₹${opt.cost_savings}</div>
                    <div class="impact-label">Savings</div>
                </div>
                <div class="impact-card">
                    <div class="impact-icon">📉</div>
                    <div class="impact-value">${opt.waste_breakdown.preventable_waste} kg</div>
                    <div class="impact-label">Preventable</div>
                </div>
                <div class="impact-card">
                    <div class="impact-icon">⚠️</div>
                    <div class="impact-value">${opt.waste_breakdown.unavoidable_waste} kg</div>
                    <div class="impact-label">Unavoidable</div>
                </div>
            </div>
        </div>
    `;
    await delay(1200);

    // Step 4: Complete
    showCaption('✅ Waste optimization complete! Review recommendations.');
    analysisContainer.innerHTML = `
        <div class="analysis-complete">
            <div class="complete-icon">✅</div>
            <h3>Optimization Complete!</h3>
            <p>Waste reduction strategies generated successfully</p>
        </div>
    `;
    displayResults(result);
}

function displayResults(result) {
    const opt = result.optimization;

    resultsContent.innerHTML = `
        <div class="results-summary">
            <div class="result-header">
                <div class="result-score">
                    <div class="score-circle">
                        <svg width="120" height="120">
                            <circle cx="60" cy="60" r="54" fill="none" stroke="#E9ECEF" stroke-width="8"/>
                            <circle cx="60" cy="60" r="54" fill="none" stroke="#10B981" stroke-width="8"
                                stroke-dasharray="${(opt.waste_reduction_percentage / 100) * 339} 339"
                                stroke-dashoffset="0" transform="rotate(-90 60 60)"/>
                        </svg>
                        <div class="score-text">
                            <div class="score-value">${opt.waste_reduction_percentage}%</div>
                            <div class="score-label">Reduction</div>
                        </div>
                    </div>
                    <div class="efficiency-badge">
                        <div class="efficiency-label">Cost Savings</div>
                        <div class="efficiency-value">₹${opt.cost_savings}</div>
                    </div>
                </div>
            </div>

            <div class="result-metrics">
                <h3>Waste Metrics</h3>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-icon">📦</div>
                        <div class="metric-info">
                            <div class="metric-value">${opt.salvageable_quantity} kg</div>
                            <div class="metric-label">Salvageable Quantity</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">🗑️</div>
                        <div class="metric-info">
                            <div class="metric-value">${opt.optimized_waste} kg</div>
                            <div class="metric-label">Optimized Waste</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">📉</div>
                        <div class="metric-info">
                            <div class="metric-value">${opt.waste_breakdown.preventable_waste} kg</div>
                            <div class="metric-label">Preventable Waste</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">💰</div>
                        <div class="metric-info">
                            <div class="metric-value">₹${opt.cost_savings}</div>
                            <div class="metric-label">Cost Savings</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="recommendations">
                <h3>Waste Reduction Recommendations</h3>
                ${opt.recommendations.map(rec => `
                    <div class="recommendation-card">
                        <div class="rec-header">
                            <h4>${rec.title}</h4>
                            <span class="impact-badge">${rec.impact}</span>
                        </div>
                        <p>${rec.description}</p>
                        <div class="rec-footer">
                            <span class="rec-category">${rec.category}</span>
                            <span class="rec-reduction">Potential: ${rec.potential_reduction}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function showCaption(text) {
    analysisCaption.textContent = text;
    analysisCaption.classList.add('active');
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showError(message) {
    analysisContainer.innerHTML = `
        <div class="error-message">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <h3>Connection Error</h3>
            <p>${message}</p>
            <button onclick="location.reload()" class="btn-retry">Retry</button>
        </div>
    `;
}

// Reset functionality
resetBtn.addEventListener('click', () => {
    form.reset();
    quantityValue.textContent = '5000kg';
    spoilageValue.textContent = '12%';
    summaryQuantity.textContent = '5000 kg';
    summarySpoilage.textContent = '12%';
    summaryStorage.textContent = 'Refrigerated';
    summaryHandling.textContent = 'Daily';

    analysisContainer.innerHTML = `
        <div class="analysis-placeholder">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E9ECEF" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
            </svg>
            <p>Click "Optimize Waste" to start analysis</p>
        </div>
    `;

    resultsContent.innerHTML = `
        <div class="results-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E9ECEF" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <p>Results will appear here after optimization</p>
        </div>
    `;

    analysisCaption.classList.remove('active');
});

console.log('Waste Optimizer initialized');
console.log('API Base URL:', API_BASE_URL);
