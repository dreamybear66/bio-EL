"""
Waste Reduction Optimization API Routes
"""

from flask import Blueprint, request, jsonify
from services.waste_optimizer import WasteOptimizer
from utils.validators import validate_waste_params

bp = Blueprint('waste', __name__)
optimizer = WasteOptimizer()

@bp.route('/waste', methods=['POST', 'OPTIONS'])
def optimize_waste():
    """
    Waste reduction optimization endpoint
    
    POST /api/v1/optimize/waste
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
        validated_data = validate_waste_params(data)
        
        # Run optimization
        result = optimizer.optimize(validated_data)
        
        return jsonify(result), 200
        
    except ValueError as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400
    except Exception as e:
        return jsonify({'status': 'error', 'message': 'Internal server error'}), 500
