/* ==========================================================================
   FLASH CONNECT - STUDENTS MANAGEMENT (students.js)
   ========================================================================== */

let currentStudentsList = [];

document.addEventListener("DOMContentLoaded", () => {
  const user = requireAuth();
  if (!user) return;

  loadStudents();

  // Search & Filter Listeners
  const searchInput = document.getElementById("student-search-input");
  const deptFilter = document.getElementById("student-dept-filter");
  const levelFilter = document.getElementById("student-level-filter");

  if (searchInput) searchInput.addEventListener("input", filterStudents);
  if (deptFilter) deptFilter.addEventListener("change", filterStudents);
  if (levelFilter) levelFilter.addEventListener("change", filterStudents);

  // Form Submit Handler
  const studentForm = document.getElementById("student-form");
  if (studentForm) {
    studentForm.addEventListener("submit", handleStudentSave);
  }
});

function loadStudents() {
  currentStudentsList = JSON.parse(localStorage.getItem("fc_students")) || [];
  renderStudentsTable(currentStudentsList);
}

function filterStudents() {
  const searchVal = (document.getElementById("student-search-input")?.value || "").toLowerCase();
  const deptVal = document.getElementById("student-dept-filter")?.value || "ALL";
  const levelVal = document.getElementById("student-level-filter")?.value || "ALL";

  const filtered = currentStudentsList.filter(stu => {
    const matchesSearch = stu.name.toLowerCase().includes(searchVal) ||
                          stu.matricule.toLowerCase().includes(searchVal) ||
                          stu.email.toLowerCase().includes(searchVal);
    const matchesDept = deptVal === "ALL" || stu.dept === deptVal;
    const matchesLevel = levelVal === "ALL" || stu.level === levelVal;

    return matchesSearch && matchesDept && matchesLevel;
  });

  renderStudentsTable(filtered);
}

function renderStudentsTable(students) {
  const tbody = document.getElementById("students-tbody");
  if (!tbody) return;

  if (students.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <i class="fa-solid fa-user-slash"></i>
            <p>Aucun étudiant trouvé.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = students.map(stu => `
    <tr>
      <td><strong>${stu.matricule}</strong></td>
      <td>
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <div class="avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">${stu.name.substring(0,2).toUpperCase()}</div>
          <div>
            <div style="font-weight: 600;">${stu.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${stu.email}</div>
          </div>
        </div>
      </td>
      <td>${stu.dept}</td>
      <td><span class="badge badge-primary">${stu.level}</span></td>
      <td><strong>${stu.gpa || '14.00'} / 20</strong></td>
      <td><span class="badge ${stu.status === 'Inscrit' ? 'badge-success' : 'badge-warning'}">${stu.status}</span></td>
      <td>
        <button class="btn btn-outline btn-sm btn-icon" onclick="openEditStudentModal('${stu.id}')" title="Modifier">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function openAddStudentModal() {
  document.getElementById("student-form").reset();
  document.getElementById("student-id-field").value = "";
  document.getElementById("modal-student-title").textContent = "Ajouter un Étudiant";
  document.getElementById("student-modal").classList.add("active");
}

function openEditStudentModal(id) {
  const stu = currentStudentsList.find(s => s.id === id);
  if (!stu) return;

  document.getElementById("student-id-field").value = stu.id;
  document.getElementById("stu-name").value = stu.name;
  document.getElementById("stu-matricule").value = stu.matricule;
  document.getElementById("stu-email").value = stu.email;
  document.getElementById("stu-dept").value = stu.dept;
  document.getElementById("stu-level").value = stu.level;
  document.getElementById("stu-gpa").value = stu.gpa || "14.00";
  document.getElementById("stu-status").value = stu.status || "Inscrit";

  document.getElementById("modal-student-title").textContent = "Modifier l'Étudiant";
  document.getElementById("student-modal").classList.add("active");
}

function closeStudentModal() {
  document.getElementById("student-modal").classList.remove("active");
}

function handleStudentSave(e) {
  e.preventDefault();
  const id = document.getElementById("student-id-field").value;
  const name = document.getElementById("stu-name").value.trim();
  const matricule = document.getElementById("stu-matricule").value.trim();
  const email = document.getElementById("stu-email").value.trim();
  const dept = document.getElementById("stu-dept").value;
  const level = document.getElementById("stu-level").value;
  const gpa = document.getElementById("stu-gpa").value.trim();
  const status = document.getElementById("stu-status").value;

  if (id) {
    // Edit mode
    const idx = currentStudentsList.findIndex(s => s.id === id);
    if (idx !== -1) {
      currentStudentsList[idx] = { id, matricule, name, dept, level, status, email, gpa };
      showToast("Étudiant mis à jour avec succès", "success");
    }
  } else {
    // Add mode
    const newId = "STU" + (currentStudentsList.length + 1).toString().padStart(3, '0');
    currentStudentsList.push({ id: newId, matricule, name, dept, level, status, email, gpa });
    showToast("Nouvel étudiant ajouté avec succès", "success");
  }

  localStorage.setItem("fc_students", JSON.stringify(currentStudentsList));
  closeStudentModal();
  loadStudents();
}
