from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import re
import json
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

# Configure static folder
app.static_folder = '.'

# Sample database for storing job descriptions and analysis results
job_database = []

# Common scam indicators for job descriptions
SCAM_INDICATORS = [
    'urgent hiring', 'work from home', 'no experience needed', 'high salary',
    'quick money', 'easy money', 'get rich quick', 'investment opportunity',
    'cryptocurrency', 'bitcoin', 'pay upfront', 'registration fee',
    'processing fee', 'guaranteed income', 'unlimited earning potential',
    'multi-level marketing', 'pyramid scheme', 'commission only',
    'no interview required', 'immediate start', 'flexible hours',
    'part-time', 'full-time', 'remote work', 'online job', 'data entry',
    'virtual assistant', 'customer service', 'sales representative',
    'marketing', 'social media', 'content creation', 'writing', 'editing',
    'transcription', 'translation', 'tutoring', 'teaching', 'coaching',
    'consulting', 'freelance', 'contract work', 'temporary', 'seasonal'
]

def analyze_job_description(description):
    """
    Analyze job description for potential scam indicators
    """
    if not description or len(description.strip()) < 10:
        return {
            'is_scam': True,
            'confidence': 0.9,
            'reasons': ['Job description is too short or empty'],
            'risk_level': 'High'
        }
    
    description_lower = description.lower()
    
    # Count scam indicators
    scam_count = 0
    found_indicators = []
    
    for indicator in SCAM_INDICATORS:
        if indicator in description_lower:
            scam_count += 1
            found_indicators.append(indicator)
    
    # Calculate risk score
    total_words = len(description.split())
    scam_ratio = scam_count / max(total_words, 1)
    
    # Determine risk level
    if scam_ratio > 0.1 or scam_count > 5:
        risk_level = 'High'
        is_scam = True
        confidence = min(0.9, 0.5 + (scam_ratio * 2))
    elif scam_ratio > 0.05 or scam_count > 2:
        risk_level = 'Medium'
        is_scam = True
        confidence = min(0.7, 0.3 + (scam_ratio * 2))
    elif scam_count > 0:
        risk_level = 'Low'
        is_scam = False
        confidence = 0.3
    else:
        risk_level = 'Very Low'
        is_scam = False
        confidence = 0.1
    
    # Additional checks
    additional_reasons = []
    
    # Check for urgent language
    urgent_words = ['urgent', 'immediate', 'asap', 'quick', 'fast', 'hurry']
    urgent_count = sum(1 for word in urgent_words if word in description_lower)
    if urgent_count > 2:
        additional_reasons.append('Contains multiple urgent/desperate language')
        confidence = min(0.95, confidence + 0.2)
    
    # Check for unrealistic promises
    unrealistic_words = ['guaranteed', 'promise', 'sure', 'certain', 'definite']
    unrealistic_count = sum(1 for word in unrealistic_words if word in description_lower)
    if unrealistic_count > 1:
        additional_reasons.append('Contains unrealistic guarantees')
        confidence = min(0.95, confidence + 0.15)
    
    # Check for payment requests
    payment_words = ['pay', 'fee', 'cost', 'charge', 'payment', 'money']
    payment_count = sum(1 for word in payment_words if word in description_lower)
    if payment_count > 2:
        additional_reasons.append('Mentions payment requirements')
        confidence = min(0.95, confidence + 0.25)
    
    # Combine reasons
    all_reasons = found_indicators[:3] + additional_reasons  # Limit to top 3 indicators
    
    return {
        'is_scam': is_scam,
        'confidence': round(confidence, 2),
        'reasons': all_reasons,
        'risk_level': risk_level,
        'scam_indicators_found': scam_count,
        'total_words': total_words
    }

@app.route('/')
def index():
    """Serve the main page"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory('.', filename)

@app.route('/api/analyze', methods=['POST'])
def analyze_job():
    """Analyze job description for potential scams"""
    try:
        data = request.get_json()
        
        if not data or 'description' not in data:
            return jsonify({
                'error': 'Job description is required'
            }), 400
        
        description = data['description'].strip()
        
        if not description:
            return jsonify({
                'error': 'Job description cannot be empty'
            }), 400
        
        # Analyze the job description
        analysis_result = analyze_job_description(description)
        
        # Generate unique ID for this analysis
        analysis_id = str(uuid.uuid4())
        
        # Store in database
        job_record = {
            'id': analysis_id,
            'description': description,
            'analysis': analysis_result,
            'timestamp': datetime.now().isoformat(),
            'user_ip': request.remote_addr
        }
        job_database.append(job_record)
        
        # Keep only last 1000 records
        if len(job_database) > 1000:
            job_database.pop(0)
        
        return jsonify({
            'id': analysis_id,
            'result': analysis_result,
            'message': 'Analysis completed successfully'
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Analysis failed: {str(e)}'
        }), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get analysis history"""
    try:
        # Return last 50 analyses
        recent_analyses = job_database[-50:] if len(job_database) > 50 else job_database
        
        return jsonify({
            'analyses': recent_analyses,
            'total_count': len(job_database)
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Failed to retrieve history: {str(e)}'
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get statistics about analyses"""
    try:
        if not job_database:
            return jsonify({
                'total_analyses': 0,
                'scam_count': 0,
                'legitimate_count': 0,
                'average_confidence': 0
            })
        
        total_analyses = len(job_database)
        scam_count = sum(1 for job in job_database if job['analysis']['is_scam'])
        legitimate_count = total_analyses - scam_count
        
        if total_analyses > 0:
            avg_confidence = sum(job['analysis']['confidence'] for job in job_database) / total_analyses
        else:
            avg_confidence = 0
        
        return jsonify({
            'total_analyses': total_analyses,
            'scam_count': scam_count,
            'legitimate_count': legitimate_count,
            'average_confidence': round(avg_confidence, 2),
            'scam_percentage': round((scam_count / total_analyses) * 100, 2) if total_analyses > 0 else 0
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Failed to retrieve statistics: {str(e)}'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 