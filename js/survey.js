// --- Interactive glowing border script ---
const formContainer = document.getElementById('survey-container');
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

window.addEventListener('mousemove', event => {
    mouse.x = event.x;
    mouse.y = event.y;
});

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
    let numberOfParticles = (canvas.height * canvas.width) / 15000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let dX = (Math.random() * 0.4) - 0.2;
        let dY = (Math.random() * 0.4) - 0.2;
        particlesArray.push(new Particle(x, y, dX, dY, size));
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

  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCPaYAW_OgQ7ch1EvM2DvXR2L3qBoOl-lM",
    authDomain: "legitmate-e5b35.firebaseapp.com",
    projectId: "legitmate-e5b35",
    appId: "1:843217845569:web:52297b376df0fcb65c35c0",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const form = document.getElementById("survey-q1-11");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const surveyData = {};

    formData.forEach((value, key) => {
      if (key.endsWith("[]")) {
        const actualKey = key.replace("[]", "");
        if (!surveyData[actualKey]) {
          surveyData[actualKey] = [];
        }
        surveyData[actualKey].push(value);
      } else {
        surveyData[key] = value;
      }
    });

    try {
      await addDoc(collection(db, "surveyResponses"), {
        ...surveyData,
        createdAt: new Date().toISOString(),
      });

      alert("Survey submitted successfully!");
      form.reset();
    } catch (error) {
      console.error("Error saving survey:", error);
      alert("Failed to submit survey. Please try again.");
    }
  });
