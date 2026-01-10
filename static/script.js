const state = {
    selectedCode: null,
    selectedDong: null,
    isSearching: false,
    chartInstance: null,
    rawData: [] // Store fetched data locally
};

const dom = {
    input: document.getElementById('regionInput'),
    searchBtn: document.getElementById('searchRegionBtn'),
    suggestions: document.getElementById('regionSuggestions'),
    filters: document.getElementById('filtersGroup'),
    loading: document.getElementById('loading'),
    results: document.getElementById('resultsSection'),
    noResults: document.getElementById('noResults'),
    radioButtons: document.querySelectorAll('input[name="txnType"]'),
    startPicker: document.getElementById('startMonth'),
    endPicker: document.getElementById('endMonth'),
    chartSection: document.getElementById('chartSection'),
    chartCanvas: document.getElementById('priceChart')
};

// Initialize Date Picker (Previous Month default)
function initDate() {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const prevMonthStr = `${yyyy}-${mm}`;

    dom.startPicker.value = prevMonthStr;
    dom.endPicker.value = prevMonthStr;
}

// Search Region (Autocomplete)
dom.input.addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    if (query.length < 2) {
        dom.suggestions.classList.add('hidden');
        return;
    }

    try {
        const res = await fetch(`/api/regions?query=${query}`);
        const data = await res.json();

        dom.suggestions.innerHTML = '';
        if (data.length > 0) {
            dom.suggestions.classList.remove('hidden');
            data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.label;
                li.addEventListener('click', () => selectRegion(item));
                dom.suggestions.appendChild(li);
            });
        } else {
            dom.suggestions.classList.add('hidden');
        }
    } catch (err) {
        console.error('Search error:', err);
    }
});

function selectRegion(item) {
    state.selectedCode = item.code;
    state.selectedDong = item.dong_name;
    dom.input.value = item.label;
    dom.suggestions.classList.add('hidden');
    dom.filters.classList.remove('hidden');

    // Trigger search automatically
    fetchData();
}

// Fetch Data
async function fetchData() {
    if (!state.selectedCode) return;

    // Reset UI
    dom.chartSection.classList.add('hidden');
    dom.loading.classList.remove('hidden');
    dom.results.classList.add('hidden');
    dom.noResults.classList.add('hidden');

    // Get parameters
    const type = document.querySelector('input[name="txnType"]:checked').value;
    const startVal = dom.startPicker.value;
    const endVal = dom.endPicker.value;
    let startParam = startVal ? startVal.replace('-', '') : "";
    let endParam = endVal ? endVal.replace('-', '') : "";

    try {
        let url = `/api/search?code=${state.selectedCode}&type=${type}`;

        if (state.selectedDong) {
            url += `&dong=${encodeURIComponent(state.selectedDong)}`;
        } else {
            url += `&dong=`;
        }

        if (startParam) url += `&start_month=${startParam}`;
        if (endParam) url += `&end_month=${endParam}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Server status: ${res.status}`);

        const data = await res.json();
        state.rawData = data; // Store data

        renderResults(data);

    } catch (err) {
        console.error('Fetch data error:', err);
        dom.noResults.classList.remove('hidden');
        dom.noResults.innerHTML = '<p>Failed to load data. Please retry.</p>';
    } finally {
        dom.loading.classList.add('hidden');
    }
}

// Render Results List
function renderResults(data) {
    dom.results.innerHTML = '';

    if (!data || data.length === 0) {
        dom.noResults.classList.remove('hidden');
        dom.noResults.innerHTML = `
            <i class="fa-regular fa-folder-open"></i>
            <p>No transaction data found for this location.</p>
        `;
        return;
    }

    dom.results.classList.remove('hidden');

    data.forEach(item => {
        const card = document.createElement('div');
        let typeClass = 'sale';
        if (item.type === '전세') typeClass = 'jeonse';
        if (item.type === '월세') typeClass = 'monthly';

        card.className = `card ${typeClass}`;
        card.style.cursor = 'pointer'; // Make it look clickable
        card.onclick = () => loadChartForApt(item.apt_name); // Click handler

        card.innerHTML = `
            <div class="card-header">
                <div>
                     <span class="dong-badge">${item.type}</span>
                    <div class="apt-name">${item.apt_name}</div>
                </div>
            </div>
            <div class="price">${item.price_num > 0 && item.type === '매매' ? formatPrice(item.price) : item.price}</div>
            <div class="card-details">
                <div class="detail-item"><i class="fa-regular fa-map"></i> ${item.dong}</div> 
                <div class="detail-item"><i class="fa-solid fa-ruler-combined"></i> ${item.area}㎡ (${item.pyung}평)</div>
                <div class="detail-item"><i class="fa-solid fa-layer-group"></i> ${item.floor}층</div>
                <div class="detail-item"><i class="fa-regular fa-calendar"></i> ${item.date}</div>
                <div class="detail-item"><i class="fa-regular fa-building"></i> ${item.build_year}</div>
            </div>
            <div style="margin-top:0.5rem; font-size:0.8rem; color: #64748b; text-align:right;">
                <i class="fa-solid fa-chart-line"></i> Click to view trend
            </div>
        `;
        dom.results.appendChild(card);
    });
}

