class HeaderProfileSettings {
    constructor() {
        this.initializeComponents();
        this.setupEventListeners();
        this.addModals();
    }

    initializeComponents() {
        // Load user data
        this.userData = JSON.parse(localStorage.getItem('userData')) || {
            displayName: 'Admin User',
            email: 'admin@techxsolution.com',
            role: 'Administrator',
            phone: '+1 234 567 890',
            location: 'New York, USA',
            bio: 'System Administrator',
            settings: {
                theme: 'light',
                notifications: true,
                emailAlerts: true,
                language: 'en',
                timezone: 'UTC-5'
            }
        };

        // Update header display
        this.updateHeaderDisplay();
    }

    setupEventListeners() {
        // Profile menu items
        document.querySelector('[data-action="view-profile"]')?.addEventListener('click', () => {
            this.showProfileModal();
        });

        document.querySelector('[data-action="edit-profile"]')?.addEventListener('click', () => {
            this.showEditProfileModal();
        });

        // Settings menu items
        document.querySelector('[data-action="general-settings"]')?.addEventListener('click', () => {
            this.showGeneralSettingsModal();
        });

        document.querySelector('[data-action="security-settings"]')?.addEventListener('click', () => {
            this.showSecuritySettingsModal();
        });

        // Form submissions
        document.getElementById('editProfileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });

        document.getElementById('generalSettingsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateGeneralSettings();
        });

        document.getElementById('securitySettingsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateSecuritySettings();
        });
    }

    addModals() {
        const modalsHTML = `
            <!-- Profile View Modal -->
            <div class="modal fade" id="viewProfileModal">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Profile Details</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="text-center mb-4">
                                <img src="admin-avatar.jpg" alt="Profile" id="profileImage" 
                                     class="rounded-circle mb-3" style="width: 150px; height: 150px; object-fit: cover;">
                                <h4 id="profileName">Admin User</h4>
                                <p class="text-muted" id="profileRole">Administrator</p>
                            </div>
                            <div class="profile-info">
                                <div class="info-item mb-3">
                                    <i class="fas fa-envelope me-2"></i>
                                    <span id="profileEmail">admin@example.com</span>
                                </div>
                                <div class="info-item mb-3">
                                    <i class="fas fa-phone me-2"></i>
                                    <span id="profilePhone">+1 234 567 890</span>
                                </div>
                                <div class="info-item mb-3">
                                    <i class="fas fa-map-marker-alt me-2"></i>
                                    <span id="profileLocation">New York, USA</span>
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-info-circle me-2"></i>
                                    <span id="profileBio">System Administrator</span>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="headerProfileSettings.showEditProfileModal()">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Edit Profile Modal -->
            <div class="modal fade" id="editProfileModal">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Profile</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editProfileForm">
                                <div class="text-center mb-4">
                                    <div class="position-relative d-inline-block">
                                        <img src="admin-avatar.jpg" alt="Profile" id="editProfileImage" 
                                             class="rounded-circle" style="width: 150px; height: 150px; object-fit: cover;">
                                        <label for="profileImageInput" class="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2" 
                                               style="cursor: pointer;">
                                            <i class="fas fa-camera"></i>
                                            <input type="file" id="profileImageInput" hidden accept="image/*">
                                        </label>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Display Name</label>
                                    <input type="text" class="form-control" id="editDisplayName" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" id="editEmail" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Phone</label>
                                    <input type="tel" class="form-control" id="editPhone">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Location</label>
                                    <input type="text" class="form-control" id="editLocation">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Bio</label>
                                    <textarea class="form-control" id="editBio" rows="3"></textarea>
                                </div>
                                <div class="d-grid">
                                    <button type="submit" class="btn btn-primary">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- General Settings Modal -->
            <div class="modal fade" id="generalSettingsModal">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">General Settings</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="generalSettingsForm">
                                <div class="mb-4">
                                    <h6>Theme</h6>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="theme" id="lightTheme" value="light">
                                        <label class="form-check-label" for="lightTheme">Light Mode</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="theme" id="darkTheme" value="dark">
                                        <label class="form-check-label" for="darkTheme">Dark Mode</label>
                                    </div>
                                </div>
                                <div class="mb-4">
                                    <h6>Notifications</h6>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="pushNotifications">
                                        <label class="form-check-label" for="pushNotifications">Push Notifications</label>
                                    </div>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="emailAlerts">
                                        <label class="form-check-label" for="emailAlerts">Email Alerts</label>
                                    </div>
                                </div>
                                <div class="mb-4">
                                    <h6>Language & Region</h6>
                                    <div class="mb-3">
                                        <label class="form-label">Language</label>
                                        <select class="form-select" id="language">
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                            <option value="de">German</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Timezone</label>
                                        <select class="form-select" id="timezone">
                                            <option value="UTC-8">Pacific Time (PT)</option>
                                            <option value="UTC-5">Eastern Time (ET)</option>
                                            <option value="UTC+0">UTC</option>
                                            <option value="UTC+1">Central European Time (CET)</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="d-grid">
                                    <button type="submit" class="btn btn-primary">Save Settings</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Security Settings Modal -->
            <div class="modal fade" id="securitySettingsModal">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Security Settings</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="securitySettingsForm">
                                <div class="mb-4">
                                    <h6>Change Password</h6>
                                    <div class="mb-3">
                                        <label class="form-label">Current Password</label>
                                        <input type="password" class="form-control" id="currentPassword" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">New Password</label>
                                        <input type="password" class="form-control" id="newPassword" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Confirm New Password</label>
                                        <input type="password" class="form-control" id="confirmPassword" required>
                                    </div>
                                </div>
                                <div class="mb-4">
                                    <h6>Two-Factor Authentication</h6>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="twoFactorAuth">
                                        <label class="form-check-label" for="twoFactorAuth">Enable 2FA</label>
                                    </div>
                                </div>
                                <div class="d-grid">
                                    <button type="submit" class="btn btn-primary">Update Security Settings</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalsHTML);
    }

    showProfileModal() {
        // Update profile view with current data
        document.getElementById('profileName').textContent = this.userData.displayName;
        document.getElementById('profileRole').textContent = this.userData.role;
        document.getElementById('profileEmail').textContent = this.userData.email;
        document.getElementById('profilePhone').textContent = this.userData.phone;
        document.getElementById('profileLocation').textContent = this.userData.location;
        document.getElementById('profileBio').textContent = this.userData.bio;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('viewProfileModal'));
        modal.show();
    }

    showEditProfileModal() {
        // Close view profile modal if open
        bootstrap.Modal.getInstance(document.getElementById('viewProfileModal'))?.hide();

        // Populate form with current data
        document.getElementById('editDisplayName').value = this.userData.displayName;
        document.getElementById('editEmail').value = this.userData.email;
        document.getElementById('editPhone').value = this.userData.phone;
        document.getElementById('editLocation').value = this.userData.location;
        document.getElementById('editBio').value = this.userData.bio;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editProfileModal'));
        modal.show();
    }

    showGeneralSettingsModal() {
        // Populate form with current settings
        document.querySelector(`input[name="theme"][value="${this.userData.settings.theme}"]`).checked = true;
        document.getElementById('pushNotifications').checked = this.userData.settings.notifications;
        document.getElementById('emailAlerts').checked = this.userData.settings.emailAlerts;
        document.getElementById('language').value = this.userData.settings.language;
        document.getElementById('timezone').value = this.userData.settings.timezone;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('generalSettingsModal'));
        modal.show();
    }

    showSecuritySettingsModal() {
        // Reset form
        document.getElementById('securitySettingsForm').reset();
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('securitySettingsModal'));
        modal.show();
    }

    updateProfile() {
        // Update user data
        this.userData = {
            ...this.userData,
            displayName: document.getElementById('editDisplayName').value,
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            location: document.getElementById('editLocation').value,
            bio: document.getElementById('editBio').value
        };

        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(this.userData));

        // Update header display
        this.updateHeaderDisplay();

        // Show success message and close modal
        this.showToast('Profile updated successfully');
        bootstrap.Modal.getInstance(document.getElementById('editProfileModal')).hide();
    }

    updateGeneralSettings() {
        // Update settings
        this.userData.settings = {
            ...this.userData.settings,
            theme: document.querySelector('input[name="theme"]:checked').value,
            notifications: document.getElementById('pushNotifications').checked,
            emailAlerts: document.getElementById('emailAlerts').checked,
            language: document.getElementById('language').value,
            timezone: document.getElementById('timezone').value
        };

        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(this.userData));

        // Apply theme
        this.applyTheme(this.userData.settings.theme);

        // Show success message and close modal
        this.showToast('Settings updated successfully');
        bootstrap.Modal.getInstance(document.getElementById('generalSettingsModal')).hide();
    }

    updateSecuritySettings() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate passwords
        if (newPassword !== confirmPassword) {
            this.showToast('New passwords do not match', 'error');
            return;
        }

        // Update 2FA setting
        this.userData.settings.twoFactorAuth = document.getElementById('twoFactorAuth').checked;

        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(this.userData));

        // Show success message and close modal
        this.showToast('Security settings updated successfully');
        bootstrap.Modal.getInstance(document.getElementById('securitySettingsModal')).hide();
    }

    updateHeaderDisplay() {
        // Update header username
        document.querySelector('#userDropdown span').textContent = this.userData.displayName;
        
        // Update avatar if exists
        const profileImage = localStorage.getItem('profileImage');
        if (profileImage) {
            document.querySelectorAll('.avatar').forEach(avatar => {
                avatar.src = profileImage;
            });
        }
    }

    applyTheme(theme) {
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${theme}`);
    }

    showToast(message, type = 'success') {
        const toastHTML = `
            <div class="toast-container position-fixed top-0 end-0 p-3">
                <div class="toast" role="alert">
                    <div class="toast-header">
                        <i class="fas fa-${type === 'success' ? 'check-circle text-success' : 'exclamation-circle text-danger'} me-2"></i>
                        <strong class="me-auto">${type === 'success' ? 'Success' : 'Error'}</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body">${message}</div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', toastHTML);
        const toastElement = document.querySelector('.toast:last-child');
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();

        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.parentElement.remove();
        });
    }
}

// Initialize the header profile and settings functionality
const headerProfileSettings = new HeaderProfileSettings(); 