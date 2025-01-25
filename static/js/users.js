document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar toggle
    document.getElementById('sidebarCollapse')?.addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Load and display users
    displayUsers();
});

// Function to display users
function displayUsers() {
    const userCardsContainer = document.getElementById('userCardsContainer');
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.length === 0) {
        userCardsContainer.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    No users found. Add your first user by clicking the "Add New User" button.
                </div>
            </div>
        `;
        return;
    }

    userCardsContainer.innerHTML = users.map(user => `
        <div class="col-md-4 col-lg-3">
            <div class="user-card">
                <div class="user-info">
                    <img src="${user.image || 'default-avatar.jpg'}" alt="${user.name}" class="user-avatar">
                    <h5 class="user-name">${user.name}</h5>
                    <div class="role-badge ${user.role.toLowerCase()}">${user.role}</div>
                    <p class="user-role">${user.email}</p>
                    
                    <div class="user-stats">
                        <div class="stat-item">
                            <div class="stat-value">12</div>
                            <div class="stat-label">Tasks</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">8</div>
                            <div class="stat-label">Completed</div>
                        </div>
                    </div>
                    
                    <div class="user-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="editUser('${user.email}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteUser('${user.email}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Function to delete user
function deleteUser(email) {
    if (confirm('Are you sure you want to delete this user?')) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.filter(user => user.email !== email);
        localStorage.setItem('users', JSON.stringify(users));
        displayUsers();
    }
}

// Function to edit user
function editUser(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);
    if (user) {
        // Here you would typically populate a modal with user data
        console.log('Editing user:', user);
        // Implement edit functionality as needed
    }
}

// Function to toggle password visibility
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

    // Create new user object
    const newUser = {
        name: userName,
        email: userEmail,
        password: userPassword, // In production, this should be handled securely
        role: userRole,
        team: userTeam,
        image: userImage ? URL.createObjectURL(userImage) : 'default-avatar.jpg',
        createdAt: new Date().toISOString()
    };

    // Get existing users or initialize empty array
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if email already exists
    if (users.some(user => user.email === userEmail)) {
        alert('A user with this email already exists');
        return;
    }

    // Add new user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Close add user modal
    const addUserModal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
    addUserModal.hide();

    // Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('userAddedModal'));
    successModal.show();

    // Reset form
    document.getElementById('addUserForm').reset();

    // Refresh user display
    displayUsers();
}

// Add event listener for file input
document.getElementById('userImage')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file && file.size > maxSize) {
        alert('File size must be less than 5MB');
        this.value = '';
    }
}); 