// Load Chart for Specific Apartment
function loadChartForApt(aptName) {
    if (!state.rawData || state.rawData.length === 0) return;

    // Filter data for this apartment
    const aptData = state.rawData.filter(d => d.apt_name === aptName && d.date && d.price_num > 0);

    if (aptData.length === 0) {
        alert("No chart data available for this apartment.");
        return;
    }

    renderChart(aptName, aptData);

    // Scroll to chart
    dom.chartSection.scrollIntoView({ behavior: 'smooth' });
}

// Render Chart
function renderChart(label, data) {
    dom.chartSection.classList.remove('hidden');

    if (state.chartInstance) {
        state.chartInstance.destroy();
        state.chartInstance = null;
    }

    // 1. Prepare X-Axis Labels (Sorted Chronologically)
    const allDates = new Set(data.filter(d => d.date).map(d => d.date));
    const sortedDates = Array.from(allDates).sort((a, b) => a.localeCompare(b));

    // 2. Group by Pyung (Area)
    const groups = {};
    data.forEach(item => {
        if (!item.date || !item.price_num) return;
        const key = item.pyung + '평';
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
    });

    // 3. Create Datasets matches with X-Axis
    const datasets = Object.keys(groups).sort((a, b) => parseFloat(a) - parseFloat(b)).map((key, index) => {
        const groupItems = groups[key];

        // Sort items by date string (YYYY.MM.DD is sortable strings)
        groupItems.sort((a, b) => a.date.localeCompare(b.date));

        const points = groupItems.map(d => ({
            x: d.date,
            y: d.price_num
        }));

        const color = getColor(index);

        return {
            label: key,
            data: points,
            borderColor: color,
            backgroundColor: color,
            borderWidth: 3,
            tension: 0.1,
            pointRadius: 5,
            pointHoverRadius: 8,
            fill: false
        };
    });

    if (typeof Chart === 'undefined') {
        console.warn("Chart.js not loaded");
        return;
    }

    state.chartInstance = new Chart(dom.chartCanvas, {
        type: 'line',
        data: {
            labels: sortedDates, // Explicit X-axis labels to ensure ordering
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            plugins: {
                title: {
                    display: true,
                    text: `Price Trend by Area: ${label}`,
                    color: '#f8fafc',
                    font: { size: 16, family: "'Outfit', sans-serif" },
                    padding: { bottom: 20 }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        usePointStyle: true,
                        boxWidth: 8,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#f8fafc',
                    bodyColor: '#cbd5e1',
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += formatPriceRaw(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'category',
                    grid: { color: '#334155' },
                    ticks: { color: '#94a3b8' }
                },
                y: {
                    beginAtZero: false, // Don't squash the chart
                    grid: { color: '#334155' },
                    ticks: {
                        color: '#94a3b8',
                        callback: function (value) {
                            return (value / 10000).toFixed(1) + '억';
                        }
                    }
                }
            }
        }
    });
}

function getColor(index) {
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];
    return colors[index % colors.length];
}

function formatPriceRaw(num) {
    if (num >= 10000) {
        const eok = Math.floor(num / 10000);
        const man = num % 10000;
        return `${eok}억 ${man > 0 ? man.toLocaleString() : ''}`;
    }
    return `${num.toLocaleString()}만원`;
}

function formatPrice(korString) {
    const num = parseInt(korString.replace(/,/g, ''), 10);
    if (isNaN(num)) return korString;
    return formatPriceRaw(num);
}

// Event Listeners
dom.radioButtons.forEach(btn => btn.addEventListener('change', fetchData));
dom.startPicker.addEventListener('change', fetchData);
dom.endPicker.addEventListener('change', fetchData);
dom.searchBtn.addEventListener('click', fetchData);

initDate();

// --- Sidebar Logic ---
const navItems = document.querySelectorAll('.nav-links li');
// Fallback to querySelector if getElementById fails (handles cached HTML cases)
const dashboardContent = document.getElementById('dashboardContent') || document.querySelector('.main-content');
const statsContent = document.getElementById('statsContent');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // External Link handling
        if (item.hasAttribute('data-external')) {
            return;
        }

        // Toggle Active Class
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        const target = item.dataset.target;

        // Hide all first
        if (dashboardContent) dashboardContent.classList.add('hidden');
        if (statsContent) statsContent.classList.add('hidden');

        if (target === 'dashboard') {
            if (dashboardContent) dashboardContent.classList.remove('hidden');
        } else if (target === 'stats') {
            if (statsContent) statsContent.classList.remove('hidden');
            fetchStats();
        }
    });
});

// --- Stats Logic ---
document.getElementById('refreshStats').addEventListener('click', fetchStats);

