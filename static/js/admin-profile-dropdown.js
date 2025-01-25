class AdminProfileDropdown {
    constructor() {
        this.initializeDropdown();
        this.setupEventListeners();
        this.addProfileModal();
    }

    initializeDropdown() {
        // Update profile info from localStorage
        this.updateProfileDisplay();
    }

    setupEventListeners() {
        // Profile button click
        document.querySelector('[data-action="profile"]')?.addEventListener('click', () => {
            this.showProfileModal();
        });

        // Settings button click
        document.querySelector('[data-action="settings"]')?.addEventListener('click', () => {
            window.location.href = 'settings.html';
        });

        // Logout button click
        document.querySelector('[data-action="logout"]')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });

        // Profile form submission
        document.getElementById('quickProfileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });

        // Profile image upload
        document.getElementById('profileImageUpload')?.addEventListener('change', (e) => {
            this.handleProfileImageUpload(e);
        });
    }

    addProfileModal() {
        const modalHTML = `
            <div class="modal fade" id="quickProfileModal">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Quick Profile Update</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="quickProfileForm">
                                <!-- Profile Image -->
                                <div class="text-center mb-4">
                                    <div class="profile-image-container">
                                        <img src="admin-avatar.jpg" alt="Profile" id="profilePreview" 
                                             class="rounded-circle" style="width: 120px; height: 120px; object-fit: cover;">
                                        <div class="image-upload-overlay">
                                            <label for="profileImageUpload" class="mb-0">
                                                <i class="fas fa-camera"></i>
                                                <input type="file" id="profileImageUpload" accept="image/*" hidden>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Profile Info -->
                                <div class="mb-3">
                                    <label class="form-label">Display Name</label>
                                    <input type="text" class="form-control" id="displayName" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" id="emailAddress" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Role</label>
                                    <input type="text" class="form-control" id="userRole" readonly>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Bio</label>
                                    <textarea class="form-control" id="userBio" rows="3"></textarea>
                                </div>

                                <div class="d-grid">
                                    <button type="submit" class="btn btn-primary">
                                        Update Profile
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    showProfileModal() {
        // Load current profile data
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        document.getElementById('displayName').value = userData.displayName || 'Admin User';
        document.getElementById('emailAddress').value = userData.email || 'admin@example.com';
        document.getElementById('userRole').value = userData.role || 'Administrator';
        document.getElementById('userBio').value = userData.bio || '';
        
        // Show profile image
        const profileImage = localStorage.getItem('profileImage');
        if (profileImage) {
            document.getElementById('profilePreview').src = profileImage;
        }

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('quickProfileModal'));
        modal.show();
    }

    handleProfileImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                // Update preview
                document.getElementById('profilePreview').src = imageData;
                // Update header avatar
                document.querySelectorAll('.avatar').forEach(avatar => {
                    avatar.src = imageData;
                });
                // Save to localStorage
                localStorage.setItem('profileImage', imageData);
            };
            reader.readAsDataURL(file);
        }
    }

    updateProfile() {
        const userData = {
            displayName: document.getElementById('displayName').value,
            email: document.getElementById('emailAddress').value,
            role: document.getElementById('userRole').value,
            bio: document.getElementById('userBio').value,
            lastUpdated: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(userData));

        // Update display
        this.updateProfileDisplay();

        // Show success message
        this.showToast('Profile updated successfully!');

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('quickProfileModal')).hide();
    }

    updateProfileDisplay() {
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        const profileImage = localStorage.getItem('profileImage');

        // Update header display name
        document.querySelector('#userDropdown span').textContent = 
            userData.displayName || 'Admin User';

        // Update avatar if exists
        if (profileImage) {
            document.querySelectorAll('.avatar').forEach(avatar => {
                avatar.src = profileImage;
            });
        }
    }

    handleLogout() {
        Swal.fire({
            title: 'Logout Confirmation',
            text: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout'
        }).then((result) => {
            if (result.isConfirmed) {
                // Clear user data
                localStorage.removeItem('userData');
                localStorage.removeItem('profileImage');
                localStorage.removeItem('userSettings');
                
                // Show logout message
                Swal.fire({
                    title: 'Logged Out!',
                    text: 'You have been successfully logged out.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    // Redirect to login page
                    window.location.href = 'admin-login.html';
                });
            }
        });
    }

    showToast(message) {
        const toastHTML = `
            <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div class="toast" role="alert">
                    <div class="toast-header">
                        <i class="fas fa-check-circle text-success me-2"></i>
                        <strong class="me-auto">Success</strong>
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

// Initialize the dropdown functionality
document.addEventListener('DOMContentLoaded', () => {
    const adminProfile = new AdminProfileDropdown();
}); 