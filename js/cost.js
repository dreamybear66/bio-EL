/**
 * Cost Optimization JavaScript
 * Simplified implementation with API integration
 */

const API_BASE_URL = 'http://localhost:5000/api/v1';

const form = document.getElementById('costForm');
const simulateBtn = document.getElementById('simulateBtn');
const resetBtn = document.getElementById('resetBtn');
const analysisContainer = document.getElementById('analysisContainer');
const analysisCaption = document.getElementById('analysisCaption');
const resultsContent = document.getElementById('resultsContent');

// Real-time updates for input fields
const inputs = ['production', 'energy', 'labor', 'waste', 'treatment'];
inputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
        input.addEventListener('input', () => {
            document.getElementById(`${id}Display`).textContent = `₹${input.value}`;
        });
    }
});

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    simulateBtn.disabled = true;
    simulateBtn.textContent = 'Optimizing...';

    try {
        const formData = new FormData(form);
        const params = {
            production_cost: parseFloat(formData.get('production_cost')),
            energy_consumption: parseFloat(formData.get('energy_consumption')),
            labor_cost: parseFloat(formData.get('labor_cost')),
            waste_cost: parseFloat(formData.get('waste_cost')),
            treatment_cost: parseFloat(formData.get('treatment_cost'))
        };

        const response = await fetch(`${API_BASE_URL}/optimize/cost`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });

        if (!response.ok) throw new Error('API request failed');

        const result = await response.json();
        await runAnalysisAnimation(params, result);

    } catch (error) {
        console.error('Optimization error:', error);
        showError('Failed to connect to optimization server.');
    } finally {
        simulateBtn.disabled = false;
        simulateBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Optimize Costs';
    }
});

async function runAnalysisAnimation(params, result) {
    analysisContainer.innerHTML = '';
    resultsContent.innerHTML = '';

    showCaption('🔄 Analyzing cost structure...');
    analysisContainer.innerHTML = '<div class="analysis-step"><div class="step-icon">💰</div><h3>Calculating Cost Optimization...</h3><div class="loading-bar"><div class="loading-progress"></div></div></div>';
    await delay(1000);

    const opt = result.optimization;
    showCaption('💰 Identifying cost reduction opportunities...');
    analysisContainer.innerHTML = `
        <div class="analysis-step">
            <div class="step-icon">💰</div>
            <h3>Cost Analysis</h3>
            <div class="metric-display">
                <div class="metric">
                    <span class="metric-label">Current</span>
                    <span class="metric-value">₹${opt.total_current_cost}</span>
                </div>
                <div class="metric-arrow">→</div>
                <div class="metric">
                    <span class="metric-label">Optimized</span>
                    <span class="metric-value optimal">₹${opt.total_optimized_cost}</span>
                </div>
            </div>
            <div class="adjustment-badge">Savings: ₹${opt.total_savings} (${opt.roi_percentage}% ROI)</div>
        </div>
    `;
    await delay(1500);

    // Add Savings Visualization
    showCaption('📊 Visualizing cost savings by category...');
    analysisContainer.innerHTML = `
        <div class="analysis-step">
            <div class="step-icon">📊</div>
            <h3>Savings Breakdown</h3>
            <div class="savings-chart">
                <canvas id="savingsChart" width="400" height="250"></canvas>
            </div>
        </div>
    `;
    await drawSavingsChart(opt.breakdown_comparison);
    await delay(1500);

    showCaption('✅ Cost optimization complete!');
    analysisContainer.innerHTML = '<div class="analysis-complete"><div class="complete-icon">✅</div><h3>Optimization Complete!</h3></div>';
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
                                stroke-dasharray="${(opt.roi_percentage / 100) * 339} 339" transform="rotate(-90 60 60)"/>
                        </svg>
                        <div class="score-text">
                            <div class="score-value">${opt.roi_percentage}%</div>
                            <div class="score-label">ROI</div>
                        </div>
                    </div>
                    <div class="efficiency-badge">
                        <div class="efficiency-label">Total Savings</div>
                        <div class="efficiency-value">₹${opt.total_savings}</div>
                        <div class="efficiency-sublabel">Monthly: ₹${opt.monthly_savings} | Annual: ₹${opt.annual_savings}</div>
                    </div>
                </div>
            </div>

            <div class="result-metrics">
                <h3>Before/After Comparison</h3>
                <div class="comparison-chart-container">
                    <canvas id="comparisonChart" width="400" height="200"></canvas>
                </div>
            </div>

            <div class="result-metrics">
                <h3>Cost Breakdown</h3>
                <table class="comparison-table">
                    <thead><tr><th>Category</th><th>Current</th><th>Optimized</th><th>Savings</th></tr></thead>
                    <tbody>
                        ${opt.breakdown_comparison.map(item => `
                            <tr>
                                <td>${item.category}</td>
                                <td>₹${item.current}</td>
                                <td>₹${item.optimized}</td>
                                <td class="good">₹${item.savings} (${item.savings_percentage}%)</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="recommendations">
                <h3>Cost Reduction Strategies</h3>
                ${opt.recommendations.map(rec => `
                    <div class="recommendation-card">
                        <div class="rec-header">
                            <h4>${rec.title}</h4>
                            <span class="impact-badge">${rec.impact}</span>
                        </div>
                        <p>${rec.description}</p>
                        <div class="rec-footer">
                            <span class="rec-category">${rec.category}</span>
                            <span class="rec-reduction">Savings: ${rec.potential_savings}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Draw comparison chart after DOM is ready
    setTimeout(() => drawComparisonChart(opt), 100);
}

function showCaption(text) {
    analysisCaption.textContent = text;
    analysisCaption.classList.add('active');
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showError(message) {
    analysisContainer.innerHTML = `<div class="error-message"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg><h3>Connection Error</h3><p>${message}</p><button onclick="location.reload()" class="btn-retry">Retry</button></div>`;
}

resetBtn.addEventListener('click', () => {
    form.reset();
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) document.getElementById(`${id}Display`).textContent = `₹${input.value}`;
    });
    analysisContainer.innerHTML = '<div class="analysis-placeholder"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E9ECEF" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path></svg><p>Click "Optimize Costs" to start analysis</p></div>';
    resultsContent.innerHTML = '<div class="results-placeholder"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E9ECEF" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg><p>Results will appear here after optimization</p></div>';
    analysisCaption.classList.remove('active');
});

