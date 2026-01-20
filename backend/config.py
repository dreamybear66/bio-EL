"""
Configuration settings for AmulFeedGuard Treatment Optimizer Backend
"""

import os

class Config:
    """Base configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'amul-feedguard-secret-key-2026'
    DEBUG = True
    
    # CORS settings
    CORS_ORIGINS = ['http://localhost:5000', 'http://127.0.0.1:5000', 'file://']
    
    # API settings
    API_VERSION = 'v1'
    API_PREFIX = f'/api/{API_VERSION}'
    
    # Optimization parameters
    MAX_TEMPERATURE = 200
    MIN_TEMPERATURE = 0
    MAX_DURATION = 180
    MIN_DURATION = 10
    
    # Cost parameters
    ENERGY_COST_PER_KWH = 8.5  # INR
    LABOR_COST_PER_HOUR = 150  # INR
    
class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    
class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    
# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
