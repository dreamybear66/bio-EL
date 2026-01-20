# AmulFeedGuard Treatment Optimizer - Backend

Python Flask backend for the Treatment Optimizer system with optimization algorithms for temperature, waste reduction, and cost optimization.

## 🚀 Quick Start

### Prerequisites
- Python 3.11 or higher
- pip (Python package manager)

### Installation

1. **Navigate to the backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

### Running the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

You should see:
```
============================================================
🚀 AmulFeedGuard Treatment Optimizer Backend
============================================================
📡 Server running on: http://localhost:5000
📋 API Base URL: http://localhost:5000/api/v1
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Endpoints

#### 1. Temperature Optimization
**Endpoint:** `POST /api/v1/optimize/temperature`

**Request Body:**
```json
{
  "current_temperature": 80,
  "ideal_range": [30, 120],
  "storage_duration": 70,
  "feed_type": "fermentation",
  "ambient_humidity": 11,
  "equipment_status": "moderate",
  "batch_size": 1600
}
```

**Response:**
```json
{
  "status": "success",
  "optimization": {
    "optimal_temperature": 38.0,
    "temperature_adjustment": -42.0,
    "effectiveness": 73.5,
    "microbial_reduction": 73.42,
    "energy_consumption": 66.7,
    "carbon_footprint": 54.7,
    "water_usage": 312.0,
    "cost_estimate": 407.7,
    "efficiency_score": 93.7,
    "recommendations": [...],
    "parameter_comparison": [...]
  },
  "simulation_data": {
    "time_points": [0, 4, 7, ...],
    "effectiveness": [0, 15, 28, ...],
    "microbial_reduction": [0, 12, 25, ...]
  }
}
```

#### 2. Waste Optimization
**Endpoint:** `POST /api/v1/optimize/waste`

**Request Body:**
```json
{
  "initial_quantity": 5000,
  "spoilage_percentage": 12,
  "storage_method": "refrigerated",
  "handling_frequency": "daily",
  "contamination_history": "low"
}
```

**Response:**
```json
{
  "status": "success",
  "optimization": {
    "current_waste": 600,
    "optimized_waste": 390,
    "salvageable_quantity": 4610,
    "waste_reduction_percentage": 35.0,
    "cost_savings": 5250,
    "waste_breakdown": {
      "preventable_waste": 210,
      "unavoidable_waste": 180
    },
    "recommendations": [...]
  }
}
```

#### 3. Cost Optimization
**Endpoint:** `POST /api/v1/optimize/cost`

**Request Body:**
```json
{
  "production_cost": 50000,
  "energy_consumption": 1200,
  "labor_cost": 15000,
  "waste_cost": 8000,
  "treatment_cost": 12000
}
```

**Response:**
```json
{
  "status": "success",
  "optimization": {
    "total_current_cost": 86200,
    "total_optimized_cost": 68960,
    "total_savings": 17240,
    "roi_percentage": 20.0,
    "monthly_savings": 17240,
    "annual_savings": 206880,
    "breakdown_comparison": [...],
    "recommendations": [...]
  }
}
```

#### 4. Health Check
**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "service": "AmulFeedGuard Treatment Optimizer"
}
```

## 🏗️ Project Structure

```
backend/
├── app.py                          # Flask application entry point
├── config.py                       # Configuration settings
├── requirements.txt                # Python dependencies
├── routes/
│   ├── __init__.py
│   ├── temperature.py              # Temperature API endpoint
│   ├── waste.py                    # Waste API endpoint
│   └── cost.py                     # Cost API endpoint
├── services/
│   ├── __init__.py
│   ├── temperature_optimizer.py    # Temperature optimization logic
│   ├── waste_optimizer.py          # Waste optimization logic
│   └── cost_optimizer.py           # Cost optimization logic
└── utils/
    ├── __init__.py
    ├── calculations.py             # Shared calculation functions
    └── validators.py               # Input validation
```

## 🔧 Configuration

Edit `config.py` to customize:

- `DEBUG`: Enable/disable debug mode
- `CORS_ORIGINS`: Allowed CORS origins
- `API_VERSION`: API version
- `API_PREFIX`: API URL prefix

## 🧪 Testing

### Using curl

**Temperature Optimization:**
```bash
curl -X POST http://localhost:5000/api/v1/optimize/temperature \
  -H "Content-Type: application/json" \
  -d '{"current_temperature":80,"ideal_range":[30,120],"storage_duration":70,"feed_type":"fermentation","ambient_humidity":11,"equipment_status":"moderate","batch_size":1600}'
```

**Health Check:**
```bash
curl http://localhost:5000/health
```

### Using Python

```python
import requests

response = requests.post(
    'http://localhost:5000/api/v1/optimize/temperature',
    json={
        'current_temperature': 80,
        'ideal_range': [30, 120],
        'storage_duration': 70,
        'feed_type': 'fermentation',
        'ambient_humidity': 11,
        'equipment_status': 'moderate',
        'batch_size': 1600
    }
)

print(response.json())
```

## 📦 Dependencies

- **Flask 3.0.0** - Web framework
- **Flask-CORS 4.0.0** - CORS support
- **NumPy 1.26.0** - Numerical computations
- **python-dotenv 1.0.0** - Environment variables
- **Werkzeug 3.0.1** - WSGI utilities

## 🚀 Deployment

### Production Settings

1. Set `DEBUG = False` in `config.py`
2. Use a production WSGI server (Gunicorn, uWSGI)
3. Set up proper environment variables
4. Configure CORS for your domain

### Using Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Environment Variables

Create a `.env` file:
```
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=https://yourdomain.com
```

## 🔒 Security Notes

- Change `SECRET_KEY` in production
- Restrict CORS origins to your domain
- Use HTTPS in production
- Implement rate limiting for production
- Add authentication if needed

## 📝 License

Internal use for AmulFeedGuard Quality Assurance System

## 🤝 Support

For issues or questions, contact the development team.
