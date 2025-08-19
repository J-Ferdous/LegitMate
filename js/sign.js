// --- Interactive glowing border script ---
const formContainer = document.getElementById('form-container');
if (formContainer) {
    formContainer.addEventListener('mousemove', e => {
        const rect = formContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        formContainer.style.setProperty('--x', `${x}px`);
        formContainer.style.setProperty('--y', `${y}px`);
    });
}

// --- Particle canvas script ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

const mouse = { x: null, y: null, radius: 150 }

window.addEventListener('mousemove', event => {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y, directionX, directionY, size) {
        this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(200, 215, 255, 0.3)';
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < mouse.radius + this.size){
            if(mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 3;
            if(mouse.x > this.x && this.x > this.size * 10) this.x -= 3;
            if(mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 3;
            if(mouse.y > this.y && this.y > this.size * 10) this.y -= 3;
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
        particlesArray.push(new Particle(x, y, directionX, directionY, size));
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

// --- Email form functionality ---
document.addEventListener('DOMContentLoaded', function() {
    const emailRegisterBtn = document.getElementById('emailRegisterBtn');
    const emailSignInBtn = document.getElementById('emailSignInBtn');
    const emailForm = document.getElementById('emailForm');
    const backToOptions = document.getElementById('backToOptions');
    const submitRegister = document.getElementById('submitRegister');
    const submitSignIn = document.getElementById('submitSignIn');

    // Show email form for registration
    if (emailRegisterBtn) {
        emailRegisterBtn.addEventListener('click', () => {
            showEmailForm();
        });
    }

    // Show email form for sign-in
    if (emailSignInBtn) {
        emailSignInBtn.addEventListener('click', () => {
            showEmailForm();
        });
    }

    // Back to options
    if (backToOptions) {
        backToOptions.addEventListener('click', () => {
            hideEmailForm();
        });
    }

    // Handle registration
    if (submitRegister) {
        submitRegister.addEventListener('click', handleRegistration);
    }

    // Handle sign-in
    if (submitSignIn) {
        submitSignIn.addEventListener('click', handleSignIn);
    }

    // Tab switching and redirection logic
    const signInTab = document.getElementById('signInTab');
    const registerTab = document.getElementById('registerTab');
    const formTitle = document.getElementById('form-title');

    if (registerTab) {
        registerTab.addEventListener('click', () => {
            signInTab.classList.remove('active');
            registerTab.classList.add('active');
            formTitle.textContent = 'Create an Account';
            setTimeout(() => {
                window.location.href = 'sign-up.html';
            }, 300);
        });
    }

    if (signInTab) {
        signInTab.addEventListener('click', () => {
            registerTab.classList.remove('active');
            signInTab.classList.add('active');
            formTitle.textContent = 'Welcome Back!';
        });
    }
});

function showEmailForm() {
    const buttons = document.querySelectorAll('.button:not(#backToOptions):not(#submitRegister):not(#submitSignIn)');
    const emailForm = document.getElementById('emailForm');
    
    buttons.forEach(btn => btn.style.display = 'none');
    emailForm.style.display = 'block';
}

function hideEmailForm() {
    const buttons = document.querySelectorAll('.button:not(#backToOptions):not(#submitRegister):not(#submitSignIn)');
    const emailForm = document.getElementById('emailForm');
    
    buttons.forEach(btn => btn.style.display = 'flex');
    emailForm.style.display = 'none';
    clearErrors();
}

function clearErrors() {
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

async function handleRegistration() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('submitRegister');
    
    clearErrors();
    
    // Validation
    if (!email) {
        showError('emailError', 'Email is required');
        return;
    }
    
    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        return;
    }
    
    if (!password) {
        showError('passwordError', 'Password is required');
        return;
    }
    
    if (password.length < 6) {
        showError('passwordError', 'Password must be at least 6 characters');
        return;
    }
    
    // Show loading state
    submitBtn.querySelector('span').textContent = 'Creating Account...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Registration successful! Redirecting to home...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showError('emailError', data.error || 'Registration failed');
        }
    } catch (error) {
        showError('emailError', 'Network error. Please try again.');
    } finally {
        submitBtn.querySelector('span').textContent = 'Create Account';
        submitBtn.disabled = false;
    }
}

async function handleSignIn() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('submitSignIn');
    
    clearErrors();
    
    // Validation
    if (!email) {
        showError('emailError', 'Email is required');
        return;
    }
    
    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        return;
    }
    
    if (!password) {
        showError('passwordError', 'Password is required');
        return;
    }
    
    // Show loading state
    submitBtn.querySelector('span').textContent = 'Signing In...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Sign in successful! Redirecting to home...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showError('emailError', data.error || 'Sign in failed');
        }
    } catch (error) {
        showError('emailError', 'Network error. Please try again.');
    } finally {
        submitBtn.querySelector('span').textContent = 'Sign In';
        submitBtn.disabled = false;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}