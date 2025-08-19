 // --- Particle canvas script ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    const mouse = {
        x: null,
        y: null,
        radius: 150
    }

    window.addEventListener('mousemove', event => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(200, 215, 255, 0.3)';
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < mouse.radius + this.size){
                if(mouse.x < this.x && this.x < canvas.width - this.size * 10){
                    this.x += 5;
                }
                if(mouse.x > this.x && this.x > this.size * 10){
                    this.x -= 5;
                }
                if(mouse.y < this.y && this.y < canvas.height - this.size * 10){
                    this.y += 5;
                }
                if(mouse.y > this.y && this.y > this.size * 10){
                    this.y -= 5;
                }
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = 'white';
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0,0,innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    init();
    animate();

    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = 150;
        init();
    });

    // --- Job Description Analysis ---
    document.addEventListener('DOMContentLoaded', function() {
        const input = document.querySelector('.input');
        const submitBtn = document.querySelector('.btn');
        
        // Add click event to submit button
        submitBtn.addEventListener('click', analyzeJobDescription);
        
        // Add enter key event to input
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                analyzeJobDescription();
            }
        });
    });

    async function analyzeJobDescription() {
        const input = document.querySelector('.input');
        const submitBtn = document.querySelector('.btn');
        const description = input.value.trim();
        
        if (!description) {
            showNotification('Please enter a job description', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.textContent = 'Analyzing...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: description })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showAnalysisResult(data.result);
            } else {
                showNotification(data.error || 'Analysis failed', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Network error. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = 'submit';
            submitBtn.disabled = false;
        }
    }

    function showAnalysisResult(result) {
        // Create modal for showing results
        const modal = document.createElement('div');
        modal.className = 'analysis-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>🔍 Job Analysis Result</h2>
                <div class="result-container">
                    <div class="risk-level ${result.risk_level.toLowerCase().replace(' ', '-')}">
                        <h3>Risk Level: ${result.risk_level}</h3>
                        <div class="confidence">Overall Confidence: ${(result.confidence * 100).toFixed(1)}%</div>
                    </div>
                    <div class="verdict">
                        <h3>Verdict: ${result.is_scam ? '⚠️ POTENTIAL SCAM' : '✅ LIKELY LEGITIMATE'}</h3>
                    </div>
                    
                    <div class="confidence-breakdown">
                        <h4>📊 Confidence Breakdown:</h4>
                        <div class="confidence-item">
                            <span>ML Model: ${(result.ml_confidence * 100).toFixed(1)}%</span>
                            <div class="confidence-bar">
                                <div class="confidence-fill" style="width: ${result.ml_confidence * 100}%"></div>
                            </div>
                        </div>
                        <div class="confidence-item">
                            <span>Rule-based: ${(result.rule_based_confidence * 100).toFixed(1)}%</span>
                            <div class="confidence-bar">
                                <div class="confidence-fill" style="width: ${result.rule_based_confidence * 100}%"></div>
                            </div>
                        </div>
                        <p class="analysis-method">Analysis Method: ${result.confidence_source}</p>
                    </div>
                    
                    ${result.reasons.length > 0 ? `
                        <div class="reasons">
                            <h4>🚩 Detection Reasons:</h4>
                            <ul>
                                ${result.reasons.map(reason => `<li>${reason}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    <div class="stats">
                        <h4>📈 Analysis Statistics:</h4>
                        <p>Scam indicators found: <strong>${result.scam_indicators_found}</strong></p>
                        <p>Total words analyzed: <strong>${result.total_words}</strong></p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = function() {
            modal.remove();
        }
        
        // Close modal when clicking outside
        modal.onclick = function(event) {
            if (event.target === modal) {
                modal.remove();
            }
        }
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
  