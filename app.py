import os
import json
import uuid
import math
import pickle
import sqlite3
import re
from typing import Any, Optional, List
from datetime import datetime

from flask import Flask, request, jsonify, send_from_directory, session, g
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

# ------------------------------------------------------------------------------
# App & Config
# ------------------------------------------------------------------------------

app = Flask(__name__, static_folder='.')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-me')

# Session cookie hardening
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = os.environ.get('SESSION_COOKIE_SECURE', 'false').lower() == 'true'

# CORS: reflect useful local origins and allow credentials
cors_env = os.environ.get('CORS_ORIGINS', '').strip()
if cors_env:
    origins = [o.strip() for o in cors_env.split(',') if o.strip()]
else:
    # Common dev origins + 'null' (file://)
    origins = [
        "http://127.0.0.1:5000",
        "http://localhost:5000",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "null"
    ]
CORS(
    app,
    supports_credentials=True,
    origins=origins,
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["Content-Type"]
)

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
DATABASE_DIR = os.path.join(BASE_DIR, 'database')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'app.db')
MODEL_PATH = os.path.join(MODELS_DIR, 'fake_job_model.pkl')  # your chosen filename

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(DATABASE_DIR, exist_ok=True)

# ------------------------------------------------------------------------------
# Simple in-memory store for job analysis history
# ------------------------------------------------------------------------------

job_database = []

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

def analyze_job_description(description: str):
    if not description or len(description.strip()) < 10:
        return {
            'is_scam': True,
            'confidence': 0.9,
            'reasons': ['Job description is too short or empty'],
            'risk_level': 'High',
            'ml_confidence': 0.0,
            'rule_based_confidence': 0.9
        }

    description_lower = description.lower()

    # Rule-based
    scam_count = 0
    found_indicators = []
    for indicator in SCAM_INDICATORS:
        if indicator in description_lower:
            scam_count += 1
            found_indicators.append(indicator)

    total_words = len(description.split())
    scam_ratio = scam_count / max(total_words, 1)

    if scam_ratio > 0.1 or scam_count > 5:
        rule_risk_level = 'High'
        rule_is_scam = True
        rule_confidence = min(0.9, 0.5 + (scam_ratio * 2))
    elif scam_ratio > 0.05 or scam_count > 2:
        rule_risk_level = 'Medium'
        rule_is_scam = True
        rule_confidence = min(0.7, 0.3 + (scam_ratio * 2))
    elif scam_count > 0:
        rule_risk_level = 'Low'
        rule_is_scam = False
        rule_confidence = 0.3
    else:
        rule_risk_level = 'Very Low'
        rule_is_scam = False
        rule_confidence = 0.1

    additional_reasons = []
    urgent_words = ['urgent', 'immediate', 'asap', 'quick', 'fast', 'hurry']
    if sum(1 for w in urgent_words if w in description_lower) > 2:
        additional_reasons.append('Contains multiple urgent/desperate language')
        rule_confidence = min(0.95, rule_confidence + 0.2)

    unrealistic_words = ['guaranteed', 'promise', 'sure', 'certain', 'definite']
    if sum(1 for w in unrealistic_words if w in description_lower) > 1:
        additional_reasons.append('Contains unrealistic guarantees')
        rule_confidence = min(0.95, rule_confidence + 0.15)

    payment_words = ['pay', 'fee', 'cost', 'charge', 'payment', 'money']
    if sum(1 for w in payment_words if w in description_lower) > 2:
        additional_reasons.append('Mentions payment requirements')
        rule_confidence = min(0.95, rule_confidence + 0.25)

    # ML Model analysis
    ml_confidence = 0.0
    ml_is_scam = False
    if MODEL is not None:
        try:
            text_features = extract_text_features(description)
            if hasattr(MODEL, 'predict_proba'):
                proba = MODEL.predict_proba([text_features])
                ml_confidence = float(proba[0][1])  # probability of scam
                ml_is_scam = ml_confidence > 0.5
            elif hasattr(MODEL, 'predict'):
                prediction = MODEL.predict([text_features])[0]
                ml_is_scam = bool(prediction)
                ml_confidence = 0.8 if ml_is_scam else 0.2
        except Exception as e:
            print(f"ML model prediction failed: {e}")
            ml_confidence = 0.0
            ml_is_scam = False

    # Combine
    if MODEL is not None and ml_confidence > 0:
        combined_confidence = (0.6 * ml_confidence) + (0.4 * rule_confidence)
        is_scam = combined_confidence > 0.5
        confidence_source = "Combined ML + Rule-based"
    else:
        combined_confidence = rule_confidence
        is_scam = rule_is_scam
        confidence_source = "Rule-based only"

    if combined_confidence > 0.8:
        risk_level = 'Very High'
    elif combined_confidence > 0.6:
        risk_level = 'High'
    elif combined_confidence > 0.4:
        risk_level = 'Medium'
    elif combined_confidence > 0.2:
        risk_level = 'Low'
    else:
        risk_level = 'Very Low'

    all_reasons = (found_indicators[:3] + additional_reasons)
    if MODEL is not None:
        all_reasons.append(f"ML model confidence: {ml_confidence:.2f}")

    return {
        'is_scam': is_scam,
        'confidence': round(combined_confidence, 3),
        'reasons': all_reasons,
        'risk_level': risk_level,
        'scam_indicators_found': scam_count,
        'total_words': total_words,
        'ml_confidence': round(ml_confidence, 3),
        'rule_based_confidence': round(rule_confidence, 3),
        'confidence_source': confidence_source
    }

