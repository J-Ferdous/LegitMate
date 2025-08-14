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

// --- NEW: Tab switching and redirection logic ---
const signInTab = document.getElementById('signInTab');
const registerTab = document.getElementById('registerTab');
const formTitle = document.getElementById('form-title');
const registerPageUrl = 'sign-up.html'; // The name of your registration file

registerTab.addEventListener('click', () => {
    // 1. Switch the active class for the underline effect
    signInTab.classList.remove('active');
    registerTab.classList.add('active');
    
    // 2. Change the title for better UX
    formTitle.textContent = 'Create an Account';

    // 3. Redirect after a short delay so the user sees the change
    setTimeout(() => {
        window.location.href = registerPageUrl;
    }, 300); // 300ms delay
});

signInTab.addEventListener('click', () => {
    // This is for staying on the same page, just resets the state
    registerTab.classList.remove('active');
    signInTab.classList.add('active');
    formTitle.textContent = 'Welcome Back!';
});