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

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCPaYAW_OgQ7ch1EvM2DvXR2L3qBoOl-lM",
  authDomain: "legitmate-e5b35.firebaseapp.com",
  projectId: "legitmate-e5b35",
  appId: "1:843217845569:web:52297b376df0fcb65c35c0",
};

const DASHBOARD_URL = "index.html"; 

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "en"; 
await setPersistence(auth, browserLocalPersistence);

const signInTab = document.getElementById("signInTab");
const registerTab = document.getElementById("registerTab");
const formTitle = document.getElementById("form-title");

const authForm   = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passInput  = document.getElementById("password");
const confirmWrap= document.getElementById("confirmWrap");
const confirmInp = document.getElementById("confirm");
const submitBtn  = document.getElementById("submitBtn");

const errorMsg   = document.getElementById("errorMsg");
const successMsg = document.getElementById("successMsg");

const googleBtn  = document.getElementById("googleBtn");
const facebookBtn= document.getElementById("facebookBtn");
const yahooBtn   = document.getElementById("yahooBtn");
const switchToRegister = document.getElementById("switchToRegister");

let mode = "signin";

function setMode(nextMode) {
  mode = nextMode;
  if (mode === "signin") {
    signInTab.classList.add("active");
    registerTab.classList.remove("active");
    formTitle.textContent = "Welcome Back!";
    confirmWrap.classList.add("hidden");
    confirmInp.required = false;
    submitBtn.textContent = "Sign In";
    document.getElementById('footer-text').innerHTML = `Don't have an account? <a href="#" id="switchToRegister">Create one</a>`;
  } else {
    registerTab.classList.add("active");
    signInTab.classList.remove("active");
    formTitle.textContent = "Create Your Account";
    confirmWrap.classList.remove("hidden");
    confirmWrap.classList.add("flex");
    confirmInp.required = true;
    submitBtn.textContent = "Create Account";
    document.getElementById('footer-text').innerHTML = `Already have an account? <a href="#" id="switchToRegister">Sign In</a>`;
  }

  const newLink = document.getElementById('switchToRegister');
  newLink.addEventListener('click', (e) => {
    e.preventDefault();
    setMode(mode === "signin" ? "register" : "signin");
  });

  clearMessages();
}


signInTab?.addEventListener("click", () => setMode("signin"));
registerTab?.addEventListener("click", () => setMode("register"));
switchToRegister?.addEventListener("click", (e) => {
  e.preventDefault();
  setMode("register");
});

function showError(message) {
  errorMsg.textContent = message || "";
  successMsg.textContent = "";
}
function showSuccess(message) {
  successMsg.textContent = message || "";
  errorMsg.textContent = "";
}
function clearMessages() {
  showError("");
  showSuccess("");
}

function mapAuthError(err) {
  const code = (err?.code || "").toLowerCase();
  if (code.includes("network-request-failed")) return "Network error. Check your internet connection.";
  if (code.includes("invalid-email")) return "Invalid email address.";
  if (code.includes("user-not-found")) return "No user with that email. Try registering.";
  if (code.includes("wrong-password")) return "Incorrect password.";
  if (code.includes("email-already-in-use")) return "This email is already in use.";
  if (code.includes("weak-password")) return "Password should be at least 6 characters.";
  if (code.includes("popup-closed-by-user")) return "Popup closed. Please try again.";
  if (code.includes("popup-blocked")) return "Popup blocked. Trying redirect flow…";
  return err?.message || "Authentication error.";
}

authForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessages();

  const email = emailInput.value.trim();
  const password = passInput.value;

  if (!email || !password) {
    showError("Please fill email and password.");
    return;
  }

  try {
    if (mode === "register") {
      if (password !== confirmInp.value) {
        showError("Passwords do not match.");
        return;
      }
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      try { await updateProfile(cred.user, { displayName: email.split("@")[0] }); } catch {}
      showSuccess("Account created. Redirecting…");
      setTimeout(() => (window.location.href = DASHBOARD_URL), 800);
    } else {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      showSuccess(`Welcome ${cred.user.email}. Redirecting…`);
      setTimeout(() => (window.location.href = DASHBOARD_URL), 600);
    }
  } catch (err) {
    const msg = mapAuthError(err);
    showError(msg);
  }
});

async function socialSignIn(provider, providerName) {
  clearMessages();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    showSuccess(`Welcome ${user.displayName || user.email}. Redirecting…`);
    setTimeout(() => (window.location.href = DASHBOARD_URL), 500);
  } catch (err) {
    const msg = mapAuthError(err);
    // If popup is blocked, try redirect flow
    if (msg.includes("Trying redirect flow")) {
      try {
        await signInWithRedirect(auth, provider);
        return; // browser navigates away; we'll handle on return
      } catch (e) {
        showError(mapAuthError(e));
      }
    } else {
      showError(msg);
    }
  }
}

// Google
googleBtn?.addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      showSuccess(`Welcome ${user.displayName || user.email}. Redirecting…`);
      setTimeout(() => (window.location.href = DASHBOARD_URL), 500);
    })
    .catch(async (err) => {
      const msg = mapAuthError(err);
      if (msg.includes("Trying redirect flow")) {
        await signInWithRedirect(auth, provider);
      } else {
        showError(msg);
      }
    });
});


// Facebook
/*facebookBtn?.addEventListener("click", async () => {
  const provider = new FacebookAuthProvider();
  // provider.addScope("public_profile"); // optional scopes
  await socialSignIn(provider, "Facebook");
});

// Yahoo (OIDC)
yahooBtn?.addEventListener("click", async () => {
  const provider = new OAuthProvider("yahoo.com");
  await socialSignIn(provider, "Yahoo");
});
*/
// Handle return from redirect
try {
  const redirectResult = await getRedirectResult(auth);
  if (redirectResult?.user) {
    showSuccess(`Welcome ${redirectResult.user.displayName || redirectResult.user.email}. Redirecting…`);
    setTimeout(() => (window.location.href = DASHBOARD_URL), 500);
  }
} catch (err) {
  showError(mapAuthError(err));
}


onAuthStateChanged(auth, (user) => {
  // If already logged in and we are on sign page, optionally redirect right away
  if (user) {
    // Uncomment if you want immediate redirect when returning users hit the sign page
    // window.location.href = DASHBOARD_URL;
  }
});

// Default mode
setMode("signin");

