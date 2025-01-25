document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle
    document.getElementById('sidebarCollapse').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Handle navigation
    document.querySelectorAll('#sidebar a').forEach(link => {
        link.addEventListener('click', function(e) {
            const page = this.getAttribute('data-page');
            
            if (this.hasAttribute('href') && this.getAttribute('href') !== '#') {
                // Don't prevent default if it has a real href
                return;
            }
            
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('#sidebar li').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked link's parent
            this.parentElement.classList.add('active');
            
            // Handle navigation based on data-page attribute
            switch(page) {
                case 'dashboard':
                    window.location.href = 'admin-dashboard.html';
                    break;
                case 'tasks':
                    window.location.href = 'tasks.html';
                    break;
                case 'users':
                    window.location.href = 'users.html';
                    break;
                // Add other cases as needed
                default:
                    console.log(`Navigating to ${page}`);
            }
        });
    });

    // Sample function to add new task
    document.querySelector('#addTaskModal .btn-primary').addEventListener('click', function() {
        const form = document.getElementById('addTaskForm');
        if (form.checkValidity()) {
            // Here you would typically handle the form submission
            alert('Task added successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
            modal.hide();
        } else {
            form.reportValidity();
        }
    });

    // Sample function to handle notifications
    document.getElementById('notificationDropdown').addEventListener('click', function() {
        // Here you would typically fetch notifications
        console.log('Fetching notifications...');
    });

    // Update users table when page loads
    updateUsersTable();

    // Populate team members when create team modal is opened
    document.getElementById('createTeamModal').addEventListener('show.bs.modal', function() {
        populateTeamMembers();
    });
    
    // Update teams display
    updateTeamsDisplay();

    // Handle date range selection
    document.getElementById('dateRange')?.addEventListener('change', function() {
        const customDateRange = document.getElementById('customDateRange');
        if (this.value === 'custom') {
            customDateRange.style.display = 'block';
        } else {
            customDateRange.style.display = 'none';
        }
    });
});

// Function to handle task deletion
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        // Here you would typically handle the deletion
        console.log(`Deleting task ${taskId}`);
    }
}

// Function to handle task editing
function editTask(taskId) {
    // Here you would typically handle the editing
    console.log(`Editing task ${taskId}`);
}

// Function to handle user logout
function logout() {
    // Here you would typically handle the logout process
    window.location.href = 'admin-login.html';
}

// Function to toggle password visibility in add user form
function toggleUserPassword() {
    const passwordInput = document.getElementById('userPassword');
    const toggleButton = document.querySelector('#addUserModal .input-group button i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.classList.remove('fa-eye');
        toggleButton.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleButton.classList.remove('fa-eye-slash');
        toggleButton.classList.add('fa-eye');
    }
}

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to add new user
function addNewUser() {
    // Get form elements
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const userPassword = document.getElementById('userPassword').value;
    const userRole = document.getElementById('userRole').value;
    const userTeam = document.getElementById('userTeam').value;
    const userImage = document.getElementById('userImage').files[0];

    // Validate form
    if (!userName || !userEmail || !userPassword || !userRole || !userTeam) {
        alert('Please fill in all required fields');
        return;
    }

    if (!isValidEmail(userEmail)) {
        alert('Please enter a valid email address');
        return;
    }

    if (userPassword.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    // Create user object
    const newUser = {
        name: userName,
        email: userEmail,
        password: userPassword,
        role: userRole,
        team: userTeam,
        createdAt: new Date().toISOString()
    };

    // Here you would typically send this data to your backend
    console.log('New user data:', newUser);

    // For demonstration, we'll store in localStorage
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Close the add user modal
    const addUserModal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
    addUserModal.hide();

    // Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('userAddedModal'));
    successModal.show();

    // Reset form
    document.getElementById('addUserForm').reset();

    // Update users table if it exists
    updateUsersTable();
}

// Function to update users table
function updateUsersTable() {
    const usersTableBody = document.querySelector('#usersTable tbody');
    if (usersTableBody) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        usersTableBody.innerHTML = users.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.team}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="editUser('${user.email}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.email}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// Add event listener for file input
document.getElementById('userImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file && file.size > maxSize) {
        alert('File size must be less than 5MB');
        this.value = '';
    }
});