// Update sidebar stats on load
document.addEventListener('DOMContentLoaded', async () => {
    fetchStats();

    // Check AdSense Config
    try {
        const res = await fetch('/api/config');
        if (res.ok) {
            const config = await res.json();
            if (config.enable_adsense) {
                // 1. Inject Script
                const script = document.createElement('script');
                script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5601209477762648";
                script.async = true;
                script.crossOrigin = "anonymous";
                document.head.appendChild(script);

                // 2. Inject Ads
                const adContainers = ['adBannerDashboard', 'adBannerStats'];
                const adHtml = `
                    <div style="text-align: center; margin-bottom: 2rem; min-height: 100px; background: rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;">
                        <ins class="adsbygoogle"
                             style="display:block; width: 100%;"
                             data-ad-client="ca-pub-5601209477762648"
                             data-ad-format="auto"
                             data-full-width-responsive="true"></ins>
                    </div>
                `;

                adContainers.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.innerHTML = adHtml;
                        // Push ad
                        try {
                            (window.adsbygoogle = window.adsbygoogle || []).push({});
                        } catch (e) { console.error("Ad push error:", e); }
                    }
                });
            }
        }
    } catch (e) {
        console.error("Failed to load config:", e);
    }
});

async function fetchStats() {
    const tbody = document.getElementById('logTableBody');
    const uniqueEl = document.getElementById('uniqueVisitors');
    const totalEl = document.getElementById('totalRequests');

    // Sidebar Elements
    const sidebarToday = document.getElementById('sidebarToday');
    const sidebarTotal = document.getElementById('sidebarTotal');

    // Initial State for sidebar
    if (sidebarToday) sidebarToday.textContent = '-';
    if (sidebarTotal) sidebarTotal.textContent = '-';

    if (tbody) tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">로딩 중...</td></tr>';
    if (uniqueEl) uniqueEl.textContent = '-';
    if (totalEl) totalEl.textContent = '-';

    try {
        const res = await fetch('/api/stats');
        if (!res.ok) throw new Error("Failed to load logs");

        const data = await res.json();
        const logs = Array.isArray(data) ? data : (data.today_logs || []);
        const history = Array.isArray(data) ? [] : (data.history || []);
        const summary = data.summary || { total_visitors: 0, total_requests: 0 };

        // Calculate Today Stats
        const uniqueIPs = new Set(logs.map(log => log.ip));
        const todayVisitorsVal = uniqueIPs.size.toLocaleString();
        const todayRequestsVal = logs.length.toLocaleString();

        // Update Sidebar
        if (sidebarToday) sidebarToday.textContent = todayVisitorsVal;
        // sidebarTotal displays Total Historical Visitors
        if (sidebarTotal) sidebarTotal.textContent = summary.total_visitors.toLocaleString();

        // Update Stats Page (if active)
        if (uniqueEl) uniqueEl.textContent = todayVisitorsVal;
        if (totalEl) totalEl.textContent = summary.total_requests.toLocaleString() + " (Total)";
        // Note: Stats page "totalRequests" originally was "Cumulative Usage"
        // Let's keep totalEl as Total API Calls (Cumulative) to match label.
        // Wait, index.html label says "누적 사용량". History logic in main.py sums up requests.
        // Yes, usage of summary.total_requests makes sense there too.

        if (tbody) {
            tbody.innerHTML = '';
            if (logs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">오늘 로그가 없습니다.</td></tr>';
            } else {
                // Render Table (Reverse order)
                logs.slice().reverse().forEach(log => {
                    const tr = document.createElement('tr');
                    let statusClass = 'status-200';
                    if (log.status >= 400 && log.status < 500) statusClass = 'status-400';
                    if (log.status >= 500) statusClass = 'status-500';

                    tr.innerHTML = `
                        <td>${log.time}</td>
                        <td>${log.ip}</td>
                        <td><div style="max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${log.url}">${log.url}</div></td>
                        <td><span class="status-badge ${statusClass}">${log.status}</span></td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        }

        // Render Charts
        if (history.length > 0) {
            renderSplitCharts(history);
        }

    } catch (err) {
        console.error(err);
        if (tbody) tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: #ef4444;">로그 로드 실패</td></tr>';
        if (uniqueEl) uniqueEl.textContent = 'Error';
        if (totalEl) totalEl.textContent = 'Error';
    }
}

let vChart = null;
let rChart = null;

function renderSplitCharts(history) {
    const labels = history.map(h => h.date);
    const visitors = history.map(h => h.visitors);
    const requests = history.map(h => h.requests);

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' }
            }
        }
    };

    // Visitors Chart
    const vCtx = document.getElementById('visitorsChart');
    if (vCtx) {
        if (vChart) vChart.destroy();
        vChart = new Chart(vCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '방문자 수',
                    data: visitors,
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: commonOptions
        });
    }

    // Requests Chart
    const rCtx = document.getElementById('requestsChart');
    if (rCtx) {
        if (rChart) rChart.destroy();
        rChart = new Chart(rCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'API 호출 수',
                    data: requests,
                    backgroundColor: 'rgba(139, 92, 246, 0.7)',
                    borderColor: 'rgba(139, 92, 246, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: commonOptions
        });
    }
}
