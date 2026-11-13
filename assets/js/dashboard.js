/**
 * Riwayat Cari Kerja - Dashboard Module
 * Mengelola kartu statistik, grafik distribusi status, grafik bulanan, dan riwayat terbaru
 */

const STATUS_CONFIG = {
  'Sudah Melamar': { color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1' },
  'Dalam Review': { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  'Interview': { color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  'Tes Seleksi': { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  'Offering': { color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
  'Diterima': { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  'Ditolak': { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  'Mengundurkan Diri': { color: '#475569', bg: '#f8fafc', border: '#e2e8f0' },
  'Tidak Ada Kabar dari HRD/PT': { color: '#c2410c', bg: '#fff7ed', border: '#fed7aa' }
};

const WORK_MODE_CONFIG = {
  'Remote': { label: 'Remote', color: '#0284c7', bg: '#e0f2fe' },
  'Hybrid': { label: 'Hybrid', color: '#7c3aed', bg: '#f3e8ff' },
  'WFO': { label: 'WFO', color: '#475569', bg: '#f1f5f9' },
  '-': { label: '-', color: '#94a3b8', bg: '#f8fafc' }
};

const MONTH_NAMES_ID = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

let statusChartInstance = null;
let monthlyChartInstance = null;

const Dashboard = {
  /**
   * Inisialisasi dan refresh seluruh komponen dashboard
   */
  render() {
    const applications = Storage.getAll();
    this.renderStats(applications);
    this.renderStatusChart(applications);
    this.renderMonthlyChart(applications);
    this.renderRecentApplications(applications);
  },

  /**
   * Menghitung dan menampilkan 6 kartu statistik
   * @param {Array} apps 
   */
  renderStats(apps) {
    const total = apps.length;
    // Menunggu Respons = "Sudah Melamar" + "Dalam Review"
    const waiting = apps.filter(a => a.status === 'Sudah Melamar' || a.status === 'Dalam Review').length;
    const interview = apps.filter(a => a.status === 'Interview').length;
    const offering = apps.filter(a => a.status === 'Offering').length;
    const accepted = apps.filter(a => a.status === 'Diterima').length;
    const rejected = apps.filter(a => a.status === 'Ditolak').length;

    this.animateNumber('stat-total', total);
    this.animateNumber('stat-waiting', waiting);
    this.animateNumber('stat-interview', interview);
    this.animateNumber('stat-offering', offering);
    this.animateNumber('stat-accepted', accepted);
    this.animateNumber('stat-rejected', rejected);
  },

  /**
   * Helper animasi transisi angka
   */
  animateNumber(elementId, targetValue) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = targetValue;
  },

  /**
   * Render Doughnut Chart untuk 8 status lamaran
   * @param {Array} apps 
   */
  renderStatusChart(apps) {
    const canvas = document.getElementById('statusChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const statuses = [
      'Sudah Melamar',
      'Dalam Review',
      'Interview',
      'Tes Seleksi',
      'Offering',
      'Diterima',
      'Ditolak',
      'Mengundurkan Diri',
      'Tidak Ada Kabar dari HRD/PT'
    ];

    const counts = statuses.map(st => apps.filter(a => a.status === st).length);
    const hasData = counts.some(c => c > 0);

    const emptyContainer = document.getElementById('status-chart-empty');
    if (emptyContainer) {
      emptyContainer.style.display = hasData ? 'none' : 'flex';
      canvas.style.display = hasData ? 'block' : 'none';
    }

    if (statusChartInstance) {
      statusChartInstance.destroy();
      statusChartInstance = null;
    }

    if (!hasData) return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const backgroundColors = statuses.map(st => STATUS_CONFIG[st].color);

    statusChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: statuses,
        datasets: [{
          data: counts,
          backgroundColor: backgroundColors,
          borderWidth: 2,
          borderColor: isDark ? '#1e293b' : '#ffffff',
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 12,
              color: isDark ? '#cbd5e1' : '#475569',
              font: {
                family: "Inter, system-ui, -apple-system, sans-serif",
                size: 11
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const val = context.raw || 0;
                const percentage = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                return ` ${context.label}: ${val} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '68%'
      }
    });
  },

  /**
   * Render Bar Chart jumlah lamaran berdasarkan bulan
   * Menampilkan data 6 - 12 bulan terakhir atau bulan berjalan
   * @param {Array} apps 
   */
  renderMonthlyChart(apps) {
    const canvas = document.getElementById('monthlyChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const emptyContainer = document.getElementById('monthly-chart-empty');

    const hasData = apps.length > 0;
    if (emptyContainer) {
      emptyContainer.style.display = hasData ? 'none' : 'flex';
      canvas.style.display = hasData ? 'block' : 'none';
    }

    if (monthlyChartInstance) {
      monthlyChartInstance.destroy();
      monthlyChartInstance = null;
    }

    if (!hasData) return;

    // Siapkan rentang 6 bulan terakhir hingga bulan saat ini
    const now = new Date();
    const months = [];
    const counts = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthIdx = d.getMonth();
      const key = `${year}-${String(monthIdx + 1).padStart(2, '0')}`;
      const label = `${MONTH_NAMES_ID[monthIdx]} ${String(year).slice(-2)}`;
      months.push({ key, label });
    }

    // Hitung jumlah lamaran per bulan
    months.forEach(m => {
      const totalInMonth = apps.filter(a => {
        if (!a.applicationDate) return false;
        return a.applicationDate.startsWith(m.key);
      }).length;
      counts.push(totalInMonth);
    });

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    monthlyChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months.map(m => m.label),
        datasets: [{
          label: 'Jumlah Lamaran',
          data: counts,
          backgroundColor: isDark ? '#3b82f6' : '#1e3a8a',
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 24,
          maxBarThickness: 32
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: isDark ? '#94a3b8' : '#64748b',
              font: {
                family: "Inter, system-ui, -apple-system, sans-serif",
                size: 11
              }
            },
            grid: {
              color: isDark ? '#334155' : '#f1f5f9'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: isDark ? '#94a3b8' : '#64748b',
              font: {
                family: "Inter, system-ui, -apple-system, sans-serif",
                size: 11
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.raw} Lamaran`;
              }
            }
          }
        }
      }
    });
  },

  /**
   * Render daftar seluruh lamaran di dashboard
   * @param {Array} apps 
   */
  renderRecentApplications(apps) {
    const container = document.getElementById('recent-applications-body');
    const emptyState = document.getElementById('recent-applications-empty');
    if (!container) return;

    if (!apps || apps.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Urutkan berdasarkan tanggal melamar terbaru atau createdAt
    const sorted = [...apps].sort((a, b) => {
      const dateA = new Date(a.applicationDate || a.createdAt);
      const dateB = new Date(b.applicationDate || b.createdAt);
      return dateB - dateA;
    });

    const recent = sorted;

    container.innerHTML = recent.map(app => {
      const statusBadge = this.createStatusBadge(app.status);
      const workModeBadge = this.createWorkModeBadge(app.workMode);
      const formattedDate = this.formatDate(app.applicationDate);

      return `
        <tr>
          <td class="font-medium text-slate-800">${this.escapeHTML(app.companyName)}</td>
          <td>${this.escapeHTML(app.position)}</td>
          <td class="text-slate-500 whitespace-nowrap">${formattedDate}</td>
          <td>${workModeBadge}</td>
          <td>${statusBadge}</td>
        </tr>
      `;
    }).join('');
  },

  /**
   * Helper format badge status
   */
  createStatusBadge(status) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG['Sudah Melamar'];
    return `<span class="badge" style="background-color: ${config.bg}; color: ${config.color}; border: 1px solid ${config.border};">${status}</span>`;
  },

  /**
   * Helper format badge sistem kerja
   */
  createWorkModeBadge(mode) {
    const config = WORK_MODE_CONFIG[mode] || WORK_MODE_CONFIG['-'];
    return `<span class="badge-workmode" style="background-color: ${config.bg}; color: ${config.color};">${mode || '-'}</span>`;
  },

  /**
   * Format tanggal ke format Indonesia ramah: DD MMM YYYY
   */
  formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const y = parts[0];
        const m = parseInt(parts[1], 10) - 1;
        const d = parts[2];
        return `${d} ${MONTH_NAMES_ID[m] || ''} ${y}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  },

  escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
};
