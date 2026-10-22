/* ==========================================================================
   FLASH CONNECT - COURSES & SYLLABUS MANAGEMENT (courses.js)
   ========================================================================== */

let coursesList = [];

document.addEventListener("DOMContentLoaded", () => {
  const user = requireAuth();
  if (!user) return;

  loadCourses();

  const searchInput = document.getElementById("course-search-input");
  const deptFilter = document.getElementById("course-dept-filter");

  if (searchInput) searchInput.addEventListener("input", filterCourses);
  if (deptFilter) deptFilter.addEventListener("change", filterCourses);
});

function loadCourses() {
  coursesList = JSON.parse(localStorage.getItem("fc_courses")) || [];
  renderCoursesGrid(coursesList);
}

function filterCourses() {
  const searchVal = (document.getElementById("course-search-input")?.value || "").toLowerCase();
  const deptVal = document.getElementById("course-dept-filter")?.value || "ALL";

  const filtered = coursesList.filter(crs => {
    const matchesSearch = crs.title.toLowerCase().includes(searchVal) ||
                          crs.code.toLowerCase().includes(searchVal) ||
                          crs.teacher.toLowerCase().includes(searchVal);
    const matchesDept = deptVal === "ALL" || crs.dept === deptVal;

    return matchesSearch && matchesDept;
  });

  renderCoursesGrid(filtered);
}

function renderCoursesGrid(courses) {
  const grid = document.getElementById("courses-grid");
  if (!grid) return;

  if (courses.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1;" class="empty-state">
        <i class="fa-solid fa-book-bookmark"></i>
        <p>Aucun cours ne correspond à votre recherche.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = courses.map(crs => `
    <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <span class="badge badge-primary">${crs.code}</span>
          <span class="badge badge-info">${crs.credits} Crédits ECTS</span>
        </div>
        <h3 style="font-size: 1.15rem; margin-bottom: 0.5rem;">${crs.title}</h3>
        <p style="font-size: 0.85rem; margin-bottom: 0.5rem;">
          <i class="fa-solid fa-user-tie" style="color:var(--text-muted); margin-right:0.25rem;"></i> ${crs.teacher}
        </p>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">
          ${crs.dept} • ${crs.level} • ${crs.hours}h de cours
        </p>
      </div>

      <div style="display: flex; gap: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 0.85rem;">
        <button class="btn btn-outline-primary btn-sm" style="flex:1;" onclick="openCourseDetailModal('${crs.id}')">
          <i class="fa-solid fa-circle-info"></i> Détails UE
        </button>
        <button class="btn btn-accent btn-sm" onclick="downloadSyllabus('${crs.code}')" title="Télécharger le syllabus">
          <i class="fa-solid fa-download"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function openCourseDetailModal(id) {
  const crs = coursesList.find(c => c.id === id);
  if (!crs) return;

  document.getElementById("modal-crs-title").textContent = `${crs.code} - ${crs.title}`;
  document.getElementById("modal-crs-body").innerHTML = `
    <div style="line-height: 1.8; font-size: 0.9rem;">
      <p><strong>Département :</strong> ${crs.dept}</p>
      <p><strong>Niveau Pédagogique :</strong> ${crs.level}</p>
      <p><strong>Enseignant Responsable :</strong> ${crs.teacher}</p>
      <p><strong>Volume Horaire :</strong> ${crs.hours} Heures Magistrales / Travaux Dirigés</p>
      <p><strong>Valeur en Crédits :</strong> ${crs.credits} ECTS</p>
      <hr style="margin: 1rem 0; border: none; border-top: 1px solid var(--border-color);">
      <h4>Objectifs du Cours & Plan de Cours :</h4>
      <p>Ce cours propose une étude approfondie des concepts fondamentaux. Il vise à développer la réflexion critique, l'analyse textuelle et méthodologique nécessaire aux étudiants de la FLASH.</p>
    </div>
  `;
  document.getElementById("course-detail-modal").classList.add("active");
}

function closeCourseDetailModal() {
  document.getElementById("course-detail-modal").classList.remove("active");
}

function downloadSyllabus(code) {
  showToast(`Téléchargement du syllabus officiel pour ${code}...`, "success");
}
