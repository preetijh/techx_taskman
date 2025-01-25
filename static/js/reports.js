document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeCharts();
    
    // Load initial data
    loadReportData();
    
    // Initialize filters
    initializeFilters();
    
    // Update metrics
    updateMetrics();
});

// Initialize Chart.js charts
function initializeCharts() {
    // Task Trend Chart - Simplified version
    const taskTrendCtx = document.getElementById('taskTrendChart').getContext('2d');
    window.taskTrendChart = new Chart(taskTrendCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{
                label: 'Tasks',
                data: [12, 19, 15, 17, 14],
                borderColor: '#3b82f6',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        maxTicksLimit: 5
                    }
                }
            }
        }
    });

    // Team Performance Chart - Simplified version
    const teamPerformanceCtx = document.getElementById('teamPerformanceChart').getContext('2d');
    window.teamPerformanceChart = new Chart(teamPerformanceCtx, {
        type: 'doughnut',
        data: {
            labels: ['High', 'Medium', 'Low'],
            datasets: [{
                data: [70, 20, 10],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12
                    }
                }
            }
        }
    });
}

// Load report data
function loadReportData() {
    // Get filters
    const dateRange = document.getElementById('dateRange').value;
    const department = document.getElementById('departmentFilter').value;
    const team = document.getElementById('teamFilter').value;
    const metric = document.getElementById('metricFilter').value;

    // Sample data - replace with API call
    const reportData = generateSampleData();
    
    // Update table
    updateReportTable(reportData);
    
    // Update charts
    updateCharts(reportData);
}

// Generate sample data
function generateSampleData() {
    return {
        teams: [
            {
                name: 'Frontend Team',
                tasksCompleted: 45,
                performanceScore: 85,
                productivityRate: 92,
                attendanceRate: 95
            },
            {
                name: 'Backend Team',
                tasksCompleted: 38,
                performanceScore: 78,
                productivityRate: 88,
                attendanceRate: 92
            },
            // Add more sample data
        ]
    };
}

