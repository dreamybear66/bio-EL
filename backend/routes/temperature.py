"""
Temperature Optimization API Routes
"""

from flask import Blueprint, request, jsonify
from services.temperature_optimizer import TemperatureOptimizer
from utils.validators import validate_temperature_params

bp = Blueprint('temperature', __name__)
optimizer = TemperatureOptimizer()

@bp.route('/temperature', methods=['POST', 'OPTIONS'])
def optimize_temperature():
    """
    Temperature optimization endpoint
    
    POST /api/v1/optimize/temperature
    """
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({'status': 'error', 'message': 'No data provided'}), 400
        
        # Validate parameters
        validated_data = validate_temperature_params(data)
        
        # Run optimization
        result = optimizer.optimize(validated_data)
        
        return jsonify(result), 200
        
    except ValueError as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400
    except Exception as e:
        return jsonify({'status': 'error', 'message': 'Internal server error'}), 500
