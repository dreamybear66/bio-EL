/**
 * Centralized API Client for Treatment Optimizer
 * Handles all API communication with error handling and loading states
 */

const API_CONFIG = {
    baseURL: 'http://localhost:5000/api/v1',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
};

class APIClient {
    constructor(config = API_CONFIG) {
        this.baseURL = config.baseURL;
        this.timeout = config.timeout;
        this.headers = config.headers;
        this.loadingCallbacks = [];
    }

    /**
     * Register a loading state callback
     * @param {Function} callback - Function to call when loading state changes
     */
    onLoadingChange(callback) {
        this.loadingCallbacks.push(callback);
    }

    /**
     * Notify all loading callbacks
     * @param {boolean} isLoading - Current loading state
     */
    notifyLoading(isLoading) {
        this.loadingCallbacks.forEach(cb => cb(isLoading));
    }

    /**
     * Make a fetch request with timeout
     * @param {string} url - Request URL
     * @param {object} options - Fetch options
     * @returns {Promise} - Response promise
     */
    async fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - server took too long to respond');
            }
            throw error;
        }
    }

    /**
     * Format error response
     * @param {Error} error - Error object
     * @returns {object} - Formatted error
     */
    formatError(error) {
        if (error.message.includes('timeout')) {
            return {
                status: 'error',
                message: 'Request timeout. Please try again.',
                code: 'TIMEOUT'
            };
        }
        if (error.message.includes('Failed to fetch')) {
            return {
                status: 'error',
                message: 'Cannot connect to server. Make sure the backend is running on localhost:5000',
                code: 'CONNECTION_ERROR'
            };
        }
        return {
            status: 'error',
            message: error.message || 'An unexpected error occurred',
            code: 'UNKNOWN_ERROR'
        };
    }

    /**
     * Make a POST request
     * @param {string} endpoint - API endpoint
     * @param {object} data - Request data
     * @returns {Promise} - Response data
     */
    async post(endpoint, data) {
        this.notifyLoading(true);

        try {
            const url = `${this.baseURL}${endpoint}`;
            const response = await this.fetchWithTimeout(url, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            this.notifyLoading(false);
            return result;

        } catch (error) {
            this.notifyLoading(false);
            throw this.formatError(error);
        }
    }

    /**
     * Make a GET request
     * @param {string} endpoint - API endpoint
     * @returns {Promise} - Response data
     */
    async get(endpoint) {
        this.notifyLoading(true);

        try {
            const url = `${this.baseURL}${endpoint}`;
            const response = await this.fetchWithTimeout(url, {
                method: 'GET',
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            this.notifyLoading(false);
            return result;

        } catch (error) {
            this.notifyLoading(false);
            throw this.formatError(error);
        }
    }

    // Specific optimizer methods

    /**
     * Optimize temperature parameters
     * @param {object} params - Temperature parameters
     * @returns {Promise} - Optimization results
     */
    async optimizeTemperature(params) {
        return this.post('/optimize/temperature', params);
    }

    /**
     * Optimize waste parameters
     * @param {object} params - Waste parameters
     * @returns {Promise} - Optimization results
     */
    async optimizeWaste(params) {
        return this.post('/optimize/waste', params);
    }

    /**
     * Optimize cost parameters
     * @param {object} params - Cost parameters
     * @returns {Promise} - Optimization results
     */
    async optimizeCost(params) {
        return this.post('/optimize/cost', params);
    }

    /**
     * Check server health
     * @returns {Promise} - Health status
     */
    async checkHealth() {
        try {
            const response = await fetch(`${this.baseURL.replace('/api/v1', '')}/health`);
            return await response.json();
        } catch (error) {
            throw this.formatError(error);
        }
    }
}

// Create singleton instance
const apiClient = new APIClient();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APIClient, apiClient };
}
