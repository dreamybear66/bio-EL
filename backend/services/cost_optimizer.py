"""
Cost Optimization Service
Calculates cost reduction strategies and ROI
"""

from typing import Dict, Any, List
from utils.calculations import generate_recommendations

class CostOptimizer:
    """Cost-effective production optimization"""
    
    def __init__(self):
        # Optimization efficiency factors
        self.optimization_rates = {
            'production': 0.10,  # 10% reduction possible
            'energy': 0.25,      # 25% reduction possible
            'labor': 0.13,       # 13% reduction possible
            'waste': 0.38,       # 38% reduction possible
            'treatment': 0.25    # 25% reduction possible
        }
    
    def optimize(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main cost optimization function
        
        Args:
            params: Dictionary containing cost parameters
        
        Returns:
            Optimization results with cost breakdown and savings
        """
        production_cost = params['production_cost']
        energy_consumption = params['energy_consumption']
        labor_cost = params['labor_cost']
        waste_cost = params['waste_cost']
        treatment_cost = params['treatment_cost']
        
        # Calculate current total cost
        total_current = (
            production_cost + 
            energy_consumption + 
            labor_cost + 
            waste_cost + 
            treatment_cost
        )
        
        # Calculate optimized costs
        optimized_costs = self._calculate_optimized_costs(params)
        total_optimized = sum(optimized_costs.values())
        
        # Calculate savings and ROI
        total_savings = total_current - total_optimized
        roi_percentage = (total_savings / total_current * 100) if total_current > 0 else 0
        
        # Generate cost breakdown comparison
        breakdown_comparison = self._generate_cost_breakdown(
            params, optimized_costs
        )
        
        # Generate recommendations
        recommendations = self._generate_cost_recommendations(params)
        
        # Generate simulation data
        simulation_data = self._generate_cost_simulation(
            total_current, total_optimized
        )
        
        return {
            'status': 'success',
            'optimization': {
                'total_current_cost': round(total_current, 2),
                'total_optimized_cost': round(total_optimized, 2),
                'total_savings': round(total_savings, 2),
                'roi_percentage': round(roi_percentage, 2),
                'monthly_savings': round(total_savings, 2),
                'annual_savings': round(total_savings * 12, 2),
                'breakdown': optimized_costs,
                'breakdown_comparison': breakdown_comparison,
                'recommendations': recommendations
            },
            'simulation_data': simulation_data
        }
    
    def _calculate_optimized_costs(
        self,
        params: Dict[str, Any]
    ) -> Dict[str, float]:
        """Calculate optimized costs for each category"""
        optimized = {}
        
        # Production cost optimization
        optimized['production'] = round(
            params['production_cost'] * (1 - self.optimization_rates['production']),
            2
        )
        
        # Energy cost optimization
        optimized['energy'] = round(
            params['energy_consumption'] * (1 - self.optimization_rates['energy']),
            2
        )
        
        # Labor cost optimization
        optimized['labor'] = round(
            params['labor_cost'] * (1 - self.optimization_rates['labor']),
            2
        )
        
        # Waste cost optimization
        optimized['waste'] = round(
            params['waste_cost'] * (1 - self.optimization_rates['waste']),
            2
        )
        
        # Treatment cost optimization
        optimized['treatment'] = round(
            params['treatment_cost'] * (1 - self.optimization_rates['treatment']),
            2
        )
        
        return optimized
    
    def _generate_cost_breakdown(
        self,
        current_params: Dict[str, Any],
        optimized_costs: Dict[str, float]
    ) -> List[Dict[str, Any]]:
        """Generate detailed cost breakdown comparison"""
        breakdown = []
        
        categories = [
            ('Production Cost', 'production_cost', 'production'),
            ('Energy Consumption', 'energy_consumption', 'energy'),
            ('Labor Cost', 'labor_cost', 'labor'),
            ('Waste Cost', 'waste_cost', 'waste'),
            ('Treatment Cost', 'treatment_cost', 'treatment')
        ]
        
        for label, current_key, optimized_key in categories:
            current_value = current_params[current_key]
            optimized_value = optimized_costs[optimized_key]
            savings = current_value - optimized_value
            savings_pct = (savings / current_value * 100) if current_value > 0 else 0
            
            breakdown.append({
                'category': label,
                'current': round(current_value, 2),
                'optimized': round(optimized_value, 2),
                'savings': round(savings, 2),
                'savings_percentage': round(savings_pct, 2),
                'status': 'good' if savings_pct > 15 else 'moderate'
            })
        
        return breakdown
    
    def _generate_cost_recommendations(
        self,
        params: Dict[str, Any]
    ) -> List[Dict[str, str]]:
        """Generate cost reduction recommendations"""
        recommendations = []
        
        # Energy optimization
        if params['energy_consumption'] > 1000:
            recommendations.append({
                'title': 'Energy Efficiency Upgrade',
                'impact': 'High Impact',
                'description': 'Invest in energy-efficient equipment to reduce consumption by 25%. Estimated payback period: 18 months.',
                'category': 'Energy',
                'potential_savings': '₹' + str(round(params['energy_consumption'] * 0.25, 2)),
                'implementation_cost': '₹50,000'
            })
        
        # Labor optimization
        if params['labor_cost'] > 12000:
            recommendations.append({
                'title': 'Process Automation',
                'impact': 'Medium Impact',
                'description': 'Automate repetitive tasks to reduce labor costs by 13% while improving consistency and quality.',
                'category': 'Automation',
                'potential_savings': '₹' + str(round(params['labor_cost'] * 0.13, 2)),
                'implementation_cost': '₹75,000'
            })
        
        # Waste optimization
        if params['waste_cost'] > 5000:
            recommendations.append({
                'title': 'Waste Prevention Program',
                'impact': 'Critical Impact',
                'description': 'Implement comprehensive waste reduction strategies to cut waste costs by 38%.',
                'category': 'Waste Management',
                'potential_savings': '₹' + str(round(params['waste_cost'] * 0.38, 2)),
                'implementation_cost': '₹30,000'
            })
        
        # Treatment optimization
        recommendations.append({
            'title': 'Optimize Treatment Parameters',
            'impact': 'High Impact',
            'description': 'Fine-tune treatment processes to reduce costs by 25% without compromising quality.',
            'category': 'Process Optimization',
            'potential_savings': '₹' + str(round(params['treatment_cost'] * 0.25, 2)),
            'implementation_cost': '₹15,000'
        })
        
        # Bulk purchasing
        recommendations.append({
            'title': 'Bulk Procurement Strategy',
            'impact': 'Medium Impact',
            'description': 'Negotiate bulk purchasing agreements to reduce production costs by 10%.',
            'category': 'Procurement',
            'potential_savings': '₹' + str(round(params['production_cost'] * 0.10, 2)),
            'implementation_cost': '₹5,000'
        })
        
        return recommendations
    
    def _generate_cost_simulation(
        self,
        current_cost: float,
        optimized_cost: float
    ) -> Dict[str, List]:
        """Generate cost reduction simulation over 12 months"""
        months = list(range(1, 13))
        
        # Simulate gradual cost reduction
        cost_values = []
        for month in months:
            progress = month / 12
            current_value = current_cost - (current_cost - optimized_cost) * progress
            cost_values.append(round(current_value, 2))
        
        # Calculate cumulative savings
        cumulative_savings = []
        total_saved = 0
        for month in months:
            monthly_saving = (current_cost - optimized_cost) * (month / 12)
            total_saved += monthly_saving / 12
            cumulative_savings.append(round(total_saved, 2))
        
        return {
            'months': months,
            'cost_trend': cost_values,
            'cumulative_savings': cumulative_savings,
            'target_cost': optimized_cost
        }