# ------------------------------------------------------------------------------
# SQLite helpers
# ------------------------------------------------------------------------------

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE_PATH, check_same_thread=False)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(exc):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def initialize_database() -> None:
    db = get_db()
    db.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
    """)
    db.commit()

def find_user_by_email(email: str) -> Optional[sqlite3.Row]:
    db = get_db()
    cur = db.execute("SELECT * FROM users WHERE email = ?", (email,))
    return cur.fetchone()

def create_user(email: str, password: str) -> int:
    password_hash = generate_password_hash(password)
    db = get_db()
    cur = db.execute(
        "INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)",
        (email, password_hash, datetime.now().isoformat())
    )
    db.commit()
    return cur.lastrowid

def is_valid_email(email: str) -> bool:
    return re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email) is not None

# ------------------------------------------------------------------------------
# Model loading & prediction
# ------------------------------------------------------------------------------

MODEL: Optional[Any] = None
VECTORIZER: Optional[TfidfVectorizer] = None
MODEL_ERROR: Optional[str] = None

def extract_text_features(text: str) -> List[float]:
    text_lower = text.lower()
    word_count = len(text.split())
    char_count = len(text)
    sentence_count = len(re.split(r'[.!?]+', text))

    urgent_words = ['urgent', 'immediate', 'asap', 'quick', 'fast', 'hurry', 'now']
    money_words = ['salary', 'pay', 'money', 'income', 'earn', 'profit', 'cash']
    guarantee_words = ['guaranteed', 'promise', 'sure', 'certain', 'definite']
    work_from_home = ['remote', 'work from home', 'home based', 'telecommute']

    urgent_count = sum(1 for word in urgent_words if word in text_lower)
    money_count = sum(1 for word in money_words if word in text_lower)
    guarantee_count = sum(1 for word in guarantee_words if word in text_lower)
    wfh_count = sum(1 for word in work_from_home if word in text_lower)

    has_email = 1 if re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b', text) else 0
    has_phone = 1 if re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text) else 0
    has_website = 1 if re.search(r'http[s]?://', text) else 0

    exclamation_count = text.count('!')
    caps_ratio = sum(1 for c in text if c.isupper()) / max(len(text), 1)

    return [
        word_count, char_count, sentence_count,
        urgent_count, money_count, guarantee_count, wfh_count,
        has_email, has_phone, has_website,
        exclamation_count, caps_ratio
    ]

def load_model() -> None:
    global MODEL, VECTORIZER, MODEL_ERROR
    MODEL, VECTORIZER, MODEL_ERROR = None, None, None

    if not os.path.exists(MODEL_PATH):
        MODEL_ERROR = f"Model file not found at {MODEL_PATH}"
        return

    try:
        with open(MODEL_PATH, 'rb') as f:
            model_data = pickle.load(f)

        if isinstance(model_data, dict):
            MODEL = model_data.get('model')
            VECTORIZER = model_data.get('vectorizer')
        else:
            MODEL = model_data
            VECTORIZER = TfidfVectorizer(max_features=1000, stop_words='english')
    except Exception as e:
        MODEL = None
        VECTORIZER = None
        MODEL_ERROR = f"Failed to load model: {e}"

def compute_confidence_from_model(model: Any, features: List[float]) -> float:
    try:
        proba = model.predict_proba([features])
        return float(max(proba[0]))
    except Exception:
        pass

    try:
        score = model.decision_function([features])
        s = float(score[0] if hasattr(score, "__len__") else score)
        return 1.0 / (1.0 + math.exp(-s))
    except Exception:
        pass

    try:
        pred = model.predict([features])[0]
        try:
            return float(pred)
        except Exception:
            return 1.0 if str(pred).lower() in ("1", "true", "yes", "positive") else 0.0
    except Exception:
        return 0.0

# ------------------------------------------------------------------------------
# Startup init
# ------------------------------------------------------------------------------

def _startup_init_once():
    os.makedirs(MODELS_DIR, exist_ok=True)
    os.makedirs(DATABASE_DIR, exist_ok=True)
    with app.app_context():
        initialize_database()
    load_model()

_startup_init_once()

# ------------------------------------------------------------------------------
# Auth Routes
# ------------------------------------------------------------------------------

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({'success': False, 'error': 'Email and password are required'}), 400
    if not is_valid_email(email):
        return jsonify({'success': False, 'error': 'Please enter a valid email address'}), 400
    if len(password) < 6:
        return jsonify({'success': False, 'error': 'Password must be at least 6 characters'}), 400

    if find_user_by_email(email) is not None:
        return jsonify({'success': False, 'error': 'Email already exists'}), 409

    try:
        user_id = create_user(email, password)
        session['user_id'] = user_id
        session['email'] = email
        return jsonify({'success': True, 'message': 'Registration successful', 'userId': user_id})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'error': 'Email already exists'}), 409
    except Exception as e:
        return jsonify({'success': False, 'error': f'Registration failed: {e}'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({'success': False, 'error': 'Email and password are required'}), 400
    if not is_valid_email(email):
        return jsonify({'success': False, 'error': 'Please enter a valid email address'}), 400

    row = find_user_by_email(email)
    if row is None or not check_password_hash(row['password_hash'], password):
        return jsonify({'success': False, 'error': 'Invalid email or password'}), 401

    session['user_id'] = int(row['id'])
    session['email'] = row['email']
    return jsonify({'success': True, 'message': 'Login successful'})

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out'})

@app.route('/api/auth/me', methods=['GET'])
def auth_me():
    if 'user_id' not in session:
        return jsonify({'authenticated': False})
    return jsonify({'authenticated': True, 'userId': session['user_id'], 'email': session['email']})

# ------------------------------------------------------------------------------
# Model endpoints
# ------------------------------------------------------------------------------

@app.route('/api/model/status', methods=['GET'])
def model_status():
    return jsonify({
        'loaded': MODEL is not None,
        'path': MODEL_PATH,
        'error': MODEL_ERROR
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    if MODEL is None:
        return jsonify({'success': False, 'error': MODEL_ERROR or 'Model not loaded'}), 503

    data = request.get_json(silent=True) or {}
    features = data.get('features')

    if not isinstance(features, list) or len(features) == 0:
        return jsonify({'success': False, 'error': 'features must be a non-empty array'}), 400

    try:
        features_cast = [float(x) for x in features]
    except Exception:
        return jsonify({'success': False, 'error': 'features must contain only numbers'}), 400

    try:
        confidence = compute_confidence_from_model(MODEL, features_cast)
        return jsonify({'success': True, 'confidence': round(float(confidence), 4)})
    except Exception as e:
        return jsonify({'success': False, 'error': f'Prediction failed: {e}'}), 500

# ------------------------------------------------------------------------------
# Job analysis
# ------------------------------------------------------------------------------

@app.route('/api/analyze', methods=['POST'])
def analyze_job():
    data = request.get_json(silent=True) or {}
    description = (data.get('description') or '').strip()
    if not description:
        return jsonify({'error': 'Job description is required'}), 400

    analysis_result = analyze_job_description(description)
    analysis_id = str(uuid.uuid4())
    job_record = {
        'id': analysis_id,
        'description': description,
        'analysis': analysis_result,
        'timestamp': datetime.now().isoformat(),
        'user_ip': request.remote_addr
    }
    job_database.append(job_record)
    if len(job_database) > 1000:
        job_database.pop(0)

    return jsonify({
        'id': analysis_id,
        'result': analysis_result,
        'message': 'Analysis completed successfully'
    })

@app.route('/api/history', methods=['GET'])
def get_history():
    recent_analyses = job_database[-50:] if len(job_database) > 50 else job_database
    return jsonify({
        'analyses': recent_analyses,
        'total_count': len(job_database)
    })

@app.route('/api/stats', methods=['GET'])
def get_stats():
    if not job_database:
        return jsonify({
            'total_analyses': 0,
            'scam_count': 0,
            'legitimate_count': 0,
            'average_confidence': 0,
            'scam_percentage': 0
        })

    total_analyses = len(job_database)
    scam_count = sum(1 for job in job_database if job['analysis']['is_scam'])
    legitimate_count = total_analyses - scam_count
    avg_confidence = sum(job['analysis']['confidence'] for job in job_database) / total_analyses

    return jsonify({
        'total_analyses': total_analyses,
        'scam_count': scam_count,
        'legitimate_count': legitimate_count,
        'average_confidence': round(avg_confidence, 2),
        'scam_percentage': round((scam_count / total_analyses) * 100, 2) if total_analyses else 0
    })

# ------------------------------------------------------------------------------
# Static files + health
# ------------------------------------------------------------------------------

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

# ------------------------------------------------------------------------------
# Error handling
# ------------------------------------------------------------------------------

@app.errorhandler(400)
def bad_request(err):
    return jsonify({'success': False, 'error': 'Bad request', 'detail': str(err)}), 400

@app.errorhandler(404)
def not_found(err):
    if request.path.startswith('/api/'):
        return jsonify({'success': False, 'error': 'Not found'}), 404
    return err, 404

@app.errorhandler(500)
def server_error(err):
    return jsonify({'success': False, 'error': 'Server error', 'detail': str(err)}), 500

# ------------------------------------------------------------------------------
# Main
# ------------------------------------------------------------------------------

if __name__ == '__main__':
    _startup_init_once()
    port = int(os.environ.get('PORT', '5000'))
    debug = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'
    print(f"Starting Flask server on http://127.0.0.1:{port}")
    app.run(debug=debug, host='0.0.0.0', port=port, threaded=True)
