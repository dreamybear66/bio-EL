"""
Waste Reduction Optimization Service
Calculates waste reduction strategies and salvageable quantities
"""

from typing import Dict, Any, List
from utils.calculations import generate_recommendations

class WasteOptimizer:
    """Waste reduction and salvage optimization"""
    
    def __init__(self):
        self.storage_factors = {
            'ambient': 1.5,
            'refrigerated': 0.8,
            'frozen': 0.5,
            'controlled': 0.6
        }
        
        self.handling_factors = {
            'hourly': 0.7,
            'daily': 1.0,
            'weekly': 1.3,
            'monthly': 1.8
        }
        
        self.contamination_factors = {
            'none': 0,
            'low': 10,
            'medium': 25,
            'high': 45
        }
    
    def optimize(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main waste optimization function
        
        Args:
            params: Dictionary containing waste parameters
        
        Returns:
            Optimization results with waste reduction strategies
        """
        initial_qty = params['initial_quantity']
        spoilage_pct = params['spoilage_percentage']
        storage = params['storage_method'].lower()
        handling = params['handling_frequency'].lower()
        contamination = params['contamination_history'].lower()
        
        # Calculate current waste
        current_waste = initial_qty * (spoilage_pct / 100)
        
        # Calculate optimized waste
        optimized_waste = self._calculate_optimized_waste(
            initial_qty, spoilage_pct, storage, handling, contamination
        )
        
        # Calculate salvageable quantity
        salvageable = initial_qty - optimized_waste
        
        # Calculate waste reduction percentage
        waste_reduction_pct = ((current_waste - optimized_waste) / current_waste * 100) if current_waste > 0 else 0
        
        # Calculate cost savings (assuming ₹50 per kg waste cost)
        waste_cost_per_kg = 50
        cost_savings = (current_waste - optimized_waste) * waste_cost_per_kg
        
        # Generate waste breakdown
        waste_breakdown = self._generate_waste_breakdown(
            current_waste, optimized_waste
        )
        
        # Generate recommendations
        recommendations = self._generate_waste_recommendations(
            storage, handling, contamination
        )
        
        # Generate simulation data for waste reduction over time
        simulation_data = self._generate_waste_simulation(
            current_waste, optimized_waste
        )
        
        return {
            'status': 'success',
            'optimization': {
                'initial_quantity': initial_qty,
                'current_waste': round(current_waste, 2),
                'optimized_waste': round(optimized_waste, 2),
                'salvageable_quantity': round(salvageable, 2),
                'waste_reduction_percentage': round(waste_reduction_pct, 2),
                'cost_savings': round(cost_savings, 2),
                'waste_breakdown': waste_breakdown,
                'recommendations': recommendations
            },
            'simulation_data': simulation_data
        }
    
    def _calculate_optimized_waste(
        self,
        initial_qty: float,
        spoilage_pct: float,
        storage: str,
        handling: str,
        contamination: str
    ) -> float:
        """Calculate optimized waste amount"""
        base_waste = initial_qty * (spoilage_pct / 100)
        
        # Apply optimization factors
        storage_factor = self.storage_factors.get(storage, 1.0)
        handling_factor = self.handling_factors.get(handling, 1.0)
        contamination_penalty = self.contamination_factors.get(contamination, 0)
        
        # Optimized waste calculation
        optimized = base_waste * storage_factor * handling_factor
        optimized += (initial_qty * contamination_penalty / 100)
        
        # Apply optimization reduction (best practices can reduce by 30-40%)
        optimization_efficiency = 0.65  # 35% reduction
        optimized *= optimization_efficiency
        
        return min(optimized, initial_qty)
    
    def _generate_waste_breakdown(
        self,
        current_waste: float,
        optimized_waste: float
    ) -> Dict[str, float]:
        """Generate waste breakdown categories"""
        # Categorize waste into preventable and unavoidable
        preventable = current_waste - optimized_waste
        unavoidable = optimized_waste
        
        return {
            'total_current_waste': round(current_waste, 2),
            'preventable_waste': round(max(0, preventable), 2),
            'unavoidable_waste': round(unavoidable, 2),
            'prevention_rate': round((preventable / current_waste * 100) if current_waste > 0 else 0, 2)
        }
    
    def _generate_waste_recommendations(
        self,
        storage: str,
        handling: str,
        contamination: str
    ) -> List[Dict[str, str]]:
        """Generate waste reduction recommendations"""
        recommendations = []
        
        if storage in ['ambient', 'controlled']:
            recommendations.append({
                'title': 'Upgrade Storage Conditions',
                'impact': 'High Impact',
                'description': 'Implement refrigerated storage to reduce spoilage by 40%. This extends shelf life and maintains feed quality.',
                'category': 'Storage',
                'potential_reduction': '40%'
            })
        
        if handling in ['weekly', 'monthly']:
            recommendations.append({
                'title': 'Increase Handling Frequency',
                'impact': 'Medium Impact',
                'description': 'Daily inspection and rotation prevents accumulation of spoiled material and enables early intervention.',
                'category': 'Process',
                'potential_reduction': '25%'
            })
        
        if contamination in ['medium', 'high']:
            recommendations.append({
                'title': 'Implement Preventive Sorting',
                'impact': 'Critical Impact',
                'description': 'Early detection and separation of contaminated batches can reduce waste by 35% and prevent cross-contamination.',
                'category': 'Quality Control',
                'potential_reduction': '35%'
            })
        
        recommendations.append({
            'title': 'Automated Monitoring System',
            'impact': 'High Impact',
            'description': 'Install IoT sensors for real-time temperature, humidity, and quality monitoring to detect issues before they cause waste.',
            'category': 'Technology',
            'potential_reduction': '30%'
        })
        
        recommendations.append({
            'title': 'Staff Training Program',
            'impact': 'Medium Impact',
            'description': 'Train personnel on proper handling techniques and early spoilage detection to minimize human error.',
            'category': 'Training',
            'potential_reduction': '15%'
        })
        
        return recommendations
    
    def _generate_waste_simulation(
        self,
        current_waste: float,
        optimized_waste: float
    ) -> Dict[str, List]:
        """Generate waste reduction simulation over 30 days"""
        days = list(range(0, 31, 3))
        
        # Simulate gradual waste reduction
        waste_values = []
        for day in days:
            progress = day / 30
            current_value = current_waste - (current_waste - optimized_waste) * progress
            waste_values.append(round(current_value, 2))
        
        return {
            'days': days,
            'waste_amount': waste_values,
            'target_waste': optimized_waste
        }