// Function to populate team members select
function populateTeamMembers() {
    const teamLeaderSelect = document.getElementById('teamLeader');
    const teamMembersSelect = document.getElementById('teamMembers');
    
    // Get users from localStorage (replace with API call in production)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Clear existing options
    teamLeaderSelect.innerHTML = '<option value="">Select Team Leader</option>';
    teamMembersSelect.innerHTML = '';
    
    // Add users to both selects
    users.forEach(user => {
        // Add to team leader select
        const leaderOption = new Option(user.name, user.email);
        teamLeaderSelect.add(leaderOption);
        
        // Add to team members select
        const memberOption = new Option(user.name, user.email);
        teamMembersSelect.add(memberOption);
    });
}

// Function to create new team
function createNewTeam() {
    // Get form values
    const teamName = document.getElementById('teamName').value;
    const teamDescription = document.getElementById('teamDescription').value;
    const teamLeader = document.getElementById('teamLeader').value;
    const teamMembers = Array.from(document.getElementById('teamMembers').selectedOptions)
        .map(option => option.value);
    const teamColor = document.getElementById('teamColor').value;
    const teamDepartment = document.getElementById('teamDepartment').value;

    // Validate form
    if (!teamName || !teamDescription || !teamLeader || teamMembers.length === 0 || !teamDepartment) {
        alert('Please fill in all required fields');
        return;
    }

    // Create team object
    const newTeam = {
        id: Date.now().toString(),
        name: teamName,
        description: teamDescription,
        leader: teamLeader,
        members: teamMembers,
        color: teamColor,
        department: teamDepartment,
        createdAt: new Date().toISOString()
    };

    // Save team (replace with API call in production)
    let teams = JSON.parse(localStorage.getItem('teams') || '[]');
    teams.push(newTeam);
    localStorage.setItem('teams', JSON.stringify(teams));

    // Close create team modal
    const createTeamModal = bootstrap.Modal.getInstance(document.getElementById('createTeamModal'));
    createTeamModal.hide();

    // Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('teamCreatedModal'));
    successModal.show();

    // Reset form
    document.getElementById('createTeamForm').reset();

    // Update teams display
    updateTeamsDisplay();
}

