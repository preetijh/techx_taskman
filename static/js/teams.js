document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar toggle
    document.getElementById('sidebarCollapse')?.addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Initialize filters
    initializeFilters();

    // Load and display teams
    displayTeams();

    // Update department statistics
    updateDepartmentStats();

    // Populate team members select
    populateTeamMembers();
});

// Function to initialize filters
function initializeFilters() {
    document.getElementById('departmentFilter')?.addEventListener('change', filterTeams);
    document.getElementById('searchTeam')?.addEventListener('input', filterTeams);
}

// Function to display teams
function displayTeams() {
    const teamsContainer = document.getElementById('teamsContainer');
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (teams.length === 0) {
        teamsContainer.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    No teams found. Create your first team by clicking the "Create New Team" button.
                </div>
            </div>
        `;
        return;
    }

    teamsContainer.innerHTML = teams.map(team => {
        const teamLeader = users.find(user => user.email === team.leader);
        const teamMembers = team.members.map(email => users.find(user => user.email === email)).filter(Boolean);
        
        return `
            <div class="col-md-4" data-department="${team.department}">
                <div class="team-card">
                    <div class="team-header department-${team.department}" style="background-color: ${team.color}">
                        <h3 class="team-title">${team.name}</h3>
                        ${team.logo ? `<img src="${team.logo}" class="team-logo" alt="${team.name} logo">` : ''}
                    </div>
                    <div class="team-content">
                        <p class="team-description">${team.description}</p>
                        <div class="team-meta">
                            <span class="department-badge department-${team.department}">${team.department}</span>
                            <span class="team-status">${team.status}</span>
                        </div>
                        <div class="team-leader mb-2">
                            <strong>Team Leader:</strong>
                            <div class="d-flex align-items-center">
                                <img src="${teamLeader?.image || 'default-avatar.jpg'}" class="member-avatar" alt="${teamLeader?.name}">
                                <span class="ms-2">${teamLeader?.name || 'Unassigned'}</span>
                            </div>
                        </div>
                        <div class="team-members">
                            ${teamMembers.map(member => `
                                <img src="${member.image || 'default-avatar.jpg'}" 
                                     class="member-avatar" 
                                     alt="${member.name}"
                                     title="${member.name}">
                            `).join('')}
                        </div>
                        <div class="team-actions">
                            <button class="btn btn-sm btn-outline-primary me-2" onclick="viewTeamDetails('${team.id}')">
                                <i class="fas fa-info-circle"></i> Details
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteTeam('${team.id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Function to create new team
function createTeam() {
    const teamName = document.getElementById('teamName').value;
    const teamDescription = document.getElementById('teamDescription').value;
    const teamDepartment = document.getElementById('teamDepartment').value;
    const teamLeader = document.getElementById('teamLeader').value;
    const teamMembers = Array.from(document.getElementById('teamMembers').selectedOptions).map(option => option.value);
    const teamColor = document.getElementById('teamColor').value;
    const teamStatus = document.getElementById('teamStatus').value;
    const teamLogo = document.getElementById('teamLogo').files[0];

    if (!teamName || !teamDescription || !teamDepartment || !teamLeader || teamMembers.length === 0) {
        alert('Please fill in all required fields');
        return;
    }

    const newTeam = {
        id: Date.now().toString(),
        name: teamName,
        description: teamDescription,
        department: teamDepartment,
        leader: teamLeader,
        members: teamMembers,
        color: teamColor,
        status: teamStatus,
        logo: teamLogo ? URL.createObjectURL(teamLogo) : null,
        createdAt: new Date().toISOString()
    };

    let teams = JSON.parse(localStorage.getItem('teams') || '[]');
    teams.push(newTeam);
    localStorage.setItem('teams', JSON.stringify(teams));

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('createTeamModal'));
    modal.hide();

    // Reset form
    document.getElementById('createTeamForm').reset();

    // Refresh display
    displayTeams();
    updateDepartmentStats();
}

// Function to populate team members select
function populateTeamMembers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const leaderSelect = document.getElementById('teamLeader');
    const membersSelect = document.getElementById('teamMembers');

    if (leaderSelect && membersSelect) {
        // Clear existing options
        leaderSelect.innerHTML = '<option value="">Select Team Leader</option>';
        membersSelect.innerHTML = '';

        // Add users to both selects
        users.forEach(user => {
            leaderSelect.add(new Option(user.name, user.email));
            membersSelect.add(new Option(user.name, user.email));
        });
    }
}

// Function to filter teams
function filterTeams() {
    const department = document.getElementById('departmentFilter').value;
    const searchText = document.getElementById('searchTeam').value.toLowerCase();
    const teamCards = document.querySelectorAll('#teamsContainer > div');

    teamCards.forEach(card => {
        const teamDepartment = card.dataset.department;
        const teamName = card.querySelector('.team-title').textContent.toLowerCase();
        const departmentMatch = !department || teamDepartment === department;
        const searchMatch = !searchText || teamName.includes(searchText);

        card.style.display = departmentMatch && searchMatch ? '' : 'none';
    });
}

// Function to update department statistics
function updateDepartmentStats() {
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    const stats = {
        development: { count: 0, members: 0 },
        design: { count: 0, members: 0 },
        marketing: { count: 0, members: 0 },
        sales: { count: 0, members: 0 },
        hr: { count: 0, members: 0 }
    };

    teams.forEach(team => {
        if (stats[team.department]) {
            stats[team.department].count++;
            stats[team.department].members += team.members.length;
        }
    });

    const statsContainer = document.getElementById('departmentStats');
    statsContainer.innerHTML = Object.entries(stats).map(([dept, data]) => `
        <div class="col-md-4 col-lg-2">
            <div class="department-stat-card">
                <div class="stat-icon department-${dept}">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-value">${data.count}</div>
                <div class="stat-label">${dept.charAt(0).toUpperCase() + dept.slice(1)} Teams</div>
                <small class="text-muted">${data.members} Members</small>
            </div>
        </div>
    `).join('');
}

// Function to view team details
function viewTeamDetails(teamId) {
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const team = teams.find(t => t.id === teamId);

    if (team) {
        const teamLeader = users.find(user => user.email === team.leader);
        const teamMembers = team.members.map(email => users.find(user => user.email === email)).filter(Boolean);

        const detailsContent = document.getElementById('teamDetailsContent');
        detailsContent.innerHTML = `
            <div class="team-details-header">
                ${team.logo ? `<img src="${team.logo}" class="team-details-logo" alt="${team.name} logo">` : ''}
                <h4>${team.name}</h4>
                <span class="department-badge department-${team.department}">${team.department}</span>
            </div>
            <div class="team-details-stats">
                <div class="team-details-stat">
                    <div class="stat-value">${teamMembers.length}</div>
                    <div class="stat-label">Members</div>
                </div>
                <div class="team-details-stat">
                    <div class="stat-value">12</div>
                    <div class="stat-label">Active Projects</div>
                </div>
                <div class="team-details-stat">
                    <div class="stat-value">89%</div>
                    <div class="stat-label">Completion Rate</div>
                </div>
            </div>
            <div class="mb-3">
                <h5>Description</h5>
                <p>${team.description}</p>
            </div>
            <div class="mb-3">
                <h5>Team Leader</h5>
                <div class="d-flex align-items-center">
                    <img src="${teamLeader?.image || 'default-avatar.jpg'}" class="member-avatar me-2" alt="${teamLeader?.name}">
                    <span>${teamLeader?.name || 'Unassigned'}</span>
                </div>
            </div>
            <div class="mb-3">
                <h5>Team Members</h5>
                <div class="row">
                    ${teamMembers.map(member => `
                        <div class="col-md-6 mb-2">
                            <div class="d-flex align-items-center">
                                <img src="${member.image || 'default-avatar.jpg'}" class="member-avatar me-2" alt="${member.name}">
                                <span>${member.name}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('teamDetailsModal'));
        modal.show();
    }
}

// Function to delete team
function deleteTeam(teamId) {
    if (confirm('Are you sure you want to delete this team?')) {
        let teams = JSON.parse(localStorage.getItem('teams') || '[]');
        teams = teams.filter(team => team.id !== teamId);
        localStorage.setItem('teams', JSON.stringify(teams));
        
        displayTeams();
        updateDepartmentStats();
    }
} 