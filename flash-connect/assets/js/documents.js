/* ==========================================================================
   FLASH CONNECT - DIGITAL LIBRARY / DOCUMENTS (documents.js)
   ========================================================================== */

let libraryDocs = [];

document.addEventListener("DOMContentLoaded", () => {
  const user = requireAuth();
  if (!user) return;

  loadLibraryDocs();

  const searchInput = document.getElementById("doc-search-input");
  const catFilter = document.getElementById("doc-cat-filter");

  if (searchInput) searchInput.addEventListener("input", filterLibraryDocs);
  if (catFilter) catFilter.addEventListener("change", filterLibraryDocs);
});

function loadLibraryDocs() {
  libraryDocs = JSON.parse(localStorage.getItem("fc_library_documents")) || [];
  renderLibraryGrid(libraryDocs);
}

function filterLibraryDocs() {
  const searchVal = (document.getElementById("doc-search-input")?.value || "").toLowerCase();
  const catVal = document.getElementById("doc-cat-filter")?.value || "ALL";

  const filtered = libraryDocs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchVal) ||
                          doc.category.toLowerCase().includes(searchVal);
    const matchesCat = catVal === "ALL" || doc.category === catVal;

    return matchesSearch && matchesCat;
  });

  renderLibraryGrid(filtered);
}

function renderLibraryGrid(docs) {
  const grid = document.getElementById("library-docs-grid");
  if (!grid) return;

  if (docs.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <i class="fa-solid fa-folder-open"></i>
        <p>Aucun document disponible dans cette catégorie.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = docs.map(doc => `
    <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span class="badge badge-primary">${doc.category}</span>
          <span class="badge badge-info">${doc.format} • ${doc.size}</span>
        </div>
        <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">${doc.title}</h3>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">
          <i class="fa-solid fa-download"></i> Téléchargé ${doc.downloads} fois
        </p>
      </div>
      <button class="btn btn-primary btn-sm" onclick="downloadDoc('${doc.id}', '${doc.title}')">
        <i class="fa-solid fa-download"></i> Télécharger le Fichier
      </button>
    </div>
  `).join('');
}

function downloadDoc(id, title) {
  const idx = libraryDocs.findIndex(d => d.id === id);
  if (idx !== -1) {
    libraryDocs[idx].downloads += 1;
    localStorage.setItem("fc_library_documents", JSON.stringify(libraryDocs));
    renderLibraryGrid(libraryDocs);
  }
  showToast(`Téléchargement de "${title}" en cours...`, "success");
}
