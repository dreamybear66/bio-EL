"""
Utility functions for calculations across all optimizers
"""

import numpy as np
from typing import List, Tuple, Dict

def calculate_effectiveness_curve(
    initial_value: float,
    target_value: float,
    duration: int,
    curve_type: str = 'logarithmic'
) -> Tuple[List[int], List[float]]:
    """
    Generate a curve showing progress over time
    
    Args:
        initial_value: Starting value
        target_value: Target value to reach
        duration: Time duration in minutes
        curve_type: Type of curve ('logarithmic', 'linear', 'exponential')
    
    Returns:
        Tuple of (time_points, values)
    """
    time_points = list(range(0, duration + 1, max(1, duration // 20)))
    
    if curve_type == 'logarithmic':
        # Logarithmic growth curve (fast initial growth, then plateaus)
        values = [
            initial_value + (target_value - initial_value) * (1 - np.exp(-3 * t / duration))
            for t in time_points
        ]
    elif curve_type == 'linear':
        values = [
            initial_value + (target_value - initial_value) * (t / duration)
            for t in time_points
        ]
    else:  # exponential
        values = [
            initial_value + (target_value - initial_value) * (np.exp(3 * t / duration) - 1) / (np.exp(3) - 1)
            for t in time_points
        ]
    
    return time_points, [round(v, 2) for v in values]

def calculate_environmental_impact(
    energy_kwh: float,
    water_liters: float,
    batch_size_kg: float
) -> Dict[str, float]:
    """
    Calculate environmental impact metrics
    
    Args:
        energy_kwh: Energy consumption in kWh
        water_liters: Water usage in liters
        batch_size_kg: Batch size in kg
    
    Returns:
        Dictionary with environmental metrics
    """
    # Carbon footprint calculation (kg CO2 per kWh)
    carbon_factor = 0.82  # India grid average
    carbon_footprint = round(energy_kwh * carbon_factor, 2)
    
    # Efficiency score (0-100)
    energy_efficiency = min(100, max(0, 100 - (energy_kwh / batch_size_kg) * 10))
    water_efficiency = min(100, max(0, 100 - (water_liters / batch_size_kg) * 2))
    
    overall_efficiency = round((energy_efficiency + water_efficiency) / 2, 1)
    
    return {
        'energy_consumption': round(energy_kwh, 1),
        'carbon_footprint': carbon_footprint,
        'water_usage': round(water_liters, 1),
        'efficiency_score': overall_efficiency
    }

def calculate_cost_estimate(
    energy_kwh: float,
    labor_hours: float,
    material_cost: float = 0,
    energy_rate: float = 8.5,
    labor_rate: float = 150
) -> float:
    """
    Calculate total cost estimate
    
    Args:
        energy_kwh: Energy consumption
        labor_hours: Labor hours
        material_cost: Additional material costs
        energy_rate: Cost per kWh (INR)
        labor_rate: Cost per hour (INR)
    
    Returns:
        Total cost in INR
    """
    energy_cost = energy_kwh * energy_rate
    labor_cost = labor_hours * labor_rate
    total = energy_cost + labor_cost + material_cost
    
    return round(total, 2)

def generate_recommendations(
    parameter_status: Dict[str, str],
    optimization_type: str
) -> List[Dict[str, str]]:
    """
    Generate AI-powered optimization recommendations
    
    Args:
        parameter_status: Dictionary of parameter statuses
        optimization_type: Type of optimization (temperature, waste, cost)
    
    Returns:
        List of recommendation dictionaries
    """
    recommendations = []
    
    if optimization_type == 'temperature':
        if parameter_status.get('temperature') == 'warning':
            recommendations.append({
                'title': 'Enable Real-Time Monitoring',
                'impact': 'Medium Impact',
                'description': 'Activate continuous parameter monitoring to detect deviations early. This prevents batch failures and ensures consistent quality across all production cycles.',
                'category': 'Safety'
            })
        
        if parameter_status.get('duration') == 'warning':
            recommendations.append({
                'title': 'Optimize Treatment Duration',
                'impact': 'High Impact',
                'description': 'Reduce treatment time by 20 minutes while maintaining effectiveness. This improves throughput and reduces energy consumption.',
                'category': 'Efficiency'
            })
        
        if parameter_status.get('moisture') == 'warning':
            recommendations.append({
                'title': 'Adjust Moisture Control',
                'impact': 'Medium Impact',
                'description': 'Implement automated moisture regulation to maintain optimal levels. Prevents microbial growth and extends shelf life.',
                'category': 'Quality'
            })
    
    elif optimization_type == 'waste':
        recommendations.append({
            'title': 'Implement Preventive Sorting',
            'impact': 'High Impact',
            'description': 'Early detection and separation of contaminated batches can reduce waste by 35%.',
            'category': 'Waste Reduction'
        })
        
        recommendations.append({
            'title': 'Optimize Storage Conditions',
            'impact': 'Medium Impact',
            'description': 'Maintain consistent temperature and humidity to extend feed shelf life.',
            'category': 'Storage'
        })
    
    elif optimization_type == 'cost':
        recommendations.append({
            'title': 'Energy Efficiency Upgrade',
            'impact': 'High Impact',
            'description': 'Invest in energy-efficient equipment to reduce consumption by 25%.',
            'category': 'Cost Reduction'
        })
        
        recommendations.append({
            'title': 'Process Automation',
            'impact': 'Medium Impact',
            'description': 'Automate repetitive tasks to reduce labor costs and improve consistency.',
            'category': 'Automation'
        })
    
    return recommendations

def validate_numeric_range(value: float, min_val: float, max_val: float, field_name: str) -> None:
    """
    Validate that a numeric value is within range
    
    Args:
        value: Value to validate
        min_val: Minimum allowed value
        max_val: Maximum allowed value
        field_name: Name of the field for error messages
    
    Raises:
        ValueError: If value is out of range
    """
    if not isinstance(value, (int, float)):
        raise ValueError(f"{field_name} must be a number")
    
    if value < min_val or value > max_val:
        raise ValueError(f"{field_name} must be between {min_val} and {max_val}")

def calculate_deviation_status(current: float, optimal: float, threshold: float = 10) -> str:
    """
    Determine status based on deviation from optimal
    
    Args:
        current: Current value
        optimal: Optimal value
        threshold: Threshold percentage for warning
    
    Returns:
        Status string: 'good', 'warning', or 'critical'
    """
    deviation_percent = abs((current - optimal) / optimal * 100) if optimal != 0 else 0
    
    if deviation_percent < threshold:
        return 'good'
    elif deviation_percent < threshold * 2:
        return 'warning'
    else:
        return 'critical'