// Update report table
function updateReportTable(data) {
    const tableBody = document.getElementById('reportsTableBody');
    tableBody.innerHTML = data.teams.map(team => `
        <tr>
            <td>${team.name}</td>
            <td>${team.tasksCompleted}</td>
            <td>
                <span class="performance-badge ${getPerformanceBadgeClass(team.performanceScore)}">
                    ${team.performanceScore}%
                </span>
            </td>
            <td>${team.productivityRate}%</td>
            <td>${team.attendanceRate}%</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewTeamDetails('${team.name}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Update charts with new data
function updateCharts(data) {
    // Update task trend chart
    const taskTrendData = generateTrendData();
    window.taskTrendChart.data.datasets[0].data = taskTrendData;
    window.taskTrendChart.update();

    // Update team performance chart
    const performanceData = calculatePerformanceDistribution(data.teams);
    window.teamPerformanceChart.data.datasets[0].data = performanceData;
    window.teamPerformanceChart.update();
}

// Update metrics
function updateMetrics() {
    // Sample metrics - replace with real data
    document.getElementById('totalTasks').textContent = '157';
    // Update other metrics
}

// Helper function to get performance badge class
function getPerformanceBadgeClass(score) {
    if (score >= 80) return 'performance-high';
    if (score >= 60) return 'performance-medium';
    return 'performance-low';
}

// Generate trend data
function generateTrendData() {
    return Array.from({length: 7}, () => Math.floor(Math.random() * 20) + 10);
}

// Calculate performance distribution
function calculatePerformanceDistribution(teams) {
    const high = teams.filter(t => t.performanceScore >= 80).length;
    const medium = teams.filter(t => t.performanceScore >= 60 && t.performanceScore < 80).length;
    const low = teams.filter(t => t.performanceScore < 60).length;
    return [high, medium, low];
}

// Initialize filters
function initializeFilters() {
    const filters = ['dateRange', 'departmentFilter', 'teamFilter', 'metricFilter'];
    filters.forEach(filter => {
        document.getElementById(filter)?.addEventListener('change', loadReportData);
    });
}

// Export report functionality
function exportReport() {
    // Get form values
    const reportType = document.getElementById('reportType').value;
    const dateRange = document.getElementById('exportDateRange').value;
    const fileFormat = document.getElementById('fileFormat').value;
    const includeCharts = document.getElementById('includeCharts').checked;

    // Validate form
    if (!reportType || !dateRange || !fileFormat) {
        alert('Please fill in all required fields');
        return;
    }

    // Show loading state
    const exportButton = document.querySelector('#exportReportModal .btn-primary');
    const originalText = exportButton.innerHTML;
    exportButton.disabled = true;
    exportButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating...';

    // Simulate report generation (replace with actual API call)
    setTimeout(() => {
        // Reset export button
        exportButton.disabled = false;
        exportButton.innerHTML = originalText;

        // Close export modal
        const exportModal = bootstrap.Modal.getInstance(document.getElementById('exportReportModal'));
        exportModal.hide();

        // Show success modal
        const successModal = new bootstrap.Modal(document.getElementById('exportSuccessModal'));
        successModal.show();

        // Store export details for download
        window.lastExport = {
            reportType,
            dateRange,
            fileFormat,
            includeCharts,
            timestamp: new Date().toISOString()
        };
    }, 2000);
}

// Download the exported report
function downloadReport() {
    if (!window.lastExport) return;

    const { reportType, fileFormat, timestamp } = window.lastExport;
    const fileName = `${reportType}_report_${new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '-')}.${fileFormat}`;

    // Simulate file download (replace with actual file download logic)
    const link = document.createElement('a');
    link.href = '#';
    link.download = fileName;
    link.click();

    // Close success modal
    const successModal = bootstrap.Modal.getInstance(document.getElementById('exportSuccessModal'));
    successModal.hide();
}

// Enhanced refresh data functionality
function refreshReports() {
    const button = document.querySelector('.report-actions button');
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Refreshing...';

    // Show loading state for metrics
    document.querySelectorAll('.metric-value').forEach(metric => {
        metric.style.opacity = '0.5';
    });

    // Show loading state for charts
    document.querySelectorAll('canvas').forEach(canvas => {
        canvas.style.opacity = '0.5';
    });

    // Simulate data refresh (replace with actual API calls)
    setTimeout(() => {
        // Update metrics with new random data
        document.getElementById('totalTasks').textContent = Math.floor(Math.random() * 100 + 100);
        
        // Update charts with new data
        updateCharts({
            teams: generateSampleData().teams
        });

        // Update table with new data
        updateReportTable(generateSampleData());

        // Reset loading states
        button.disabled = false;
        button.innerHTML = originalText;
        
        document.querySelectorAll('.metric-value, canvas').forEach(element => {
            element.style.opacity = '1';
        });

        // Show success toast
        showToast('Data refreshed successfully!');
    }, 1500);
}

// Show toast notification
function showToast(message) {
    const toastHTML = `
        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <i class="fas fa-info-circle text-primary me-2"></i>
                    <strong class="me-auto">Notification</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        </div>
    `;

    // Add toast to document
    const toastContainer = document.createElement('div');
    toastContainer.innerHTML = toastHTML;
    document.body.appendChild(toastContainer);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toastContainer.remove();
    }, 3000);
}

// Toggle chart type
function toggleChartType(chartId) {
    const chart = window[`${chartId}Chart`];
    const newType = chart.config.type === 'line' ? 'bar' : 'line';
    chart.config.type = newType;
    chart.update();
}

// View team details
function viewTeamDetails(teamName) {
    // Implement team details view
    console.log(`Viewing details for ${teamName}`);
}

// Export report
function exportReport(format) {
    // Implement report export functionality
    console.log(`Exporting report in ${format} format`);
} 