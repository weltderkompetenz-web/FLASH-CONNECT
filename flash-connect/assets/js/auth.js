/* ==========================================================================
   FLASH CONNECT - AUTHENTICATION & DEMO SESSION MANAGEMENT (auth.js)
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. SESSION MANAGEMENT HELPERS
// --------------------------------------------------------------------------
function getCurrentUser() {
  const sessionStr = localStorage.getItem("fc_active_user") || sessionStorage.getItem("fc_active_user");
  if (sessionStr) {
    try {
      return JSON.parse(sessionStr);
    } catch (e) {
      console.error("Error parsing user session:", e);
    }
  }
  return null;
}

function setCurrentUser(user, remember = false) {
  const userStr = JSON.stringify(user);
  if (remember) {
    localStorage.setItem("fc_active_user", userStr);
  } else {
    sessionStorage.setItem("fc_active_user", userStr);
  }
}

function logout() {
  localStorage.removeItem("fc_active_user");
  sessionStorage.removeItem("fc_active_user");
  showToast("Déconnexion réussie", "info");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 500);
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    // If not logged in and visiting protected dashboard page, set default student for demo ease or redirect
    const defaultStudent = {
      id: "usr_student1",
      matricule: "12345621",
      fullName: "Bio Koffi Sossou",
      email: "koffi.bio@etud.u-parakou.bj",
      role: "student",
      roleLabel: "Étudiant",
      department: "Lettres Modernes",
      level: "Licence 2",
      avatar: "BK"
    };
    setCurrentUser(defaultStudent, true);
    return defaultStudent;
  }
  return user;
}

// --------------------------------------------------------------------------
// 2. QUICK ROLE PRESETS FILLER FOR DEMONSTRATION
// --------------------------------------------------------------------------
function fillRoleCredentials(role) {
  const emailInput = document.getElementById("login-identifier");
  const passwordInput = document.getElementById("login-password");

  if (!emailInput || !passwordInput) return;

  const users = JSON.parse(localStorage.getItem("fc_users")) || [];
  const matchedUser = users.find(u => u.role === role);

  if (matchedUser) {
    emailInput.value = matchedUser.email;
    passwordInput.value = matchedUser.password || "Password123!";
    showToast(`Identifiants raccordés pour le rôle: ${matchedUser.roleLabel}`, "info");
  }
}

// --------------------------------------------------------------------------
// 3. LOGIN & REGISTER FORM HANDLERS
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Setup password visibility toggles
  const togglePassBtns = document.querySelectorAll(".password-toggle-btn");
  togglePassBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling || btn.parentElement.querySelector("input");
      if (input) {
        if (input.type === "password") {
          input.type = "text";
          btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
        } else {
          input.type = "password";
          btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
        }
      }
    });
  });

  // Login Form Handler
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const identifier = document.getElementById("login-identifier").value.trim();
      const password = document.getElementById("login-password").value;
      const remember = document.getElementById("remember-me")?.checked;

      const users = JSON.parse(localStorage.getItem("fc_users")) || [];
      const user = users.find(u => u.email === identifier || u.matricule === identifier);

      if (user) {
        if (user.password === password || password === "Password123!") {
          setCurrentUser(user, remember);
          showToast(`Bienvenue, ${user.fullName} (${user.roleLabel})`, "success");
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 800);
        } else {
          showToast("Mot de passe incorrect.", "danger");
        }
      } else {
        showToast("Identifiant ou email non trouvé.", "danger");
      }
    });
  }

  // Register Form Handler
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fullName = document.getElementById("reg-fullname").value.trim();
      const matricule = document.getElementById("reg-matricule").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const department = document.getElementById("reg-department").value;
      const level = document.getElementById("reg-level").value;
      const password = document.getElementById("reg-password").value;
      const confirmPassword = document.getElementById("reg-confirm-password").value;
      const termsAccepted = document.getElementById("reg-terms")?.checked;

      if (!termsAccepted) {
        showToast("Veuillez accepter les conditions d'utilisation.", "warning");
        return;
      }

      if (password !== confirmPassword) {
        showToast("Les mots de passe ne correspondent pas.", "danger");
        return;
      }

      const users = JSON.parse(localStorage.getItem("fc_users")) || [];
      if (users.some(u => u.email === email || u.matricule === matricule)) {
        showToast("Un compte avec cet email ou ce matricule existe déjà.", "warning");
        return;
      }

      const initials = fullName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
      const newUser = {
        id: "usr_" + Date.now(),
        matricule,
        fullName,
        email,
        role: "student",
        roleLabel: "Étudiant",
        department,
        level,
        password,
        avatar: initials || "ET"
      };

      users.push(newUser);
      localStorage.setItem("fc_users", JSON.stringify(users));

      // Also add to students list
      const students = JSON.parse(localStorage.getItem("fc_students")) || [];
      students.push({
        id: "STU" + (students.length + 1).toString().padStart(3, '0'),
        matricule,
        name: fullName,
        dept: department,
        level,
        status: "Inscrit",
        email,
        gpa: "N/A"
      });
      localStorage.setItem("fc_students", JSON.stringify(students));

      setCurrentUser(newUser, true);
      showToast("Compte créé avec succès ! Redirection...", "success");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    });
  }

  // Populate User Info in Header & Sidebar if on protected page
  updateUserUI();
});

function updateUserUI() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const userNameElements = document.querySelectorAll(".user-name");
  const userRoleElements = document.querySelectorAll(".user-role");
  const userAvatarElements = document.querySelectorAll(".avatar");

  userNameElements.forEach(el => el.textContent = currentUser.fullName);
  userRoleElements.forEach(el => el.textContent = currentUser.roleLabel);
  userAvatarElements.forEach(el => el.textContent = currentUser.avatar || "FC");
}
