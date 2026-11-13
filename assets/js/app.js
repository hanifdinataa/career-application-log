/**
 * Riwayat Cari Kerja - Main Application Coordinator
 * Mengelola navigasi halaman, mode gelap/terang, menu responsif, modal pengaturan, backup/restore, dan notifikasi Toast
 */

const App = {
  activeView: 'dashboard',
  currentTheme: 'light',

  /**
   * Titik masuk aplikasi
   */
  init() {
    this.initTheme();
    this.initNavigation();
    this.initMobileSidebar();
    this.initSettingsModal();
    this.initKeyboardShortcuts();

    // Inisialisasi modul
    Dashboard.render();
    Applications.init();

    // Render Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    console.log('Riwayat Cari Kerja v1.0 initialized successfully.');
  },

  /**
   * Mengelola Mode Gelap & Terang (Dark / Light Theme)
   */
  initTheme() {
    // Cek preferensi tersimpan atau preferensi sistem browser
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.currentTheme = 'dark';
    } else {
      this.currentTheme = 'light';
    }

    this.applyTheme(this.currentTheme, false);

    // Event listener tombol sidebar
    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    if (btnThemeToggle) {
      btnThemeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // Event listener tombol mobile topbar
    const btnThemeToggleMobile = document.getElementById('btn-theme-toggle-mobile');
    if (btnThemeToggleMobile) {
      btnThemeToggleMobile.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  },

  /**
   * Beralih antara mode gelap dan terang
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme, true);
  },

  /**
   * Menerapkan tema ke elemen DOM
   * @param {'dark'|'light'} theme 
   * @param {boolean} showNotification
   */
  applyTheme(theme, showNotification = false) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Perbarui meta theme-color untuk mobile browser bar
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0b1120' : '#1e3a8a');
    }

    // Perbarui teks dan ikon tombol di sidebar
    const themeText = document.getElementById('theme-text');
    const themeIcon = document.getElementById('theme-icon');
    const themeIconMobile = document.getElementById('theme-icon-mobile');

    const isDark = theme === 'dark';
    const iconName = isDark ? 'sun' : 'moon';
    const labelText = isDark ? 'Mode Terang' : 'Mode Gelap';

    if (themeText) themeText.textContent = labelText;
    
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', iconName);
    }
    if (themeIconMobile) {
      themeIconMobile.setAttribute('data-lucide', iconName);
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Update grafik agar menyesuaikan warna background baru
    if (typeof Dashboard !== 'undefined' && Dashboard.render) {
      Dashboard.render();
    }

    if (showNotification) {
      this.showToast(`Beralih ke ${isDark ? 'Mode Gelap' : 'Mode Terang'}`, 'info', 1800);
    }
  },

  /**
   * Navigasi antar halaman (Dashboard <-> Data Lamaran)
   */
  initNavigation() {
    const navLinks = document.querySelectorAll('[data-nav-target]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-nav-target');
        this.switchView(targetView);

        // Tutup mobile sidebar setelah navigasi jika terbuka
        this.closeMobileSidebar();
      });
    });

    // Shortcut tombol di dashboard "Lihat Seluruh Data Lamaran"
    const btnViewAll = document.getElementById('btn-view-all-apps');
    if (btnViewAll) {
      btnViewAll.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('applications');
      });
    }
  },

  /**
   * Beralih tampilan view
   * @param {'dashboard'|'applications'} viewName 
   */
  switchView(viewName) {
    this.activeView = viewName;

    // Toggle tampilan container
    const viewDashboard = document.getElementById('view-dashboard');
    const viewApplications = document.getElementById('view-applications');

    if (viewName === 'dashboard') {
      if (viewDashboard) viewDashboard.style.display = 'block';
      if (viewApplications) viewApplications.style.display = 'none';
      Dashboard.render();
    } else {
      if (viewDashboard) viewDashboard.style.display = 'none';
      if (viewApplications) viewApplications.style.display = 'block';
      Applications.renderTable();
    }

    // Update active state di menu navigasi
    document.querySelectorAll('[data-nav-target]').forEach(item => {
      if (item.getAttribute('data-nav-target') === viewName) {
        item.classList.add('nav-active');
      } else {
        item.classList.remove('nav-active');
      }
    });

    // Scroll ke atas
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  /**
   * Inisialisasi Mobile Sidebar & Hamburger menu
   */
  initMobileSidebar() {
    const toggleBtn = document.getElementById('btn-toggle-sidebar');
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const closeBtn = document.getElementById('btn-close-sidebar');

    if (toggleBtn && sidebar && overlay) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-open');
        overlay.classList.toggle('active');
      });

      overlay.addEventListener('click', () => {
        this.closeMobileSidebar();
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          this.closeMobileSidebar();
        });
      }
    }
  },

  closeMobileSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('sidebar-open');
    if (overlay) overlay.classList.remove('active');
  },

  /**
   * Inisialisasi Pengaturan, Backup, Restore, dan Clear Data
   */
  initSettingsModal() {
    const btnOpenSettings = document.getElementById('btn-open-settings');
    const modalSettings = document.getElementById('settings-modal');
    const btnCloseSettings = document.getElementById('btn-close-settings');

    if (btnOpenSettings && modalSettings) {
      btnOpenSettings.addEventListener('click', () => {
        modalSettings.classList.add('active');
        document.body.classList.add('modal-open');
      });
    }

    if (btnCloseSettings && modalSettings) {
      btnCloseSettings.addEventListener('click', () => {
        modalSettings.classList.remove('active');
        document.body.classList.remove('modal-open');
      });
    }

    // 1. Export JSON
    const btnExportJSON = document.getElementById('btn-export-json');
    if (btnExportJSON) {
      btnExportJSON.addEventListener('click', () => {
        try {
          Storage.exportJSON();
          this.showToast('Data berhasil diekspor ke file JSON', 'success');
        } catch (e) {
          this.showToast('Gagal mengekspor data: ' + e.message, 'error');
        }
      });
    }

    // 2. Export CSV
    const btnExportCSV = document.getElementById('btn-export-csv');
    if (btnExportCSV) {
      btnExportCSV.addEventListener('click', () => {
        try {
          Storage.exportCSV();
          this.showToast('Data berhasil diekspor ke file CSV', 'success');
        } catch (e) {
          this.showToast(e.message || 'Gagal mengekspor ke CSV', 'warning');
        }
      });
    }

    // 3. Import JSON
    const fileImportInput = document.getElementById('input-import-json');
    const btnTriggerImport = document.getElementById('btn-trigger-import');

    if (btnTriggerImport && fileImportInput) {
      btnTriggerImport.addEventListener('click', () => {
        fileImportInput.click();
      });

      fileImportInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          this.promptImportOptions(content);
          fileImportInput.value = ''; // Reset input file
        };
        reader.onerror = () => {
          this.showToast('Gagal membaca file backup', 'error');
        };
        reader.readAsText(file);
      });
    }

    // 4. Reset / Hapus Seluruh Data
    const btnClearAll = document.getElementById('btn-clear-all-data');
    if (btnClearAll) {
      btnClearAll.addEventListener('click', () => {
        this.promptClearAll();
      });
    }

    // 5. Muat Contoh Data (Dinonaktifkan / Status Beta)
    const btnLoadSample = document.getElementById('btn-load-sample-data');
    if (btnLoadSample) {
      btnLoadSample.disabled = true;
      btnLoadSample.style.pointerEvents = 'none';
      btnLoadSample.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
    }
  },

  /**
   * Konfirmasi sebelum import data (Ganti seluruhnya atau Gabungkan)
   */
  promptImportOptions(jsonContent) {
    // Validasi awal JSON
    try {
      const parsed = JSON.parse(jsonContent);
      const apps = Array.isArray(parsed) ? parsed : (parsed.applications || []);
      if (!Array.isArray(apps)) throw new Error();
      if (apps.length === 0) {
        this.showToast('File JSON tidak memiliki riwayat lamaran yang valid', 'warning');
        return;
      }

      const confirmText = `Ditemukan ${apps.length} data lamaran di file backup.\n\nPilih "OK" untuk MENGGANTI seluruh data yang ada saat ini, atau "Cancel" untuk membatalkan.\n(Jika ingin menggabungkan tanpa menghapus data lama, silakan gunakan mode gabung).`;
      
      const shouldReplace = window.confirm(`Ditemukan ${apps.length} data lamaran.\n\nKlik OK untuk MENGGANTI (Restore) data saat ini.\nKlik Batal jika ragu.`);
      if (shouldReplace) {
        const res = Storage.importJSON(jsonContent, 'replace');
        if (res.success) {
          this.showToast(`Berhasil merestore ${res.count} data lamaran!`, 'success');
          Applications.refreshAll();
        } else {
          this.showToast(res.message, 'error');
        }
      }
    } catch {
      this.showToast('File tidak valid atau bukan format JSON yang benar!', 'error');
    }
  },

  /**
   * Konfirmasi hapus seluruh data
   */
  promptClearAll() {
    const apps = Storage.getAll();
    if (apps.length === 0) {
      this.showToast('Data sudah kosong, tidak ada yang perlu dihapus.', 'info');
      return;
    }

    const firstConfirm = window.confirm(`PERINGATAN: Apakah Anda yakin ingin menghapus SELURUH ${apps.length} data lamaran?\n\nTindakan ini akan mengosongkan riwayat lamaran dan tidak dapat dikembalikan.`);
    if (firstConfirm) {
      const secondConfirm = window.confirm('Konfirmasi terakhir: Anda benar-benar yakin ingin menghapus permanen? Sebaiknya Anda sudah melakukan Backup (Export JSON) terlebih dahulu.');
      if (secondConfirm) {
        Storage.clearAll();
        this.showToast('Seluruh data lamaran berhasil dibersihkan', 'info');
        Applications.refreshAll();
      }
    }
  },

  /**
   * Memuat data sampel realistis untuk demonstrasi & pengujian instan
   */
  loadSampleData() {
    const sampleApplications = typeof DEFAULT_INITIAL_APPLICATIONS !== 'undefined' ? DEFAULT_INITIAL_APPLICATIONS : [];

    const confirm = window.confirm('Muat 8 data contoh lamaran untuk demonstrasi? Data lama akan digabungkan dengan contoh data ini.');
    if (confirm) {
      const db = Storage.getDatabase();
      const existingIds = new Set(db.applications.map(a => a.id));
      sampleApplications.forEach(sample => {
        if (!existingIds.has(sample.id)) {
          db.applications.push(sample);
        }
      });
      Storage.saveDatabase(db);
      this.showToast('Contoh data lamaran berhasil dimuat!', 'success');
      Applications.refreshAll();
    }
  },

  /**
   * Keyboard shortcuts
   */
  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Tutup modal jika ada yang terbuka
        Applications.closeModal();
        Applications.closeDeleteModal();
        Applications.closeDetailModal();

        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) {
          settingsModal.classList.remove('active');
          document.body.classList.remove('modal-open');
        }
      }
    });
  },

  /**
   * Sistem Notifikasi Toast Ringan & Bersih
   * @param {string} message 
   * @param {'success'|'error'|'warning'|'info'} type 
   * @param {number} duration 
   */
  showToast(message, type = 'info', duration = 3200) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-circle';
    if (type === 'warning') iconName = 'alert-triangle';

    toast.innerHTML = `
      <i data-lucide="${iconName}" class="toast-icon"></i>
      <span class="toast-message">${this.escapeHTML(message)}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    // Fade-in trigger
    requestAnimationFrame(() => {
      toast.classList.add('toast-visible');
    });

    setTimeout(() => {
      toast.classList.remove('toast-visible');
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 300);
    }, duration);
  },

  escapeHTML(str) {
    return Dashboard.escapeHTML(str);
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
