/* ==========================================================================
   FLASH CONNECT - ANNOUNCEMENTS MANAGEMENT (announcements.js)
   ========================================================================== */

let announcementsList = [];

document.addEventListener("DOMContentLoaded", () => {
  const user = requireAuth();
  if (!user) return;

  loadAnnouncements();

  const searchInput = document.getElementById("anc-search-input");
  const catFilter = document.getElementById("anc-cat-filter");

  if (searchInput) searchInput.addEventListener("input", filterAnnouncements);
  if (catFilter) catFilter.addEventListener("change", filterAnnouncements);

  const ancForm = document.getElementById("anc-form");
  if (ancForm) {
    ancForm.addEventListener("submit", handleCreateAnnouncement);
  }
});

function loadAnnouncements() {
  announcementsList = JSON.parse(localStorage.getItem("fc_announcements")) || [];
  renderAnnouncementsCards(announcementsList);
}

function filterAnnouncements() {
  const searchVal = (document.getElementById("anc-search-input")?.value || "").toLowerCase();
  const catVal = document.getElementById("anc-cat-filter")?.value || "ALL";

  const filtered = announcementsList.filter(anc => {
    const matchesSearch = anc.title.toLowerCase().includes(searchVal) ||
                          anc.content.toLowerCase().includes(searchVal) ||
                          anc.author.toLowerCase().includes(searchVal);
    const matchesCat = catVal === "ALL" || anc.category === catVal;

    return matchesSearch && matchesCat;
  });

  renderAnnouncementsCards(filtered);
}

function renderAnnouncementsCards(list) {
  const container = document.getElementById("announcements-container");
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <i class="fa-solid fa-bullhorn"></i>
        <p>Aucun communiqué trouvé.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(anc => `
    <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
          <span class="badge ${anc.important ? 'badge-danger' : 'badge-info'}">${anc.category}</span>
          <small style="color: var(--text-muted); font-size: 0.8rem;"><i class="fa-regular fa-clock"></i> ${anc.date}</small>
        </div>
        <h3 style="font-size: 1.15rem; margin-bottom: 0.6rem;">${anc.title}</h3>
        <p style="font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.6;">${anc.content}</p>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.85rem; font-size: 0.8rem; color: var(--text-muted);">
        <span><i class="fa-solid fa-user-pen"></i> ${anc.author}</span>
        <button class="btn btn-outline-primary btn-sm" onclick="showToast('Rappel enregistré pour cette annonce', 'info')">
          <i class="fa-regular fa-bookmark"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function openCreateAncModal() {
  document.getElementById("anc-form").reset();
  document.getElementById("anc-modal").classList.add("active");
}

function closeCreateAncModal() {
  document.getElementById("anc-modal").classList.remove("active");
}

function handleCreateAnnouncement(e) {
  e.preventDefault();
  const title = document.getElementById("anc-title").value.trim();
  const category = document.getElementById("anc-category").value;
  const author = document.getElementById("anc-author").value.trim() || "Direction FLASH";
  const content = document.getElementById("anc-content").value.trim();
  const important = document.getElementById("anc-important")?.checked || false;

  const todayStr = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const newAnc = {
    id: "ANC-" + Date.now().toString().slice(-4),
    title,
    category,
    date: todayStr,
    author,
    content,
    important
  };

  announcementsList.unshift(newAnc);
  localStorage.setItem("fc_announcements", JSON.stringify(announcementsList));

  showToast("Communiqué officiel publié avec succès !", "success");
  closeCreateAncModal();
  loadAnnouncements();
}
