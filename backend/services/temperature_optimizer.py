"""
Temperature Optimization Service
Calculates optimal temperature and treatment parameters
"""

import numpy as np
from typing import Dict, Any, List, Tuple
from utils.calculations import (
    calculate_effectiveness_curve,
    calculate_environmental_impact,
    calculate_cost_estimate,
    generate_recommendations,
    calculate_deviation_status
)

class TemperatureOptimizer:
    """Temperature and process control optimization"""
    
    def __init__(self):
        self.feed_type_factors = {
            'heat': {'temp_multiplier': 1.2, 'duration_factor': 0.8},
            'fermentation': {'temp_multiplier': 0.8, 'duration_factor': 1.2},
            'steam': {'temp_multiplier': 1.0, 'duration_factor': 1.0},
            'hybrid': {'temp_multiplier': 0.9, 'duration_factor': 0.95}
        }
    
    def optimize(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main optimization function
        
        Args:
            params: Dictionary containing all input parameters
        
        Returns:
            Complete optimization results
        """
        # Extract parameters
        current_temp = params['current_temperature']
        ideal_range = params['ideal_range']
        duration = params['storage_duration']
        feed_type = params['feed_type'].lower()
        humidity = params['ambient_humidity']
        equipment = params['equipment_status'].lower()
        batch_size = params['batch_size']
        
        # Calculate optimal temperature
        optimal_temp = self._calculate_optimal_temperature(
            current_temp, ideal_range, feed_type
        )
        
        # Calculate effectiveness
        effectiveness = self._calculate_effectiveness(
            optimal_temp, duration, humidity, equipment
        )
        
        # Calculate microbial reduction
        microbial_reduction = self._calculate_microbial_reduction(
            optimal_temp, duration, humidity
        )
        
        # Generate simulation curves
        time_points, effectiveness_curve = calculate_effectiveness_curve(
            0, effectiveness, duration, 'logarithmic'
        )
        _, microbial_curve = calculate_effectiveness_curve(
            0, microbial_reduction, duration, 'logarithmic'
        )
        
        # Calculate environmental impact
        energy_kwh = self._calculate_energy_consumption(
            optimal_temp, duration, batch_size
        )
        water_liters = self._calculate_water_usage(batch_size, feed_type)
        
        env_impact = calculate_environmental_impact(
            energy_kwh, water_liters, batch_size
        )
        
        # Calculate cost
        labor_hours = duration / 60
        cost = calculate_cost_estimate(energy_kwh, labor_hours)
        
        # Generate parameter comparison
        param_comparison = self._generate_parameter_comparison(
            current_temp, optimal_temp, duration, humidity, batch_size
        )
        
        # Generate recommendations
        parameter_status = {
            'temperature': calculate_deviation_status(current_temp, optimal_temp, 10),
            'duration': 'good' if duration <= 90 else 'warning',
            'moisture': 'good' if humidity < 70 else 'warning'
        }
        recommendations = generate_recommendations(parameter_status, 'temperature')
        
        # Build response
        return {
            'status': 'success',
            'optimization': {
                'optimal_temperature': round(optimal_temp, 1),
                'temperature_adjustment': round(optimal_temp - current_temp, 1),
                'effectiveness': round(effectiveness, 2),
                'microbial_reduction': round(microbial_reduction, 2),
                'energy_consumption': env_impact['energy_consumption'],
                'carbon_footprint': env_impact['carbon_footprint'],
                'water_usage': env_impact['water_usage'],
                'cost_estimate': cost,
                'efficiency_score': env_impact['efficiency_score'],
                'recommendations': recommendations,
                'parameter_comparison': param_comparison
            },
            'simulation_data': {
                'time_points': time_points,
                'effectiveness': effectiveness_curve,
                'microbial_reduction': microbial_curve
            }
        }
    
    def _calculate_optimal_temperature(
        self, 
        current: float, 
        ideal_range: List[float], 
        feed_type: str
    ) -> float:
        """Calculate optimal temperature based on feed type"""
        target = (ideal_range[0] + ideal_range[1]) / 2
        factors = self.feed_type_factors.get(feed_type, {'temp_multiplier': 1.0})
        
        # Adjust based on feed type sensitivity
        adjustment = (target - current) * factors['temp_multiplier']
        optimal = current + adjustment * 0.7  # Conservative adjustment
        
        # Ensure within ideal range
        optimal = max(ideal_range[0], min(ideal_range[1], optimal))
        
        return optimal
    
    def _calculate_effectiveness(
        self,
        temp: float,
        duration: int,
        humidity: float,
        equipment: str
    ) -> float:
        """Calculate treatment effectiveness percentage"""
        base_effectiveness = 50
        
        # Temperature factor (optimal around 35-40°C for fermentation)
        temp_factor = min(temp / 100, 1.0) * 30
        
        # Duration factor
        duration_factor = min(duration / 120, 1.0) * 15
        
        # Humidity penalty
        humidity_penalty = (humidity / 100) * 5
        
        # Equipment factor
        equipment_bonus = {'poor': 0, 'moderate': 3, 'good': 7}.get(equipment, 0)
        
        effectiveness = (
            base_effectiveness + 
            temp_factor + 
            duration_factor - 
            humidity_penalty + 
            equipment_bonus
        )
        
        return min(max(effectiveness, 0), 100)
    
    def _calculate_microbial_reduction(
        self,
        temp: float,
        duration: int,
        humidity: float
    ) -> float:
        """Calculate microbial reduction percentage"""
        # Higher temperature and longer duration = better reduction
        temp_effect = min(temp / 80, 1.0) * 40
        duration_effect = min(duration / 100, 1.0) * 35
        humidity_effect = (1 - humidity / 100) * 25
        
        reduction = temp_effect + duration_effect + humidity_effect
        return min(max(reduction, 0), 100)
    
    def _calculate_energy_consumption(
        self,
        temp: float,
        duration: int,
        batch_size: float
    ) -> float:
        """Calculate energy consumption in kWh"""
        # Energy = f(temperature, duration, batch size)
        base_energy = 10  # kWh
        temp_energy = (temp / 100) * 30
        duration_energy = (duration / 60) * 15
        size_energy = (batch_size / 1000) * 10
        
        total_energy = base_energy + temp_energy + duration_energy + size_energy
        return total_energy
    
    def _calculate_water_usage(self, batch_size: float, feed_type: str) -> float:
        """Calculate water usage in liters"""
        base_water = 20
        size_water = (batch_size / 100) * 15
        
        # Different feed types require different water amounts
        type_multiplier = {
            'heat': 0.8,
            'fermentation': 1.2,
            'steam': 1.5,
            'hybrid': 1.0
        }.get(feed_type, 1.0)
        
        return (base_water + size_water) * type_multiplier
    
    def _generate_parameter_comparison(
        self,
        current_temp: float,
        optimal_temp: float,
        duration: int,
        humidity: float,
        batch_size: float
    ) -> List[Dict[str, Any]]:
        """Generate parameter comparison table"""
        comparison = []
        
        # Temperature
        temp_diff = optimal_temp - current_temp
        comparison.append({
            'parameter': 'Temperature',
            'current': f"{current_temp}°C",
            'optimal': f"{optimal_temp}°C",
            'difference': f"{'+' if temp_diff > 0 else ''}{temp_diff:.0f}°C",
            'status': calculate_deviation_status(current_temp, optimal_temp, 10)
        })
        
        # Duration
        optimal_duration = max(70, min(100, duration))
        duration_diff = optimal_duration - duration
        comparison.append({
            'parameter': 'Duration',
            'current': f"{duration} min",
            'optimal': f"{optimal_duration} min",
            'difference': f"{'+' if duration_diff > 0 else ''}{duration_diff} min",
            'status': 'good' if abs(duration_diff) < 10 else 'warning'
        })
        
        # Moisture
        optimal_moisture = 15
        moisture_diff = optimal_moisture - (humidity / 100 * 25)  # Convert humidity to moisture
        comparison.append({
            'parameter': 'Moisture Content',
            'current': f"{int(humidity / 100 * 25)}%",
            'optimal': f"{optimal_moisture}%",
            'difference': f"{moisture_diff:.1f}%",
            'status': 'good' if humidity < 60 else 'warning'
        })
        
        # Batch Size
        optimal_batch = min(3000, max(1000, batch_size))
        comparison.append({
            'parameter': 'Batch Size',
            'current': f"{batch_size} kg",
            'optimal': f"{optimal_batch}-{optimal_batch+1000} kg",
            'difference': 'Within range' if 1000 <= batch_size <= 3000 else 'Adjust',
            'status': 'good' if 1000 <= batch_size <= 3000 else 'warning'
        })
        
        return comparison
