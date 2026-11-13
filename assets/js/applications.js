/**
 * Riwayat Cari Kerja - Applications Management Module
 * Mengelola tabel data lamaran, pencarian, filter status & sistem kerja, pengurutan, CRUD modal
 */

const Applications = {
  // State filter & sort
  state: {
    searchQuery: '',
    statusFilter: 'all',
    workModeFilter: 'all',
    sortOrder: 'desc', // 'desc' = terbaru, 'asc' = terlama
    currentEditId: null,
    deleteTargetId: null
  },

  /**
   * Inisialisasi event listener dan render tabel
   */
  init() {
    this.bindEvents();
    this.renderTable();
  },

  /**
   * Menghubungkan event listener ke elemen DOM
   */
  bindEvents() {
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.state.searchQuery = e.target.value.toLowerCase().trim();
        this.renderTable();
      });
    }

    // Status filter
    const statusFilter = document.getElementById('filter-status');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.state.statusFilter = e.target.value;
        this.renderTable();
      });
    }

    // Work mode filter
    const workModeFilter = document.getElementById('filter-workmode');
    if (workModeFilter) {
      workModeFilter.addEventListener('change', (e) => {
        this.state.workModeFilter = e.target.value;
        this.renderTable();
      });
    }

    // Sort order
    const sortOrder = document.getElementById('sort-date');
    if (sortOrder) {
      sortOrder.addEventListener('change', (e) => {
        this.state.sortOrder = e.target.value;
        this.renderTable();
      });
    }

    // Reset filter button
    const btnReset = document.getElementById('btn-reset-filter');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.resetFilters();
      });
    }

    // Form submit
    const appForm = document.getElementById('application-form');
    if (appForm) {
      appForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }

    // Modal open buttons
    const btnAddApp = document.getElementById('btn-add-application');
    if (btnAddApp) {
      btnAddApp.addEventListener('click', () => {
        this.openAddModal();
      });
    }

    const btnAddEmpty = document.getElementById('btn-add-from-empty');
    if (btnAddEmpty) {
      btnAddEmpty.addEventListener('click', () => {
        this.openAddModal();
      });
    }

    // Modal close buttons
    const btnCloseModal = document.getElementById('btn-close-modal');
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', () => {
        this.closeModal();
      });
    }

    const btnCancelModal = document.getElementById('btn-cancel-modal');
    if (btnCancelModal) {
      btnCancelModal.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Confirm delete modal buttons
    const btnCancelDelete = document.getElementById('btn-cancel-delete');
    if (btnCancelDelete) {
      btnCancelDelete.addEventListener('click', () => {
        this.closeDeleteModal();
      });
    }

    const btnConfirmDelete = document.getElementById('btn-confirm-delete');
    if (btnConfirmDelete) {
      btnConfirmDelete.addEventListener('click', () => {
        this.handleDeleteConfirm();
      });
    }

    // Detail modal close
    const btnCloseDetail = document.getElementById('btn-close-detail');
    if (btnCloseDetail) {
      btnCloseDetail.addEventListener('click', () => {
        this.closeDetailModal();
      });
    }
  },

  /**
   * Reset semua filter ke kondisi awal
   */
  resetFilters() {
    this.state.searchQuery = '';
    this.state.statusFilter = 'all';
    this.state.workModeFilter = 'all';
    this.state.sortOrder = 'desc';

    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('filter-status');
    const workModeFilter = document.getElementById('filter-workmode');
    const sortOrder = document.getElementById('sort-date');

    if (searchInput) searchInput.value = '';
    if (statusFilter) statusFilter.value = 'all';
    if (workModeFilter) workModeFilter.value = 'all';
    if (sortOrder) sortOrder.value = 'desc';

    this.renderTable();
    App.showToast('Filter telah direset', 'info');
  },

  /**
   * Mendapatkan daftar lamaran yang telah difilter & disortir
   */
  getFilteredApplications() {
    let list = Storage.getAll();

    // 1. Filter Pencarian: Nama Perusahaan atau Posisi
    if (this.state.searchQuery) {
      const q = this.state.searchQuery;
      list = list.filter(item => 
        (item.companyName && item.companyName.toLowerCase().includes(q)) ||
        (item.position && item.position.toLowerCase().includes(q))
      );
    }

    // 2. Filter Status
    if (this.state.statusFilter && this.state.statusFilter !== 'all') {
      list = list.filter(item => item.status === this.state.statusFilter);
    }

    // 3. Filter Sistem Kerja
    if (this.state.workModeFilter && this.state.workModeFilter !== 'all') {
      list = list.filter(item => item.workMode === this.state.workModeFilter);
    }

    // 4. Sort berdasarkan tanggal melamar
    list.sort((a, b) => {
      const dateA = new Date(a.applicationDate || a.createdAt);
      const dateB = new Date(b.applicationDate || b.createdAt);
      if (this.state.sortOrder === 'asc') {
        return dateA - dateB;
      }
      return dateB - dateA;
    });

    return list;
  },

  /**
   * Render data ke tabel HTML
   */
  renderTable() {
    const tableBody = document.getElementById('applications-table-body');
    const tableContainer = document.getElementById('applications-table-container');
    const emptyState = document.getElementById('applications-empty-state');
    const countBadge = document.getElementById('applications-count-badge');

    if (!tableBody) return;

    const filtered = this.getFilteredApplications();
    const allApps = Storage.getAll();

    if (countBadge) {
      countBadge.textContent = `${filtered.length} dari ${allApps.length} Lamaran`;
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = '';
      if (tableContainer) tableContainer.style.display = 'none';
      if (emptyState) {
        emptyState.style.display = 'block';
        const emptyMsg = document.getElementById('empty-state-message');
        if (emptyMsg) {
          if (allApps.length === 0) {
            emptyMsg.textContent = 'Belum ada data lamaran yang dicatat. Klik tombol di bawah untuk menambahkan!';
          } else {
            emptyMsg.textContent = 'Tidak ditemukan lamaran yang sesuai dengan pencarian atau filter Anda.';
          }
        }
      }
      return;
    }

    if (tableContainer) tableContainer.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';

    tableBody.innerHTML = filtered.map((app, index) => {
      const statusBadge = Dashboard.createStatusBadge(app.status);
      const workModeBadge = Dashboard.createWorkModeBadge(app.workMode);
      const formattedDate = Dashboard.formatDate(app.applicationDate);
      const sourceDisplay = this.formatJobSource(app.jobSource);

      return `
        <tr data-id="${app.id}">
          <td class="text-center font-medium text-slate-400">${index + 1}</td>
          <td>
            <div class="font-semibold text-slate-800">${this.escapeHTML(app.companyName)}</div>
            ${app.notes ? `<span class="inline-flex items-center text-xs text-slate-400 cursor-pointer hover:text-slate-600 mt-0.5" onclick="Applications.showDetail('${app.id}')" title="Klik untuk melihat catatan"><i data-lucide="file-text" class="w-3.5 h-3.5 inline mr-1"></i> Ada Catatan</span>` : ''}
          </td>
          <td class="text-slate-700">${this.escapeHTML(app.position)}</td>
          <td class="text-slate-600">${this.escapeHTML(app.location) || '<span class="text-slate-400">-</span>'}</td>
          <td>${workModeBadge}</td>
          <td class="whitespace-nowrap text-slate-600">${formattedDate}</td>
          <td class="text-slate-600 max-w-[180px] truncate">${sourceDisplay}</td>
          <td>${statusBadge}</td>
          <td>
            <div class="table-actions">
              <button class="btn-action btn-action-detail" onclick="Applications.showDetail('${app.id}')" title="Detail & Catatan">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
              <button class="btn-action btn-action-edit" onclick="Applications.openEditModal('${app.id}')" title="Edit Lamaran">
                <i data-lucide="pencil" class="w-4 h-4"></i>
              </button>
              <button class="btn-action btn-action-delete" onclick="Applications.openDeleteModal('${app.id}')" title="Hapus Lamaran">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Re-render Lucide icons for new table rows
    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  /**
   * Helper format job source (bisa mendeteksi URL)
   */
  formatJobSource(source) {
    if (!source || !source.trim()) return '<span class="text-slate-400">-</span>';
    const escaped = this.escapeHTML(source);
    
    // Deteksi jika mengandung tautan http atau https
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (urlRegex.test(source)) {
      const replaced = escaped.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-primary inline-flex items-center gap-1">${url} <i data-lucide="external-link" class="w-3 h-3"></i></a>`;
      });
      return replaced;
    }

    return escaped;
  },

  /**
   * Membuka modal Tambah Lamaran
   */
  openAddModal() {
    this.state.currentEditId = null;
    const form = document.getElementById('application-form');
    if (form) form.reset();

    const titleEl = document.getElementById('modal-title');
    if (titleEl) titleEl.textContent = 'Tambah Lamaran Pekerjaan';

    // Set tanggal default ke hari ini
    const dateInput = document.getElementById('form-application-date');
    if (dateInput) {
      dateInput.value = Storage.getTodayDateString();
    }

    // Set default status
    const statusSelect = document.getElementById('form-status');
    if (statusSelect) {
      statusSelect.value = 'Sudah Melamar';
    }

    this.showModal();
  },

  /**
   * Membuka modal Edit Lamaran
   */
  openEditModal(id) {
    const app = Storage.getById(id);
    if (!app) {
      App.showToast('Data lamaran tidak ditemukan', 'error');
      return;
    }

    this.state.currentEditId = id;
    const titleEl = document.getElementById('modal-title');
    if (titleEl) titleEl.textContent = 'Edit Lamaran Pekerjaan';

    // Isi field form dengan data lama
    document.getElementById('form-company-name').value = app.companyName || '';
    document.getElementById('form-position').value = app.position || '';
    document.getElementById('form-location').value = app.location || '';
    document.getElementById('form-workmode').value = app.workMode || 'WFO';
    document.getElementById('form-application-date').value = app.applicationDate || Storage.getTodayDateString();
    document.getElementById('form-job-source').value = app.jobSource || '';
    document.getElementById('form-status').value = app.status || 'Sudah Melamar';
    document.getElementById('form-notes').value = app.notes || '';

    this.showModal();
  },

  /**
   * Menampilkan modal input/edit
   */
  showModal() {
    const modal = document.getElementById('application-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
      const body = modal.querySelector('.modal-body');
      if (body) body.scrollTop = 0;
      // Fokus pada input pertama
      setTimeout(() => {
        const firstInput = document.getElementById('form-company-name');
        if (firstInput) firstInput.focus();
      }, 50);
    }
  },

  /**
   * Menutup modal input/edit
   */
  closeModal() {
    const modal = document.getElementById('application-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
    this.state.currentEditId = null;
  },

  /**
   * Handle simpan form (Tambah atau Edit)
   */
  handleFormSubmit() {
    const companyName = document.getElementById('form-company-name').value.trim();
    const position = document.getElementById('form-position').value.trim();
    const location = document.getElementById('form-location').value.trim();
    const workMode = document.getElementById('form-workmode').value;
    const applicationDate = document.getElementById('form-application-date').value;
    const jobSource = document.getElementById('form-job-source').value.trim();
    const status = document.getElementById('form-status').value;
    const notes = document.getElementById('form-notes').value.trim();

    // Validasi field wajib
    if (!companyName) {
      App.showToast('Nama Perusahaan wajib diisi!', 'warning');
      document.getElementById('form-company-name').focus();
      return;
    }

    if (!position) {
      App.showToast('Posisi yang dilamar wajib diisi!', 'warning');
      document.getElementById('form-position').focus();
      return;
    }

    if (!applicationDate) {
      App.showToast('Tanggal melamar wajib diisi!', 'warning');
      document.getElementById('form-application-date').focus();
      return;
    }

    const formData = {
      companyName,
      position,
      location,
      workMode,
      applicationDate,
      jobSource,
      status,
      notes
    };

    if (this.state.currentEditId) {
      // Edit
      const updated = Storage.update(this.state.currentEditId, formData);
      if (updated) {
        App.showToast(`Data "${updated.companyName}" berhasil diperbarui`, 'success');
      } else {
        App.showToast('Gagal memperbarui data', 'error');
      }
    } else {
      // Tambah Baru
      const added = Storage.add(formData);
      if (added) {
        App.showToast(`Lamaran ke "${added.companyName}" berhasil disimpan`, 'success');
      } else {
        App.showToast('Gagal menambahkan data', 'error');
      }
    }

    this.closeModal();
    this.refreshAll();
  },

  /**
   * Membuka modal konfirmasi hapus
   */
  openDeleteModal(id) {
    const app = Storage.getById(id);
    if (!app) return;

    this.state.deleteTargetId = id;
    const msgEl = document.getElementById('delete-modal-text');
    if (msgEl) {
      msgEl.innerHTML = `Apakah Anda yakin ingin menghapus data lamaran ke <strong>${this.escapeHTML(app.companyName)}</strong> (${this.escapeHTML(app.position)})? Tindakan ini tidak dapat dibatalkan.`;
    }

    const modal = document.getElementById('delete-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
    }
  },

  /**
   * Menutup modal konfirmasi hapus
   */
  closeDeleteModal() {
    const modal = document.getElementById('delete-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
    this.state.deleteTargetId = null;
  },

  /**
   * Konfirmasi hapus data
   */
  handleDeleteConfirm() {
    if (!this.state.deleteTargetId) return;

    const app = Storage.getById(this.state.deleteTargetId);
    const companyName = app ? app.companyName : 'Lamaran';

    const success = Storage.delete(this.state.deleteTargetId);
    this.closeDeleteModal();

    if (success) {
      App.showToast(`Data "${companyName}" berhasil dihapus`, 'success');
      this.refreshAll();
    } else {
      App.showToast('Gagal menghapus data', 'error');
    }
  },

  /**
   * Menampilkan modal detail & catatan lamaran
   */
  showDetail(id) {
    const app = Storage.getById(id);
    if (!app) return;

    const content = document.getElementById('detail-modal-content');
    if (!content) return;

    const statusBadge = Dashboard.createStatusBadge(app.status);
    const workModeBadge = Dashboard.createWorkModeBadge(app.workMode);
    const formattedDate = Dashboard.formatDate(app.applicationDate);
    const sourceDisplay = this.formatJobSource(app.jobSource);

    content.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-start justify-between border-b pb-3 border-slate-100">
          <div>
            <h4 class="text-xl font-bold text-slate-800">${this.escapeHTML(app.companyName)}</h4>
            <p class="text-base text-slate-600 font-medium">${this.escapeHTML(app.position)}</p>
          </div>
          <div class="flex flex-col items-end gap-1.5">
            ${statusBadge}
            ${workModeBadge}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <label class="text-slate-400 block text-xs uppercase font-semibold">Tanggal Melamar</label>
            <p class="text-slate-700 font-medium mt-0.5">${formattedDate}</p>
          </div>
          <div>
            <label class="text-slate-400 block text-xs uppercase font-semibold">Lokasi</label>
            <p class="text-slate-700 font-medium mt-0.5">${this.escapeHTML(app.location) || '-'}</p>
          </div>
          <div class="md:col-span-2">
            <label class="text-slate-400 block text-xs uppercase font-semibold">Sumber Lowongan</label>
            <p class="text-slate-700 font-medium mt-0.5 break-all">${sourceDisplay}</p>
          </div>
        </div>

        <div class="pt-2 border-t border-slate-100">
          <label class="text-slate-400 block text-xs uppercase font-semibold mb-1">Catatan & Keterangan</label>
          <div class="p-3 bg-slate-50 rounded-lg text-slate-700 text-sm whitespace-pre-wrap leading-relaxed border border-slate-200">
            ${this.escapeHTML(app.notes) || '<span class="text-slate-400 italic">Tidak ada catatan tambahan.</span>'}
          </div>
        </div>
      </div>
    `;

    const modal = document.getElementById('detail-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
      if (window.lucide) window.lucide.createIcons();
    }
  },

  closeDetailModal() {
    const modal = document.getElementById('detail-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  },

  /**
   * Memperbarui seluruh komponen aplikasi
   */
  refreshAll() {
    this.renderTable();
    Dashboard.render();
  },

  escapeHTML(str) {
    return Dashboard.escapeHTML(str);
  }
};
