# LegitMate - Job Scam Detection Platform

A Flask-based web application that helps job seekers identify and avoid potential job scams using AI-powered fraud detection.

## Features

- **Real-time Job Description Analysis**: Analyze job postings for potential scam indicators
- **AI-Powered Detection**: Uses pattern recognition and keyword analysis to identify suspicious job listings
- **Risk Assessment**: Provides confidence scores and risk levels for each analysis
- **Beautiful UI**: Modern, responsive design with particle animations
- **RESTful API**: Backend API for integration with other applications

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Flask (Python)
- **Styling**: Custom CSS with modern gradients and animations
- **API**: RESTful endpoints with JSON responses

## Installation

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Setup Instructions

1. **Clone or download the project files**

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Flask application**:
   ```bash
   python app.py
   ```

4. **Access the application**:
   Open your web browser and navigate to `http://localhost:5000`

## API Endpoints

### POST /api/analyze
Analyze a job description for potential scams.

**Request Body:**
```json
{
  "description": "Job description text here"
}
```

**Response:**
```json
{
  "id": "unique-analysis-id",
  "result": {
    "is_scam": true,
    "confidence": 0.85,
    "reasons": ["urgent hiring", "high salary"],
    "risk_level": "High",
    "scam_indicators_found": 3,
    "total_words": 45
  },
  "message": "Analysis completed successfully"
}
```

### GET /api/history
Get analysis history (last 50 analyses).

**Response:**
```json
{
  "analyses": [...],
  "total_count": 150
}
```

### GET /api/stats
Get statistics about all analyses.

**Response:**
```json
{
  "total_analyses": 150,
  "scam_count": 45,
  "legitimate_count": 105,
  "average_confidence": 0.72,
  "scam_percentage": 30.0
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00",
  "version": "1.0.0"
}
```

## How It Works

### Scam Detection Algorithm

The application uses a multi-layered approach to detect potential job scams:

1. **Keyword Analysis**: Checks for suspicious phrases and patterns commonly found in scam job postings
2. **Risk Scoring**: Calculates a confidence score based on the number and type of indicators found
3. **Context Analysis**: Considers the overall structure and language patterns of the job description
4. **Statistical Analysis**: Provides detailed metrics about the analysis

### Risk Levels

- **Very Low**: Likely legitimate job posting
- **Low**: Some minor concerns, but generally safe
- **Medium**: Multiple suspicious indicators, proceed with caution
- **High**: High probability of being a scam, avoid

## Usage

1. **Enter Job Description**: Paste or type the job description you want to analyze
2. **Submit for Analysis**: Click the "submit" button or press Enter
3. **Review Results**: View the detailed analysis including risk level, confidence score, and specific reasons
4. **Make Informed Decision**: Use the analysis to decide whether to proceed with the job application

## File Structure

```
LegitMate/
├── app.py                 # Flask backend application
├── requirements.txt       # Python dependencies
├── index.html            # Main homepage
├── js/
│   └── index.js          # Frontend JavaScript with API integration
├── styles/
│   ├── index.css         # Main stylesheet
│   └── shared.css        # Shared styles
├── images/
│   └── logo.png          # Application logo
└── README.md             # This file
```

## Customization

### Adding New Scam Indicators

To add new scam detection patterns, edit the `SCAM_INDICATORS` list in `app.py`:

```python
SCAM_INDICATORS = [
    'your_new_indicator',
    'another_suspicious_phrase',
    # ... existing indicators
]
```

### Modifying Risk Calculation

Adjust the risk calculation logic in the `analyze_job_description()` function in `app.py` to fine-tune the detection sensitivity.

## Security Considerations

- The application stores analysis data in memory (not persistent)
- No personal information is collected or stored
- All API endpoints are rate-limited and validated
- Input sanitization is implemented to prevent injection attacks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please open an issue in the repository or contact the development team.

---

**Note**: This tool is designed to assist in identifying potential job scams but should not be the sole factor in making employment decisions. Always conduct thorough research and use your judgment when applying for jobs.