// Function to update teams display
function updateTeamsDisplay() {
    const teamsContainer = document.querySelector('#teamsContainer');
    if (teamsContainer) {
        const teams = JSON.parse(localStorage.getItem('teams') || '[]');
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        teamsContainer.innerHTML = teams.map(team => {
            const leader = users.find(user => user.email === team.leader);
            const members = team.members
                .map(memberEmail => users.find(user => user.email === memberEmail))
                .filter(member => member); // Filter out undefined members

            return `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card team-card">
                        <div class="card-header" style="background-color: ${team.color}20">
                            <h5 class="card-title mb-0 d-flex justify-content-between align-items-center">
                                ${team.name}
                                <div class="dropdown">
                                    <button class="btn btn-link" data-bs-toggle="dropdown">
                                        <i class="fas fa-ellipsis-v"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="#" onclick="editTeam('${team.id}')">
                                            <i class="fas fa-edit me-2"></i>Edit Team
                                        </a></li>
                                        <li><a class="dropdown-item" href="#" onclick="deleteTeam('${team.id}')">
                                            <i class="fas fa-trash me-2"></i>Delete Team
                                        </a></li>
                                    </ul>
                                </div>
                            </h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text">${team.description}</p>
                            <div class="mb-3">
                                <strong>Team Leader:</strong>
                                <div class="d-flex align-items-center">
                                    <img src="default-avatar.png" class="team-member-avatar" alt="${leader?.name || 'Unknown'}">
                                    ${leader?.name || 'Unknown'}
                                </div>
                            </div>
                            <div>
                                <strong>Team Members:</strong>
                                <div class="team-members-list mt-2">
                                    ${members.map(member => `
                                        <div class="d-flex align-items-center mb-1">
                                            <img src="default-avatar.png" class="team-member-avatar" alt="${member.name}">
                                            ${member.name}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-muted">
                            <small>Department: ${team.department}</small>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Function to delete team
function deleteTeam(teamId) {
    if (confirm('Are you sure you want to delete this team?')) {
        let teams = JSON.parse(localStorage.getItem('teams') || '[]');
        teams = teams.filter(team => team.id !== teamId);
        localStorage.setItem('teams', JSON.stringify(teams));
        updateTeamsDisplay();
    }
}

// Function to delete user
function deleteUser(email) {
    if (confirm('Are you sure you want to delete this user?')) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.filter(user => user.email !== email);
        localStorage.setItem('users', JSON.stringify(users));
        updateUsersTable();
    }
}

// Function to edit user
function editUser(email) {
    // Here you would typically handle the editing
    console.log(`Editing user ${email}`);
}

// Function to edit team
function editTeam(teamId) {
    // Here you would typically handle the editing
    console.log(`Editing team ${teamId}`);
}

// Function to generate sample data for preview
function generateSampleData(reportType) {
    switch(reportType) {
        case 'task_summary':
            return {
                total_tasks: 150,
                completed: 85,
                in_progress: 45,
                pending: 20,
                tasks_by_priority: {
                    high: 30,
                    medium: 70,
                    low: 50
                }
            };
        case 'team_performance':
            return {
                teams: [
                    { name: 'Frontend Team', completed_tasks: 45, efficiency: 92 },
                    { name: 'Backend Team', completed_tasks: 38, efficiency: 88 },
                    { name: 'Design Team', completed_tasks: 25, efficiency: 95 }
                ]
            };
        default:
            return {};
    }
}

// Function to preview report
function previewReport() {
    const reportType = document.getElementById('reportType').value;
    const dateRange = document.getElementById('dateRange').value;
    const previewDiv = document.getElementById('reportPreview');
    const previewContent = document.querySelector('.report-preview-content');

    if (!reportType || !dateRange) {
        alert('Please select report type and date range');
        return;
    }

    const data = generateSampleData(reportType);
    let previewHTML = '';

    switch(reportType) {
        case 'task_summary':
            previewHTML = `
                <div class="table-responsive">
                    <table class="report-preview-table">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Total Tasks</td>
                                <td>${data.total_tasks}</td>
                            </tr>
                            <tr>
                                <td>Completed Tasks</td>
                                <td>${data.completed}</td>
                            </tr>
                            <tr>
                                <td>In Progress</td>
                                <td>${data.in_progress}</td>
                            </tr>
                            <tr>
                                <td>Pending</td>
                                <td>${data.pending}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            break;
        case 'team_performance':
            previewHTML = `
                <div class="table-responsive">
                    <table class="report-preview-table">
                        <thead>
                            <tr>
                                <th>Team</th>
                                <th>Completed Tasks</th>
                                <th>Efficiency</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.teams.map(team => `
                                <tr>
                                    <td>${team.name}</td>
                                    <td>${team.completed_tasks}</td>
                                    <td>${team.efficiency}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            break;
    }

    previewContent.innerHTML = previewHTML;
    previewDiv.style.display = 'block';
}

// Function to export report
function exportReport() {
    const reportType = document.getElementById('reportType').value;
    const exportFormat = document.getElementById('exportFormat').value;
    const dateRange = document.getElementById('dateRange').value;

    if (!reportType || !exportFormat || !dateRange) {
        alert('Please fill in all required fields');
        return;
    }

    // Hide export modal and show progress modal
    const exportModal = bootstrap.Modal.getInstance(document.getElementById('exportReportModal'));
    exportModal.hide();
    const progressModal = new bootstrap.Modal(document.getElementById('exportProgressModal'));
    progressModal.show();

    // Simulate progress
    const progressBar = document.querySelector('#exportProgressModal .progress-bar');
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                progressModal.hide();
                generateReport(reportType, exportFormat);
            }, 500);
        }
    }, 200);
}

// Function to generate and download report
function generateReport(reportType, exportFormat) {
    const data = generateSampleData(reportType);
    let content = '';
    let fileName = `${reportType}_report_${new Date().toISOString().split('T')[0]}`;

    switch(exportFormat) {
        case 'csv':
            content = generateCSV(data, reportType);
            fileName += '.csv';
            downloadFile(content, fileName, 'text/csv');
            break;
        case 'excel':
            // In a real application, you would use a library like SheetJS
            alert('Excel export would be implemented with a proper Excel library');
            break;
        case 'pdf':
            // In a real application, you would use a library like jsPDF
            alert('PDF export would be implemented with a proper PDF library');
            break;
    }
}

// Function to generate CSV content
function generateCSV(data, reportType) {
    let csv = '';
    
    switch(reportType) {
        case 'task_summary':
            csv = 'Metric,Value\n';
            csv += `Total Tasks,${data.total_tasks}\n`;
            csv += `Completed Tasks,${data.completed}\n`;
            csv += `In Progress,${data.in_progress}\n`;
            csv += `Pending,${data.pending}\n`;
            break;
        case 'team_performance':
            csv = 'Team,Completed Tasks,Efficiency\n';
            data.teams.forEach(team => {
                csv += `${team.name},${team.completed_tasks},${team.efficiency}%\n`;
            });
            break;
    }
    
    return csv;
}

// Function to download file
function downloadFile(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
} 