/* ==========================================================================
   FLASH CONNECT - MAIN CORE UTILITIES & MOCK DATA (main.js)
   Faculté des Lettres, Arts et Sciences Humaines - Université de Parakou
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. MOCK DATA INITIALIZATION (LOCALSTORAGE SEEDING)
// --------------------------------------------------------------------------
const MOCK_USERS = [
  {
    id: "usr_student1",
    matricule: "12345621",
    fullName: "Bio Koffi Sossou",
    email: "koffi.bio@etud.u-parakou.bj",
    role: "student",
    roleLabel: "Étudiant",
    department: "Lettres Modernes",
    level: "Licence 2",
    password: "Password123!",
    avatar: "BK"
  },
  {
    id: "usr_teacher1",
    matricule: "ENS98231",
    fullName: "Prof. Ibrahim Alassane",
    email: "ibrahim.alassane@u-parakou.bj",
    role: "teacher",
    roleLabel: "Enseignant / Bâtiment Académique",
    department: "Lettres Modernes",
    level: "Tous niveaux",
    password: "Password123!",
    avatar: "IA"
  },
  {
    id: "usr_approver1",
    matricule: "APP44120",
    fullName: "Dr. Marie-Claire Dossou",
    email: "marie.dossou@u-parakou.bj",
    role: "approver",
    roleLabel: "Valideur de Documents",
    department: "Service Scolarité FLASH",
    level: "Administration",
    password: "Password123!",
    avatar: "MD"
  },
  {
    id: "usr_admin1",
    matricule: "ADM00001",
    fullName: "Administrateur Système FLASH",
    email: "admin.flash@u-parakou.bj",
    role: "admin",
    roleLabel: "Administrateur Système",
    department: "Direction FLASH",
    level: "Global",
    password: "Password123!",
    avatar: "AD"
  },
  {
    id: "usr_auditor1",
    matricule: "AUD99812",
    fullName: "Auditeur Externe Académique",
    email: "auditeur@u-parakou.bj",
    role: "auditor",
    roleLabel: "Auditeur / Contrôleur",
    department: "Inspection Académique",
    level: "Consultation",
    password: "Password123!",
    avatar: "AU"
  }
];

const MOCK_STUDENTS = [
  { id: "STU001", matricule: "12345621", name: "Bio Koffi Sossou", dept: "Lettres Modernes", level: "L2", status: "Inscrit", email: "koffi.bio@etud.u-parakou.bj", gpa: "15.20" },
  { id: "STU002", matricule: "12345622", name: "Aïchatou Gbaguidi", dept: "Anglais", level: "L3", status: "Inscrit", email: "aichatou.g@etud.u-parakou.bj", gpa: "16.80" },
  { id: "STU003", matricule: "12345623", name: "Codjo Fabrice Mensah", dept: "Géographie", level: "L1", status: "En attente", email: "fabrice.m@etud.u-parakou.bj", gpa: "12.50" },
  { id: "STU004", matricule: "12345624", name: "Séfakor Lawson", dept: "Sociologie", level: "Master 1", status: "Inscrit", email: "sefakor.l@etud.u-parakou.bj", gpa: "14.90" },
  { id: "STU005", matricule: "12345625", name: "Nadine Worou", dept: "Histoire & Archéologie", level: "L2", status: "Inscrit", email: "nadine.w@etud.u-parakou.bj", gpa: "13.40" }
];

const MOCK_COURSES = [
  { id: "LIT201", code: "LM-201", title: "Littérature Africaine Francophone", dept: "Lettres Modernes", level: "Licence 2", teacher: "Prof. Ibrahim Alassane", credits: 4, hours: 45, status: "Actif" },
  { id: "LING202", code: "LM-202", title: "Linguistique Générale & Syntaxique", dept: "Lettres Modernes", level: "Licence 2", teacher: "Dr. Marie-Claire Dossou", credits: 3, hours: 30, status: "Actif" },
  { id: "ANG301", code: "ANG-301", title: "Advanced English Prose & Stylistics", dept: "Anglais", level: "Licence 3", teacher: "Dr. John Kpodar", credits: 5, hours: 50, status: "Actif" },
  { id: "GEO101", code: "GEO-101", title: "Cartographie et Géomorphologie", dept: "Géographie", level: "Licence 1", teacher: "Prof. Chabi Yayi", credits: 4, hours: 40, status: "Actif" },
  { id: "SOC401", code: "SOC-401", title: "Sociologie du Développement Rural", dept: "Sociologie", level: "Master 1", teacher: "Dr. Mireille Kora", credits: 6, hours: 60, status: "Actif" }
];

const MOCK_TIMETABLE = [
  { day: "Lundi", time: "08h00 - 11h00", course: "LM-201 Littérature Africaine", hall: "Amphi 1000", teacher: "Prof. Alassane", level: "Licence 2" },
  { day: "Lundi", time: "11h15 - 13h15", course: "LM-202 Linguistique Générale", hall: "Salle B12", teacher: "Dr. Dossou", level: "Licence 2" },
  { day: "Mardi", time: "08h00 - 11h00", course: "ANG-301 Advanced Stylistics", hall: "Amphi B", teacher: "Dr. Kpodar", level: "Licence 3" },
  { day: "Mercredi", time: "14h00 - 17h00", course: "GEO-101 Cartographie", hall: "Labo Géographie", teacher: "Prof. Yayi", level: "Licence 1" },
  { day: "Jeudi", time: "09h00 - 12h00", course: "SOC-401 Sociologie Rurale", hall: "Salle M1", teacher: "Dr. Kora", level: "Master 1" }
];

const MOCK_ANNOUNCEMENTS = [
  {
    id: "ANC-001",
    title: "Calendrier Officiel des Examens du 1er Semestre",
    category: "Académique",
    date: "18 Octobre 2026",
    author: "Doyen de la FLASH",
    content: "Les examens de fin de premier semestre débuteront le lundi 10 novembre 2026. Merci de vérifier vos inscriptions pédagogiques auprès du service scolarité.",
    important: true
  },
  {
    id: "ANC-002",
    title: "Ouverture des Demandes de Relevés de Notes en Ligne",
    category: "Administratif",
    date: "15 Octobre 2026",
    author: "Service Scolarité",
    content: "Désormais, toutes les demandes d'attestation et de relevés de notes se font exclusivement sur la plateforme FLASH CONNECT.",
    important: false
  },
  {
    id: "ANC-003",
    title: "Conférence Débat : Les Enjeux de la Littérature Béninoise",
    category: "Événement",
    date: "12 Octobre 2026",
    author: "Département Lettres Modernes",
    content: "Une grande conférence aura lieu le vendredi 24 octobre à l'Amphi 1000 avec la participation de plusieurs écrivains nationaux.",
    important: false
  }
];

const MOCK_DOCUMENT_REQUESTS = [
  {
    id: "REQ-2026-001",
    studentName: "Bio Koffi Sossou",
    studentMatricule: "12345621",
    docType: "Attestation de Succès",
    reason: "Poursuite d'études en Master",
    requestDate: "16 Octobre 2026",
    status: "En attente",
    approverNote: ""
  },
  {
    id: "REQ-2026-002",
    studentName: "Aïchatou Gbaguidi",
    studentMatricule: "12345622",
    docType: "Relevé de Notes (L2)",
    reason: "Dossier de Bourse",
    requestDate: "14 Octobre 2026",
    status: "Approuvé",
    approverNote: "Vérifié et signé par le Secrétariat."
  },
  {
    id: "REQ-2026-003",
    studentName: "Codjo Fabrice Mensah",
    studentMatricule: "12345623",
    docType: "Certificat de Scolarité",
    reason: "Démarche Administrative",
    requestDate: "10 Octobre 2026",
    status: "Rejeté",
    approverNote: "Incomplet : Merci de régulariser la quittance d'inscription."
  }
];

const MOCK_LIBRARY_DOCUMENTS = [
  { id: "DOC-01", title: "Guide de l'Étudiant FLASH 2026-2027", category: "Guide Officiel", format: "PDF", size: "2.4 MB", downloads: 342 },
  { id: "DOC-02", title: "Règlement Intérieur de l'Université de Parakou", category: "Règlement", format: "PDF", size: "1.1 MB", downloads: 890 },
  { id: "DOC-03", title: "Syllabus Général LM-201 Littérature Africaine", category: "Syllabus", format: "PDF", size: "850 KB", downloads: 156 },
  { id: "DOC-04", title: "Formulaire de Réclamation de Notes", category: "Formulaire", format: "DOCX", size: "120 KB", downloads: 412 }
];

const MOCK_TEACHERS = [
  { id: "TCH-01", name: "Prof. Ibrahim Alassane", rank: "Professeur Titulaire", dept: "Lettres Modernes", email: "ibrahim.alassane@u-parakou.bj", office: "Bâtiment A - Bureau 12", officeHours: "Mardi & Jeudi : 10h - 12h" },
  { id: "TCH-02", name: "Dr. Marie-Claire Dossou", rank: "Maître de Conférences", dept: "Linguistique", email: "marie.dossou@u-parakou.bj", office: "Bâtiment B - Bureau 05", officeHours: "Lundi : 14h - 16h" },
  { id: "TCH-03", name: "Dr. John Kpodar", rank: "Maître-Assistant", dept: "Anglais", email: "john.kpodar@u-parakou.bj", office: "Bâtiment C - Bureau 08", officeHours: "Mercredi : 09h - 11h" },
  { id: "TCH-04", name: "Prof. Chabi Yayi", rank: "Professeur Titulaire", dept: "Géographie", email: "chabi.yayi@u-parakou.bj", office: "Bâtiment A - Bureau 02", officeHours: "Vendredi : 10h - 12h" }
];

const MOCK_AUDIT_LOGS = [
  { id: "LOG-101", timestamp: "2026-10-18 14:23", user: "admin.flash@u-parakou.bj", action: "Connexion réussie", detail: "Session Administrateur active" },
  { id: "LOG-102", timestamp: "2026-10-18 12:10", user: "marie.dossou@u-parakou.bj", action: "Validation de Document", detail: "Approbation Relevé de notes REQ-2026-002" },
  { id: "LOG-103", timestamp: "2026-10-18 09:45", user: "koffi.bio@etud.u-parakou.bj", action: "Nouvelle Demande", detail: "Soumission de demande Attestation REQ-2026-001" }
];

// Seed function
function initLocalStorageData() {
  if (!localStorage.getItem("fc_users")) {
    localStorage.setItem("fc_users", JSON.stringify(MOCK_USERS));
  }
  if (!localStorage.getItem("fc_students")) {
    localStorage.setItem("fc_students", JSON.stringify(MOCK_STUDENTS));
  }
  if (!localStorage.getItem("fc_courses")) {
    localStorage.setItem("fc_courses", JSON.stringify(MOCK_COURSES));
  }
  if (!localStorage.getItem("fc_timetable")) {
    localStorage.setItem("fc_timetable", JSON.stringify(MOCK_TIMETABLE));
  }
  if (!localStorage.getItem("fc_announcements")) {
    localStorage.setItem("fc_announcements", JSON.stringify(MOCK_ANNOUNCEMENTS));
  }
  if (!localStorage.getItem("fc_document_requests")) {
    localStorage.setItem("fc_document_requests", JSON.stringify(MOCK_DOCUMENT_REQUESTS));
  }
  if (!localStorage.getItem("fc_library_documents")) {
    localStorage.setItem("fc_library_documents", JSON.stringify(MOCK_LIBRARY_DOCUMENTS));
  }
  if (!localStorage.getItem("fc_teachers")) {
    localStorage.setItem("fc_teachers", JSON.stringify(MOCK_TEACHERS));
  }
  if (!localStorage.getItem("fc_audit_logs")) {
    localStorage.setItem("fc_audit_logs", JSON.stringify(MOCK_AUDIT_LOGS));
  }
}

// Execute seed on load
initLocalStorageData();

// --------------------------------------------------------------------------
// 2. THEME (DARK / LIGHT MODE) HANDLER
// --------------------------------------------------------------------------
function initTheme() {
  const savedTheme = localStorage.getItem("fc_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcons(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("fc_theme", newTheme);
  updateThemeIcons(newTheme);
  showToast(`Mode ${newTheme === "dark" ? "Sombre" : "Clair"} activé`, "info");
}

function updateThemeIcons(theme) {
  const toggleBtns = document.querySelectorAll(".theme-toggle-btn");
  toggleBtns.forEach(btn => {
    if (theme === "dark") {
      btn.innerHTML = '<i class="fa-solid fa-sun" title="Passer en mode clair"></i>';
    } else {
      btn.innerHTML = '<i class="fa-solid fa-moon" title="Passer en mode sombre"></i>';
    }
  });
}

// --------------------------------------------------------------------------
// 3. TOAST NOTIFICATION SYSTEM
// --------------------------------------------------------------------------
function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let iconClass = "fa-circle-info";
  if (type === "success") iconClass = "fa-circle-check";
  if (type === "danger") iconClass = "fa-circle-xmark";
  if (type === "warning") iconClass = "fa-triangle-exclamation";

  toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// --------------------------------------------------------------------------
// 4. UI EVENT LISTENERS & SIDEBAR TOGGLE
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initTheme();

  // Mobile sidebar toggles
  const mobileToggleBtn = document.getElementById("mobile-sidebar-toggle");
  const sidebar = document.querySelector(".app-sidebar");
  let overlay = document.querySelector(".sidebar-overlay");

  if (!overlay && sidebar) {
    overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);
  }

  if (mobileToggleBtn && sidebar) {
    mobileToggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("show");
      if (overlay) overlay.classList.toggle("show");
    });

    if (overlay) {
      overlay.addEventListener("click", () => {
        sidebar.classList.remove("show");
        overlay.classList.remove("show");
      });
    }
  }

  // Bind all theme toggle buttons
  const themeToggleBtns = document.querySelectorAll(".theme-toggle-btn");
  themeToggleBtns.forEach(btn => {
    btn.addEventListener("click", toggleTheme);
  });
});
