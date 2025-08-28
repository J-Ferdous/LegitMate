 function toggleMenu() {
  const nav = document.querySelector('nav');
  const toggle = document.querySelector('.menu-toggle');

  nav.classList.toggle('active');
  toggle.classList.toggle('active');

  // update aria-expanded for accessibility
  const expanded = toggle.classList.contains('active');
  toggle.setAttribute('aria-expanded', expanded);
}

// js/shared.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// <-- Use the same config you already have in sign.js -->
const firebaseConfig = {
  apiKey: "AIzaSyCPaYAW_OgQ7ch1EvM2DvXR2L3qBoOl-lM",
  authDomain: "legitmate-e5b35.firebaseapp.com",
  projectId: "legitmate-e5b35",
  appId: "1:843217845569:web:52297b376df0fcb65c35c0",
};

// init Firebase for this page
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  if (!nav) return;
  const registerSelector = ".register";

  // helper: create avatar node
  function createAvatarNode(user) {
    const wrapper = document.createElement("div");
    wrapper.className = "avatar-wrapper";

    const avatarBtn = document.createElement("button");
    avatarBtn.type = "button";
    avatarBtn.className = "user-avatar";
    avatarBtn.title = user.displayName || user.email || "User";

    if (user.photoURL) {
      const img = document.createElement("img");
      img.src = user.photoURL;
      img.alt = "avatar";
      avatarBtn.appendChild(img);
    } else {
      avatarBtn.textContent = (user.displayName || user.email || "U").charAt(0).toUpperCase();
    }

    // menu
    const menu = document.createElement("div");
    menu.className = "avatar-menu hidden";
    menu.innerHTML = `
      <button class="menu-item" id="avatar-logout">Logout</button>
    `;

    // toggle menu
    avatarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("hidden");
    });

    // logout handler
    menu.addEventListener("click", (e) => {
      if (e.target && e.target.id === "avatar-logout") {
        signOut(auth).then(() => {
          // close menu and optionally reload to show Register link
          menu.classList.add("hidden");
          // Reload to update UI (or you can programmatically restore register)
          window.location.reload();
        }).catch(err => {
          console.error("Sign out failed:", err);
        });
      }
    });

    // close menu when clicking outside
    document.addEventListener("click", () => {
      if (!menu.classList.contains("hidden")) menu.classList.add("hidden");
    });

    wrapper.appendChild(avatarBtn);
    wrapper.appendChild(menu);
    return wrapper;
  }

  // Listen for auth state changes
  onAuthStateChanged(auth, (user) => {
    // remove any existing avatar wrapper
    const existingAvatar = nav.querySelector(".avatar-wrapper");
    if (existingAvatar) existingAvatar.remove();

    // find register link (if exists)
    const regLink = nav.querySelector(registerSelector);

    if (user) {
      // if register link exists, remove it (we will append avatar)
      if (regLink) regLink.remove();

      // append avatar
      const avatarNode = createAvatarNode(user);
      nav.appendChild(avatarNode);
    } else {
      // if signed out and register link not present, add it back
      if (!nav.querySelector(registerSelector)) {
        const a = document.createElement("a");
        a.className = "register";
        a.href = "sign.html";
        a.textContent = "Register/Login";
        nav.appendChild(a);
      }
    }
  });
});

const startBtn = document.getElementById("startBtn");

if (startBtn) {
  startBtn.addEventListener("click", () => {
    const auth = getAuth(); // from your initialized app
    const user = auth.currentUser;

    if (user) {
      // ✅ User is logged in
      window.location.href = "job.html";
    } else {
      // ❌ User is NOT logged in
      window.location.href = "sign.html";
    }
  });
}


