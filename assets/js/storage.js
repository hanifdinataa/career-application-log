/**
 * Riwayat Cari Kerja - Storage Manager
 * Mengelola penyimpanan data lamaran ke LocalStorage dengan key 'jobTrackerDB'
 */

const STORAGE_KEY = 'jobTrackerDB';
const SEED_VERSION = 'v4_seed_22_all';

const DEFAULT_INITIAL_APPLICATIONS = [
  {
    id: 'app_1',
    companyName: 'BPVP PADANG',
    position: 'Software Engineering',
    location: 'Padang',
    workMode: 'WFO',
    applicationDate: '2026-11-09',
    jobSource: 'MAGANGHUB',
    status: 'Ditolak',
    notes: '',
    createdAt: '2026-11-09T09:00:00.000Z',
    updatedAt: '2026-11-09T09:00:00.000Z'
  },
  {
    id: 'app_2',
    companyName: 'RSIA RESTU IBU PADANG',
    position: 'Staff Information Technology (IT)',
    location: 'Padang',
    workMode: 'WFO',
    applicationDate: '2026-11-06',
    jobSource: 'IG',
    status: 'Sudah Melamar',
    notes: '',
    createdAt: '2026-11-06T09:00:00.000Z',
    updatedAt: '2026-11-06T09:00:00.000Z'
  },
  {
    id: 'app_3',
    companyName: 'BCA',
    position: 'Customer Service dan Teller',
    location: 'Bukittinggi',
    workMode: 'WFO',
    applicationDate: '2026-11-06',
    jobSource: 'IG',
    status: 'Tes Seleksi',
    notes: 'Tahap seleksi online / berkas.',
    createdAt: '2026-11-06T09:00:00.000Z',
    updatedAt: '2026-11-06T09:00:00.000Z'
  },
  {
    id: 'app_4',
    companyName: 'RS UNAND',
    position: 'SIMRS',
    location: 'Padang',
    workMode: 'WFO',
    applicationDate: '2026-10-31',
    jobSource: 'MAGANGHUB',
    status: 'Ditolak',
    notes: 'Unit SIMRS.',
    createdAt: '2026-10-31T09:00:00.000Z',
    updatedAt: '2026-10-31T09:00:00.000Z'
  },
  {
    id: 'app_5',
    companyName: 'PT Kanik Indonesia Utama',
    position: 'Staff Desain Grafis',
    location: 'Bandung',
    workMode: 'WFO',
    applicationDate: '2026-10-26',
    jobSource: 'GLINTS',
    status: 'Tidak Ada Kabar dari HRD/PT',
    notes: '',
    createdAt: '2026-10-26T09:00:00.000Z',
    updatedAt: '2026-10-26T09:00:00.000Z'
  },
  {
    id: 'app_6',
    companyName: 'LAVA Studio',
    position: 'Graphic Designer (Intern - WFH)',
    location: 'Karang Asem, Bali',
    workMode: 'Remote',
    applicationDate: '2026-10-26',
    jobSource: 'Glints',
    status: 'Tidak Ada Kabar dari HRD/PT',
    notes: '',
    createdAt: '2026-10-26T09:00:00.000Z',
    updatedAt: '2026-10-26T09:00:00.000Z'
  },
  {
    id: 'app_7',
    companyName: 'PT LENMARC EXA ABADI DIGITAL',
    position: 'QA CS Trainer Intern',
    location: 'Bandung',
    workMode: 'WFO',
    applicationDate: '2026-10-26',
    jobSource: 'Glints',
    status: 'Tidak Ada Kabar dari HRD/PT',
    notes: '',
    createdAt: '2026-10-26T09:00:00.000Z',
    updatedAt: '2026-10-26T09:00:00.000Z'
  },
  {
    id: 'app_8',
    companyName: 'HaoHao Mandarin',
    position: 'Fullstack Developer (Platform Trading)',
    location: 'Tangerang Selatan',
    workMode: 'Hybrid',
    applicationDate: '2026-10-26',
    jobSource: 'Glints',
    status: 'Tidak Ada Kabar dari HRD/PT',
    notes: '',
    createdAt: '2026-10-26T09:00:00.000Z',
    updatedAt: '2026-10-26T09:00:00.000Z'
  },
  {
    id: 'app_9',
    companyName: 'Skyshi Digital Indonesia',
    position: 'Fullstack Developer (Golang, ReactJs)',
    location: 'Yogyakarta',
    workMode: 'Hybrid',
    applicationDate: '2026-10-26',
    jobSource: 'Glints',
    status: 'Tidak Ada Kabar dari HRD/PT',
    notes: '',
    createdAt: '2026-10-26T09:00:00.000Z',
    updatedAt: '2026-10-26T09:00:00.000Z'
  },
  {
    id: 'app_10',
    companyName: 'Total IT',
    position: 'Freelance Web Design',
    location: 'Jakarta',
    workMode: 'Remote',
    applicationDate: '2026-10-26',
    jobSource: 'Glints',
    status: 'Tidak Ada Kabar dari HRD/PT',
    notes: '',
    createdAt: '2026-10-26T09:00:00.000Z',
    updatedAt: '2026-10-26T09:00:00.000Z'
  },
  {
    id: 'app_11',
    companyName: 'PT ALOKA BJUANA LESTARI',
    position: 'Graphic Designer',
    location: 'Denpasar, Bali',
    workMode: 'WFO',
    applicationDate: '2026-10-25',
    jobSource: 'Glints',
    status: 'Tidak Ada Kabar dari HRD/PT',
    notes: '',
    createdAt: '2026-10-25T09:00:00.000Z',
    updatedAt: '2026-10-25T09:00:00.000Z'
  },
  {
    id: 'app_12',
    companyName: 'NOUS',
    position: 'Designer Paid Inter',
    location: 'Malang',
    workMode: 'Remote',
    applicationDate: '2026-10-24',
    jobSource: 'Glints',
    status: 'Tidak Ada Kabar dari HRD/PT',
    notes: '',
    createdAt: '2026-10-24T09:00:00.000Z',
    updatedAt: '2026-10-24T09:00:00.000Z'
  },
  {
    id: 'app_13',
    companyName: 'PT Langit Bumi Lestari',
    position: 'Designer (Freelance)',
    location: 'Jakarta',
    workMode: 'Remote',
    applicationDate: '2026-10-20',
    jobSource: 'Glints',
    status: 'Tidak Ada Kabar dari HRD/PT',
    notes: '',
    createdAt: '2026-10-20T09:00:00.000Z',
    updatedAt: '2026-10-20T09:00:00.000Z'
  },
  {
    id: 'app_14',
    companyName: 'PT Danamas Insan Kreasi Andalan',
    position: 'Bootcamp Program IT QA Automation',
    location: 'Jakarta',
    workMode: 'WFO',
    applicationDate: '2026-10-18',
    jobSource: 'Glints',
    status: 'Mengundurkan Diri',
    notes: 'Mengundurkan diri dari proses bootcamp.',
    createdAt: '2026-10-18T09:00:00.000Z',
    updatedAt: '2026-10-18T09:00:00.000Z'
  },
  {
    id: 'app_15',
    companyName: 'PT Vanz Inovatif Teknologi (qbit)',
    position: 'QA Internship',
    location: 'Jakarta Barat',
    workMode: 'WFO',
    applicationDate: '2026-10-12',
    jobSource: 'Glints',
    status: 'Tidak Ada Kabar dari HRD/PT',
    notes: '',
    createdAt: '2026-10-12T09:00:00.000Z',
    updatedAt: '2026-10-12T09:00:00.000Z'
  },
  {
    id: 'app_16',
    companyName: 'PT Jaya Indah Prakarya',
    position: 'Quality Control (QC Staff)',
    location: '-',
    workMode: 'WFO',
    applicationDate: '2026-11-14',
    jobSource: 'Blogo id',
    status: 'Sudah Melamar',
    notes: '',
    createdAt: '2026-11-14T08:00:00.000Z',
    updatedAt: '2026-11-14T08:00:00.000Z'
  },
  {
    id: 'app_17',
    companyName: 'PT Guna Adi Putra',
    position: 'IT Programmer & Support',
    location: '-',
    workMode: 'WFO',
    applicationDate: '2026-11-14',
    jobSource: 'Blogo id',
    status: 'Sudah Melamar',
    notes: '',
    createdAt: '2026-11-14T08:15:00.000Z',
    updatedAt: '2026-11-14T08:15:00.000Z'
  },
  {
    id: 'app_18',
    companyName: 'Enditama Group',
    position: 'IT Admin',
    location: '-',
    workMode: 'WFO',
    applicationDate: '2026-11-14',
    jobSource: 'Blogo id',
    status: 'Sudah Melamar',
    notes: '',
    createdAt: '2026-11-14T08:30:00.000Z',
    updatedAt: '2026-11-14T08:30:00.000Z'
  },
  {
    id: 'app_19',
    companyName: 'Green Outsource',
    position: 'IT Staff',
    location: '-',
    workMode: 'WFO',
    applicationDate: '2026-11-14',
    jobSource: 'Blogo id',
    status: 'Sudah Melamar',
    notes: '',
    createdAt: '2026-11-14T08:45:00.000Z',
    updatedAt: '2026-11-14T08:45:00.000Z'
  },
  {
    id: 'app_20',
    companyName: 'PT Trisula Indah Sejati',
    position: 'IT Programmer',
    location: '-',
    workMode: 'WFO',
    applicationDate: '2026-11-14',
    jobSource: 'Blogo id',
    status: 'Sudah Melamar',
    notes: '',
    createdAt: '2026-11-14T09:00:00.000Z',
    updatedAt: '2026-11-14T09:00:00.000Z'
  },
  {
    id: 'app_21',
    companyName: 'PT Guna Kencana Logistik',
    position: 'Staff Administrasi Data',
    location: '-',
    workMode: 'WFO',
    applicationDate: '2026-11-14',
    jobSource: 'Blogo id',
    status: 'Sudah Melamar',
    notes: '',
    createdAt: '2026-11-14T09:15:00.000Z',
    updatedAt: '2026-11-14T09:15:00.000Z'
  },
  {
    id: 'app_22',
    companyName: 'PT Guna Adi Putra',
    position: 'Staff Administrasi',
    location: '-',
    workMode: 'WFO',
    applicationDate: '2026-11-14',
    jobSource: 'Blogo id',
    status: 'Sudah Melamar',
    notes: '',
    createdAt: '2026-11-14T09:30:00.000Z',
    updatedAt: '2026-11-14T09:30:00.000Z'
  }
];

