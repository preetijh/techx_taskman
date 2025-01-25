document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar toggle
    document.getElementById('sidebarCollapse')?.addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Initialize forms
    initializeForms();
    
    // Initialize profile image upload
    initializeImageUpload();
    
    // Load login history
    loadLoginHistory();
});

// Initialize all forms
function initializeForms() {
    // Profile form
    document.getElementById('profileForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        updateProfile();
    });

    // Security form
    document.getElementById('securityForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        updatePassword();
    });

    // Notification form
    document.getElementById('notificationForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        updateNotificationPreferences();
    });
}

// Profile image upload
function initializeImageUpload() {
    const imageUpload = document.getElementById('imageUpload');
    const profileImage = document.getElementById('profileImage');

    imageUpload?.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result;
                showSuccessModal('Profile picture updated successfully!');
            };
            reader.readAsDataURL(file);
        }
    });
}

// Update profile
function updateProfile() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const bio = document.getElementById('bio').value;

    // Here you would typically make an API call to update the profile
    // For now, we'll just show a success message
    showSuccessModal('Profile updated successfully!');
}

// Update password
function updatePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
    }

    if (newPassword.length < 8) {
        alert('Password must be at least 8 characters long!');
        return;
    }

    // Here you would typically make an API call to update the password
    // For now, we'll just show a success message
    showSuccessModal('Password updated successfully!');
    document.getElementById('securityForm').reset();
}

// Update notification preferences
function updateNotificationPreferences() {
    const preferences = {
        emailTaskUpdates: document.getElementById('emailTaskUpdates').checked,
        emailTeamUpdates: document.getElementById('emailTeamUpdates').checked,
        emailReports: document.getElementById('emailReports').checked,
        systemAlerts: document.getElementById('systemAlerts').checked,
        taskReminders: document.getElementById('taskReminders').checked
    };

    // Here you would typically make an API call to update preferences
    // For now, we'll just show a success message
    showSuccessModal('Notification preferences updated successfully!');
}

// Load login history
function loadLoginHistory() {
    const loginHistory = document.querySelector('.login-history');
    if (!loginHistory) return;

    // Sample login history data
    const history = [
        { date: '2024-03-15 09:30:45', ip: '192.168.1.1', device: 'Chrome on Windows' },
        { date: '2024-03-14 14:22:31', ip: '192.168.1.1', device: 'Safari on iPhone' },
        { date: '2024-03-13 11:15:22', ip: '192.168.1.1', device: 'Chrome on MacOS' }
    ];

    loginHistory.innerHTML = history.map(entry => `
        <div class="login-entry">
            <div class="d-flex justify-content-between">
                <span><i class="fas fa-clock me-2"></i>${formatDate(entry.date)}</span>
                <span><i class="fas fa-desktop me-2"></i>${entry.device}</span>
            </div>
            <small class="text-muted"><i class="fas fa-map-marker-alt me-2"></i>IP: ${entry.ip}</small>
        </div>
    `).join('');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

// Show success modal
function showSuccessModal(message) {
    document.getElementById('successMessage').textContent = message;
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

// Toggle two-factor authentication
document.getElementById('twoFactorAuth')?.addEventListener('change', function(e) {
    if (e.target.checked) {
        // Here you would typically initiate 2FA setup
        alert('Two-factor authentication setup wizard would launch here.');
    }
}); 