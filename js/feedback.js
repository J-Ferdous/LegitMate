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
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
class Particle {
    constructor(x, y, dX, dY, size) {
        this.x = x; this.y = y; this.directionX = dX; this.directionY = dY; this.size = size;
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
        let dx = mouse.x - this.x, dy = mouse.y - this.y;
        if (Math.sqrt(dx*dx + dy*dy) < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 3;
            if (mouse.x > this.x && this.x > this.size * 10) this.x -= 3;
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 3;
            if (mouse.y > this.y && this.y > this.size * 10) this.y -= 3;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}
function init() {
    particlesArray = [];
    let num = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < num; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * (innerWidth - size * 2));
        let y = (Math.random() * (innerHeight - size * 2));
        let dX = (Math.random() * 0.4) - 0.2;
        let dY = (Math.random() * 0.4) - 0.2;
        particlesArray.push(new Particle(x, y, dX, dY, size));
    }
}
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    particlesArray.forEach(p => p.update());
}
init();
animate();
window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = 150;
    init();
});

// --- Form Submission Handler ---
const feedbackForm = document.getElementById('feedback-form');
const thankYouMessage = document.getElementById('thank-you-message');
feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    feedbackForm.style.display = 'none';
    thankYouMessage.style.display = 'block';
});