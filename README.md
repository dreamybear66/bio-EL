# AmulFeedGuard Treatment Optimizer

Complete hybrid web application for optimizing feed treatment processes with Python Flask backend and vanilla JavaScript frontend.

## 🎯 Overview

The Treatment Optimizer system provides three specialized optimizers:
- **Temperature Optimizer** - Optimize treatment temperature and process control
- **Waste Reduction Optimizer** - Minimize spoilage and maximize salvageable feed
- **Cost Optimizer** - Reduce production costs while maintaining quality

## 🚀 Quick Start

### Backend Setup

1. **Install Python dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Start the Flask server:**
```bash
python app.py
```

Server runs on: `http://localhost:5000`

### Frontend Access

Open in your browser:
```
file:///path/to/treatment-optimizer.html
```

Or integrate with your web server.

## 📁 Project Structure

```
bio safety el/
├── backend/                        # Python Flask backend
│   ├── app.py                      # Flask application
│   ├── config.py                   # Configuration
│   ├── requirements.txt            # Python dependencies
│   ├── routes/                     # API endpoints
│   ├── services/                   # Optimization logic
│   └── utils/                      # Utilities
│
├── frontend/
│   ├── treatment-optimizer.html    # Landing page
│   ├── optimizer-temperature.html  # Temperature optimizer
│   ├── optimizer-waste.html        # Waste optimizer
│   ├── optimizer-cost.html         # Cost optimizer
│   │
│   ├── css/
│   │   ├── style.css               # Base styles
│   │   └── optimizer-styles.css    # Optimizer styles
│   │
│   └── js/
│       ├── optimizer-main.js       # Landing page logic
│       ├── temperature.js          # Temperature optimizer
│       ├── waste.js                # Waste optimizer
│       ├── cost.js                 # Cost optimizer
│       └── api-client.js           # API communication
│
└── README.md                       # This file
```

## 🎨 Features

### Screen-Recording-Style Animations
- Step-by-step visual analysis
- Progressive chart rendering
- Real-time metric updates
- Explanatory captions

### API Integration
- RESTful API architecture
- Real-time data processing
- Error handling
- Loading states

### Professional UI
- Amul branding
- Responsive design
- Interactive sliders
- Card-based layouts

## 📚 Documentation

- **Backend API**: See [backend/README.md](backend/README.md)
- **Frontend Architecture**: Modern vanilla JavaScript with ES6+
- **Styling**: CSS Grid, Flexbox, custom properties

## 🔧 Configuration

### Backend
Edit `backend/config.py`:
- `DEBUG`: Development mode
- `CORS_ORIGINS`: Allowed origins
- `API_PREFIX`: API URL prefix

### Frontend
Edit `js/api-client.js`:
- `baseURL`: Backend API URL
- `timeout`: Request timeout

## 🧪 Testing

### Test Backend
```bash
curl http://localhost:5000/health
```

### Test Optimizers
1. Open `treatment-optimizer.html`
2. Click an optimizer card
3. Adjust parameters
4. Click "Run Simulation"
5. Verify results display

## 📊 API Endpoints

- `POST /api/v1/optimize/temperature` - Temperature optimization
- `POST /api/v1/optimize/waste` - Waste reduction
- `POST /api/v1/optimize/cost` - Cost optimization
- `GET /health` - Health check

See [backend/README.md](backend/README.md) for detailed API documentation.

## 🚀 Deployment

### Backend
1. Set production config
2. Use Gunicorn/uWSGI
3. Set up reverse proxy (Nginx)
4. Configure HTTPS

### Frontend
1. Host on web server
2. Update API URLs
3. Enable CORS on backend
4. Optimize assets

## 🛠️ Development

### Adding a New Optimizer

1. **Backend:**
   - Create `routes/new_optimizer.py`
   - Create `services/new_optimizer_service.py`
   - Register blueprint in `app.py`

2. **Frontend:**
   - Create `optimizer-new.html`
   - Create `js/new.js`
   - Add card to `treatment-optimizer.html`

### Code Style
- Python: PEP 8
- JavaScript: ES6+ with semicolons
- CSS: BEM-like naming

## 📝 License

Internal use for AmulFeedGuard Quality Assurance System

## 🤝 Contributing

Contact the development team for contribution guidelines.

## 📧 Support

For issues or questions, contact the AmulFeedGuard development team.
