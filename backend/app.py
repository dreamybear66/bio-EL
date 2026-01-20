"""
AmulFeedGuard Treatment Optimizer Backend
Flask Application Entry Point
"""

from flask import Flask, jsonify
from flask_cors import CORS
from config import config
import sys
import os

# Add backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def create_app(config_name='development'):
    """
    Application factory pattern
    
    Args:
        config_name: Configuration to use (development/production)
    
    Returns:
        Flask application instance
    """
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Enable CORS for all routes
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })
    
    # Import and register blueprints
    from routes import temperature, waste, cost
    
    api_prefix = app.config['API_PREFIX']
    app.register_blueprint(temperature.bp, url_prefix=f'{api_prefix}/optimize')
    app.register_blueprint(waste.bp, url_prefix=f'{api_prefix}/optimize')
    app.register_blueprint(cost.bp, url_prefix=f'{api_prefix}/optimize')
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'AmulFeedGuard Treatment Optimizer',
            'version': '1.0.0'
        })
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'service': 'AmulFeedGuard Treatment Optimizer API',
            'version': '1.0.0',
            'endpoints': {
                'temperature': f'{api_prefix}/optimize/temperature',
                'waste': f'{api_prefix}/optimize/waste',
                'cost': f'{api_prefix}/optimize/cost'
            },
            'documentation': 'See implementation_plan.md for API documentation'
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'status': 'error', 'message': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'status': 'error', 'message': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    # Create and run the application
    app = create_app('development')
    
    print("=" * 60)
    print("🚀 AmulFeedGuard Treatment Optimizer Backend")
    print("=" * 60)
    print(f"📡 Server running on: http://localhost:5000")
    print(f"📋 API Base URL: http://localhost:5000/api/v1")
    print(f"🔧 Endpoints:")
    print(f"   - POST /api/v1/optimize/temperature")
    print(f"   - POST /api/v1/optimize/waste")
    print(f"   - POST /api/v1/optimize/cost")
    print(f"💚 Health Check: http://localhost:5000/health")
    print("=" * 60)
    print("Press CTRL+C to stop the server")
    print("=" * 60)
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
