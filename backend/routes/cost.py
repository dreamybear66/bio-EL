"""
Cost Optimization API Routes
"""

from flask import Blueprint, request, jsonify
from services.cost_optimizer import CostOptimizer
from utils.validators import validate_cost_params

bp = Blueprint('cost', __name__)
optimizer = CostOptimizer()

@bp.route('/cost', methods=['POST', 'OPTIONS'])
def optimize_cost():
    """
    Cost optimization endpoint
    
    POST /api/v1/optimize/cost
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
        validated_data = validate_cost_params(data)
        
        # Run optimization
        result = optimizer.optimize(validated_data)
        
        return jsonify(result), 200
        
    except ValueError as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400
    except Exception as e:
        return jsonify({'status': 'error', 'message': 'Internal server error'}), 500
