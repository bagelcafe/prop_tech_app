let stockChart = null;

async function searchStock() {
    const code = document.getElementById('stockCode').value.trim();
    if (!code || code.length !== 6) {
        alert('Please enter a valid 6-digit stock code.');
        return;
    }

    showLoading(true);
    try {
        // Use relative path for sub-app compatibility
        const response = await fetch(`api/stock/${code}`);
        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        updateUI(data.info);
        updateChart(data.chart);
        document.getElementById('dashboard').style.display = 'grid';
    } catch (err) {
        console.error(err);
        alert('Failed to fetch data.');
    } finally {
        showLoading(false);
    }
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function updateUI(info) {
    document.getElementById('stkNm').textContent = info.stk_nm;
    document.getElementById('stkCdDisplay').textContent = info.stk_cd;

    const price = parseInt(info.cur_prc);
    const change = parseInt(info.pred_pre);
    const fluRt = info.flu_rt;

    document.getElementById('curPrc').textContent = formatNumber(Math.abs(price));
    document.getElementById('predPre').textContent = (change > 0 ? '▲ ' : change < 0 ? '▼ ' : '') + formatNumber(Math.abs(change));
    document.getElementById('fluRt').textContent = fluRt + '%';

    const colorClass = change > 0 ? 'up' : change < 0 ? 'down' : 'equal';
    document.getElementById('curPrc').className = 'cur-prc ' + colorClass;
    document.getElementById('changeInfo').className = 'change-info ' + colorClass;

    document.getElementById('openPric').textContent = formatNumber(Math.abs(parseInt(info.open_pric)));
    document.getElementById('highPric').textContent = formatNumber(Math.abs(parseInt(info.high_pric)));
    document.getElementById('lowPric').textContent = formatNumber(Math.abs(parseInt(info.low_pric)));
    document.getElementById('trdeQty').textContent = formatNumber(parseInt(info.trde_qty));
}

function updateChart(chartData) {
    const ctx = document.getElementById('stockChart').getContext('2d');

    const labels = chartData.map(d => parseDate(d.cntr_tm)).reverse();
    const prices = chartData.map(d => Math.abs(parseInt(d.cur_prc))).reverse();

    if (stockChart) {
        stockChart.destroy();
    }

    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price',
                data: prices,
                borderColor: '#58a6ff',
                backgroundColor: 'rgba(88, 166, 255, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute',
                        displayFormats: {
                            minute: 'HH:mm'
                        }
                    },
                    grid: { display: false },
                    ticks: { color: '#8b949e' }
                },
                y: {
                    grid: { color: 'rgba(48, 54, 61, 0.5)' },
                    ticks: { color: '#8b949e' }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#161b22',
                    titleColor: '#f0f6fc',
                    bodyColor: '#58a6ff',
                    borderColor: '#30363d',
                    borderWidth: 1
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

function parseDate(str) {
    // 20251222130500
    const y = str.substring(0, 4);
    const m = str.substring(4, 6);
    const d = str.substring(6, 8);
    const h = str.substring(8, 10);
    const min = str.substring(10, 12);
    const s = str.substring(12, 14);
    return luxon.DateTime.fromObject({ year: y, month: m, day: d, hour: h, minute: min, second: s });
}

function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}