const Storage = {
  /**
   * Mengambil seluruh data dari LocalStorage
   * @returns {Object} { applications: [...] }
   */
  getDatabase() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const defaultDb = { applications: [...DEFAULT_INITIAL_APPLICATIONS] };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDb));
        localStorage.setItem('jobTrackerDB_seed_ver', SEED_VERSION);
        return defaultDb;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.applications)) {
        return { applications: [...DEFAULT_INITIAL_APPLICATIONS] };
      }

      // Sinkronisasi seluruh 22 data agar sama di seluruh perangkat
      const seedFlag = localStorage.getItem('jobTrackerDB_seed_ver');
      if (seedFlag !== SEED_VERSION) {
        parsed.applications = [...DEFAULT_INITIAL_APPLICATIONS];
        localStorage.setItem('jobTrackerDB_seed_ver', SEED_VERSION);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }

      return parsed;
    } catch (e) {
      console.error('Gagal membaca LocalStorage:', e);
      return { applications: [...DEFAULT_INITIAL_APPLICATIONS] };
    }
  },

  /**
   * Menyimpan database ke LocalStorage
   * @param {Object} db 
   */
  saveDatabase(db) {
    try {
      if (!db || !Array.isArray(db.applications)) {
        throw new Error('Format database tidak valid');
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      return true;
    } catch (e) {
      console.error('Gagal menyimpan ke LocalStorage:', e);
      return false;
    }
  },

  /**
   * Mengambil semua daftar lamaran dengan pembersihan format
   * @returns {Array}
   */
  getAll() {
    const db = this.getDatabase();
    return db.applications.map(item => ({
      id: item.id || this.generateId(),
      companyName: item.companyName || '-',
      position: item.position || '-',
      location: item.location || '',
      workMode: item.workMode || '-',
      applicationDate: item.applicationDate || '',
      jobSource: item.jobSource || '',
      status: item.status || 'Sudah Melamar',
      notes: item.notes || '',
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString()
    }));
  },

  /**
   * Mengambil 1 lamaran berdasarkan ID
   * @param {string} id 
   * @returns {Object|null}
   */
  getById(id) {
    const applications = this.getAll();
    return applications.find(app => String(app.id) === String(id)) || null;
  },

  /**
   * Menambahkan lamaran baru
   * @param {Object} data 
   * @returns {Object} data yang baru dibuat
   */
  add(data) {
    const db = this.getDatabase();
    const now = new Date().toISOString();
    const newApp = {
      id: this.generateId(),
      companyName: String(data.companyName || '').trim(),
      position: String(data.position || '').trim(),
      location: String(data.location || '').trim(),
      workMode: data.workMode || '-',
      applicationDate: data.applicationDate || this.getTodayDateString(),
      jobSource: String(data.jobSource || '').trim(),
      status: data.status || 'Sudah Melamar',
      notes: String(data.notes || '').trim(),
      createdAt: now,
      updatedAt: now
    };

    db.applications.unshift(newApp); // Lamaran terbaru di depan
    this.saveDatabase(db);
    return newApp;
  },

  /**
   * Memperbarui lamaran yang sudah ada
   * @param {string} id 
   * @param {Object} data 
   * @returns {Object|null}
   */
  update(id, data) {
    const db = this.getDatabase();
    const index = db.applications.findIndex(app => String(app.id) === String(id));
    if (index === -1) return null;

    const existing = db.applications[index];
    const updatedApp = {
      ...existing,
      companyName: String(data.companyName || '').trim(),
      position: String(data.position || '').trim(),
      location: String(data.location || '').trim(),
      workMode: data.workMode || '-',
      applicationDate: data.applicationDate || existing.applicationDate,
      jobSource: String(data.jobSource || '').trim(),
      status: data.status || existing.status,
      notes: String(data.notes || '').trim(),
      updatedAt: new Date().toISOString()
    };

    db.applications[index] = updatedApp;
    this.saveDatabase(db);
    return updatedApp;
  },

  /**
   * Menghapus lamaran berdasarkan ID
   * @param {string} id 
   * @returns {boolean}
   */
  delete(id) {
    const db = this.getDatabase();
    const initialLen = db.applications.length;
    db.applications = db.applications.filter(app => String(app.id) !== String(id));
    if (db.applications.length !== initialLen) {
      this.saveDatabase(db);
      return true;
    }
    return false;
  },

  /**
   * Menghapus seluruh data lamaran
   */
  clearAll() {
    this.saveDatabase({ applications: [] });
  },

  /**
   * Export database ke file JSON yang diunduh
   */
  exportJSON() {
    const db = this.getDatabase();
    const jsonString = JSON.stringify(db, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `riwayat-cari-kerja-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Import data dari string JSON
   * @param {string} jsonString 
   * @param {'replace'|'merge'} mode
   * @returns {{success: boolean, message: string, count: number}}
   */
  importJSON(jsonString, mode = 'replace') {
    try {
      const parsed = JSON.parse(jsonString);
      let incomingApps = [];

      if (Array.isArray(parsed)) {
        incomingApps = parsed;
      } else if (parsed && Array.isArray(parsed.applications)) {
        incomingApps = parsed.applications;
      } else {
        throw new Error('Format JSON tidak sesuai: data harus memiliki array "applications".');
      }

      // Validasi setiap item
      const validApps = incomingApps.map(item => ({
        id: item.id || this.generateId(),
        companyName: String(item.companyName || 'Tanpa Nama').trim(),
        position: String(item.position || 'Tanpa Posisi').trim(),
        location: String(item.location || '').trim(),
        workMode: item.workMode || '-',
        applicationDate: item.applicationDate || this.getTodayDateString(),
        jobSource: String(item.jobSource || '').trim(),
        status: item.status || 'Sudah Melamar',
        notes: String(item.notes || '').trim(),
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString()
      }));

      const db = this.getDatabase();
      if (mode === 'replace') {
        db.applications = validApps;
      } else {
        // Mode merge: cegah duplikasi ID, jika ada ID yang sama generate ID baru
        const existingIds = new Set(db.applications.map(a => String(a.id)));
        validApps.forEach(item => {
          if (existingIds.has(String(item.id))) {
            item.id = this.generateId();
          }
          db.applications.push(item);
        });
      }

      this.saveDatabase(db);
      return { success: true, message: 'Data berhasil diimpor', count: validApps.length };
    } catch (e) {
      return { success: false, message: e.message || 'Gagal memproses file JSON', count: 0 };
    }
  },

  /**
   * Export data ke file CSV (dapat dibuka rapi di Excel / Spreadsheet)
   */
  exportCSV() {
    const apps = this.getAll();
    if (apps.length === 0) {
      throw new Error('Tidak ada data untuk diekspor ke CSV.');
    }

    const headers = [
      'No',
      'Nama Perusahaan',
      'Posisi',
      'Lokasi',
      'Sistem Kerja',
      'Tanggal Melamar',
      'Sumber Lowongan',
      'Status',
      'Catatan',
      'Dibuat Pada'
    ];

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '""';
      let str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = apps.map((app, index) => [
      index + 1,
      escapeCSV(app.companyName),
      escapeCSV(app.position),
      escapeCSV(app.location),
      escapeCSV(app.workMode),
      escapeCSV(app.applicationDate),
      escapeCSV(app.jobSource),
      escapeCSV(app.status),
      escapeCSV(app.notes),
      escapeCSV(app.createdAt)
    ].join(','));

    // Tambahkan UTF-8 BOM agar terbaca sempurna di Microsoft Excel
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `riwayat-cari-kerja-data-${dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Helper: Generate ID unik
   */
  generateId() {
    return 'app_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
  },

  /**
   * Helper: Mendapatkan tanggal hari ini YYYY-MM-DD
   */
  getTodayDateString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
};
