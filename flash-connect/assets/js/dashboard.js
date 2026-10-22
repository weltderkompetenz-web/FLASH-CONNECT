/* ==========================================================================
   FLASH CONNECT - DASHBOARD LOGIC (dashboard.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const user = requireAuth();
  if (!user) return;

  renderWelcomeBanner(user);
  renderDashboardStats(user);
  renderRecentAnnouncements();
  renderUpcomingSchedule();
  renderRecentActivities();
});

function renderWelcomeBanner(user) {
  const nameEl = document.getElementById("dash-user-name");
  const roleEl = document.getElementById("dash-user-role-badge");
  const deptEl = document.getElementById("dash-user-dept");

  if (nameEl) nameEl.textContent = user.fullName;
  if (roleEl) roleEl.textContent = user.roleLabel;
  if (deptEl) deptEl.textContent = `${user.department} • ${user.level || 'FLASH'}`;
}

function renderDashboardStats(user) {
  const students = JSON.parse(localStorage.getItem("fc_students")) || [];
  const courses = JSON.parse(localStorage.getItem("fc_courses")) || [];
  const docRequests = JSON.parse(localStorage.getItem("fc_document_requests")) || [];
  const announcements = JSON.parse(localStorage.getItem("fc_announcements")) || [];

  const totalStudentsEl = document.getElementById("stat-students-count");
  const totalCoursesEl = document.getElementById("stat-courses-count");
  const pendingRequestsEl = document.getElementById("stat-requests-count");
  const totalAnnouncementsEl = document.getElementById("stat-announcements-count");

  if (totalStudentsEl) totalStudentsEl.textContent = students.length;
  if (totalCoursesEl) totalCoursesEl.textContent = courses.length;
  if (pendingRequestsEl) {
    const pendingCount = docRequests.filter(r => r.status === "En attente").length;
    pendingRequestsEl.textContent = pendingCount;
  }
  if (totalAnnouncementsEl) totalAnnouncementsEl.textContent = announcements.length;
}

function renderRecentAnnouncements() {
  const container = document.getElementById("dash-announcements-list");
  if (!container) return;

  const announcements = JSON.parse(localStorage.getItem("fc_announcements")) || [];
  if (announcements.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>Aucune annonce récente.</p></div>`;
    return;
  }

  container.innerHTML = announcements.slice(0, 3).map(anc => `
    <div style="padding: 0.85rem 0; border-bottom: 1px solid var(--border-color);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
        <span class="badge ${anc.important ? 'badge-danger' : 'badge-info'}">${anc.category}</span>
        <small style="color: var(--text-muted);">${anc.date}</small>
      </div>
      <h4 style="font-size: 0.95rem; margin-bottom: 0.25rem;">${anc.title}</h4>
      <p style="font-size: 0.85rem; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
        ${anc.content}
      </p>
    </div>
  `).join('');
}

function renderUpcomingSchedule() {
  const container = document.getElementById("dash-schedule-list");
  if (!container) return;

  const schedule = JSON.parse(localStorage.getItem("fc_timetable")) || [];
  if (schedule.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>Aucun cours prévu aujourd'hui.</p></div>`;
    return;
  }

  container.innerHTML = schedule.slice(0, 3).map(item => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background-color: var(--bg-hover); border-radius: var(--radius-md); margin-bottom: 0.5rem;">
      <div>
        <strong style="font-size: 0.9rem; display: block;">${item.course}</strong>
        <span style="font-size: 0.8rem; color: var(--text-muted);"><i class="fa-solid fa-location-dot"></i> ${item.hall} • ${item.teacher}</span>
      </div>
      <span class="badge badge-primary">${item.time}</span>
    </div>
  `).join('');
}

function renderRecentActivities() {
  const container = document.getElementById("dash-activities-list");
  if (!container) return;

  const logs = JSON.parse(localStorage.getItem("fc_audit_logs")) || [];
  container.innerHTML = logs.slice(0, 4).map(log => `
    <div style="display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.6rem 0; border-bottom: 1px solid var(--border-color);">
      <div style="width: 32px; height: 32px; border-radius: 50%; background-color: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; flex-shrink: 0;">
        <i class="fa-solid fa-clock-rotate-left"></i>
      </div>
      <div style="flex: 1;">
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
          <strong>${log.action}</strong>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${log.timestamp}</span>
        </div>
        <p style="font-size: 0.8rem; margin: 0; color: var(--text-muted);">${log.detail}</p>
      </div>
    </div>
  `).join('');
}
