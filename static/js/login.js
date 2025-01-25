class Login {
    constructor() {
        this.setupEventListeners();
        this.loadSavedCredentials();
    }

    setupEventListeners() {
        // Login form submission
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Password visibility toggle
        document.getElementById('passwordToggle').addEventListener('click', () => {
            this.togglePasswordVisibility();
        });

        // Forgot password link
        document.getElementById('forgotPassword').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        // Input validation
        document.getElementById('email').addEventListener('input', () => {
            this.validateEmail();
        });
    }

    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validate email
        if (!this.validateEmail()) {
            return;
        }

        // Define valid credentials
        const credentials = {
            admin: {
                email: 'admin@techxsolution.com',
                password: 'admin123',
                name: 'Admin User',
                role: 'admin'
            },
            user: {
                email: 'user@techxsolution.com',
                password: 'user123',
                name: 'John Doe',
                role: 'user'
            }
        };

        // Check credentials and redirect
        let userType = null;
        let userData = null;

        if (email === credentials.admin.email && password === credentials.admin.password) {
            userType = 'admin';
            userData = credentials.admin;
        } else if (email === credentials.user.email && password === credentials.user.password) {
            userType = 'user';
            userData = credentials.user;
        }

        if (userType) {
            // Save credentials if remember me is checked
            if (rememberMe) {
                localStorage.setItem('savedEmail', email);
                localStorage.setItem('savedPassword', password);
            } else {
                localStorage.removeItem('savedEmail');
                localStorage.removeItem('savedPassword');
            }

            // Save user data
            localStorage.setItem('userData', JSON.stringify({
                name: userData.name,
                email: userData.email,
                role: userData.role,
                isLoggedIn: true
            }));

            // Redirect based on user type
            window.location.href = userType === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
        } else {
            this.showError('Invalid email or password');
        }
    }

    validateEmail() {
        const email = document.getElementById('email');
        const errorElement = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email.value)) {
            errorElement.style.display = 'block';
            email.classList.add('is-invalid');
            return false;
        } else {
            errorElement.style.display = 'none';
            email.classList.remove('is-invalid');
            return true;
        }
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.getElementById('passwordToggle');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }

    loadSavedCredentials() {
        const savedEmail = localStorage.getItem('savedEmail');
        const savedPassword = localStorage.getItem('savedPassword');
        
        if (savedEmail && savedPassword) {
            document.getElementById('email').value = savedEmail;
            document.getElementById('password').value = savedPassword;
            document.getElementById('rememberMe').checked = true;
        }
    }

    handleForgotPassword() {
        const email = document.getElementById('email').value;
        if (this.validateEmail()) {
            alert('Please contact your system administrator to reset your password.');
        } else {
            this.showError('Please enter a valid email address');
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.textContent = message;
        
        const form = document.getElementById('loginForm');
        form.insertBefore(errorDiv, form.querySelector('.d-grid'));
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

// Initialize login functionality
document.addEventListener('DOMContentLoaded', () => {
    const login = new Login();
}); 