"""
Input validation utilities
"""

from typing import Dict, Any, List

def validate_temperature_params(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate temperature optimizer parameters
    
    Args:
        data: Request data dictionary
    
    Returns:
        Validated and sanitized data
    
    Raises:
        ValueError: If validation fails
    """
    required_fields = [
        'current_temperature',
        'ideal_range',
        'storage_duration',
        'feed_type',
        'ambient_humidity',
        'equipment_status',
        'batch_size'
    ]
    
    # Check required fields
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
    
    # Validate numeric ranges
    if not (0 <= data['current_temperature'] <= 200):
        raise ValueError("Current temperature must be between 0 and 200°C")
    
    if not isinstance(data['ideal_range'], list) or len(data['ideal_range']) != 2:
        raise ValueError("Ideal range must be a list of two values")
    
    if not (10 <= data['storage_duration'] <= 180):
        raise ValueError("Storage duration must be between 10 and 180 minutes")
    
    if not (0 <= data['ambient_humidity'] <= 100):
        raise ValueError("Ambient humidity must be between 0 and 100%")
    
    if not (100 <= data['batch_size'] <= 5000):
        raise ValueError("Batch size must be between 100 and 5000 kg")
    
    # Validate feed type
    valid_feed_types = ['heat', 'fermentation', 'steam', 'hybrid']
    if data['feed_type'].lower() not in valid_feed_types:
        raise ValueError(f"Feed type must be one of: {', '.join(valid_feed_types)}")
    
    # Validate equipment status
    valid_statuses = ['poor', 'moderate', 'good']
    if data['equipment_status'].lower() not in valid_statuses:
        raise ValueError(f"Equipment status must be one of: {', '.join(valid_statuses)}")
    
    return data

def validate_waste_params(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate waste reduction parameters
    
    Args:
        data: Request data dictionary
    
    Returns:
        Validated data
    
    Raises:
        ValueError: If validation fails
    """
    required_fields = [
        'initial_quantity',
        'spoilage_percentage',
        'storage_method',
        'handling_frequency',
        'contamination_history'
    ]
    
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
    
    if not (100 <= data['initial_quantity'] <= 10000):
        raise ValueError("Initial quantity must be between 100 and 10000 kg")
    
    if not (0 <= data['spoilage_percentage'] <= 100):
        raise ValueError("Spoilage percentage must be between 0 and 100%")
    
    valid_storage = ['ambient', 'refrigerated', 'frozen', 'controlled']
    if data['storage_method'].lower() not in valid_storage:
        raise ValueError(f"Storage method must be one of: {', '.join(valid_storage)}")
    
    valid_frequency = ['hourly', 'daily', 'weekly', 'monthly']
    if data['handling_frequency'].lower() not in valid_frequency:
        raise ValueError(f"Handling frequency must be one of: {', '.join(valid_frequency)}")
    
    valid_contamination = ['none', 'low', 'medium', 'high']
    if data['contamination_history'].lower() not in valid_contamination:
        raise ValueError(f"Contamination history must be one of: {', '.join(valid_contamination)}")
    
    return data

def validate_cost_params(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate cost optimization parameters
    
    Args:
        data: Request data dictionary
    
    Returns:
        Validated data
    
    Raises:
        ValueError: If validation fails
    """
    required_fields = [
        'production_cost',
        'energy_consumption',
        'labor_cost',
        'waste_cost',
        'treatment_cost'
    ]
    
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
    
    # All costs must be non-negative
    for field in required_fields:
        if data[field] < 0:
            raise ValueError(f"{field} cannot be negative")
    
    # Reasonable upper bounds
    if data['production_cost'] > 1000000:
        raise ValueError("Production cost seems unreasonably high")
    
    if data['energy_consumption'] > 10000:
        raise ValueError("Energy consumption seems unreasonably high")
    
    return data