console.log('Cost Optimizer initialized');


// Savings Bar Chart Visualization
async function drawSavingsChart(breakdown) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const canvas = document.getElementById('savingsChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxSavings = Math.max(...breakdown.map(item => item.savings));
    const barWidth = chartWidth / breakdown.length - 10;

    breakdown.forEach((item, index) => {
        const barHeight = (item.savings / maxSavings) * chartHeight;
        const x = padding + index * (barWidth + 10);
        const y = padding + chartHeight - barHeight;

        // Draw bar
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, '#10B981');
        gradient.addColorStop(1, '#059669');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw value on top
        ctx.fillStyle = '#212529';
        ctx.font = 'bold 11px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('?' + item.savings, x + barWidth / 2, y - 5);

        // Draw label
        ctx.fillStyle = '#6C757D';
        ctx.font = '10px Inter';
        ctx.save();
        ctx.translate(x + barWidth / 2, height - 10);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(item.category, 0, 0);
        ctx.restore();
    });
}

// Before/After Comparison Chart
function drawComparisonChart(opt) {
    const canvas = document.getElementById('comparisonChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const categories = opt.breakdown_comparison.map(item => item.category);
    const currentCosts = opt.breakdown_comparison.map(item => item.current);
    const optimizedCosts = opt.breakdown_comparison.map(item => item.optimized);

    const maxCost = Math.max(...currentCosts);
    const barHeight = 25;
    const spacing = 15;

    categories.forEach((category, index) => {
        const y = padding + index * (barHeight * 2 + spacing);

        // Current cost bar (red)
        const currentWidth = (currentCosts[index] / maxCost) * chartWidth;
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(padding, y, currentWidth, barHeight);
        ctx.fillStyle = '#212529';
        ctx.font = '11px Inter';
        ctx.textAlign = 'left';
        ctx.fillText('?' + currentCosts[index], padding + currentWidth + 5, y + barHeight / 2 + 4);

        // Optimized cost bar (green)
        const optimizedWidth = (optimizedCosts[index] / maxCost) * chartWidth;
        ctx.fillStyle = '#10B981';
        ctx.fillRect(padding, y + barHeight + 3, optimizedWidth, barHeight);
        ctx.fillText('?' + optimizedCosts[index], padding + optimizedWidth + 5, y + barHeight + 3 + barHeight / 2 + 4);

        // Category label
        ctx.fillStyle = '#6C757D';
        ctx.textAlign = 'right';
        ctx.fillText(category, padding - 10, y + barHeight);
    });

    // Legend
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(padding, height - 25, 15, 10);
    ctx.fillStyle = '#212529';
    ctx.font = '11px Inter';
    ctx.textAlign = 'left';
    ctx.fillText('Current', padding + 20, height - 17);

    ctx.fillStyle = '#10B981';
    ctx.fillRect(padding + 100, height - 25, 15, 10);
    ctx.fillText('Optimized', padding + 120, height - 17);
}
