class UserDashboard {
    constructor() {
        this.initializeDashboard();
        this.setupEventListeners();
    }

    initializeDashboard() {
        // Load user data
        this.loadUserData();
        // Initialize notifications
        this.updateNotificationCount();
        // Set active navigation
        this.setActiveNavItem();
    }

    setupEventListeners() {
        // Sidebar toggle
        document.getElementById('sidebarCollapse')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
            document.getElementById('content').classList.toggle('active');
        });

        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Profile actions
        document.querySelector('[data-action="profile"]')?.addEventListener('click', () => {
            this.showProfileModal();
        });
    }

    loadUserData() {
        // Load user data from localStorage or API
        const userData = JSON.parse(localStorage.getItem('userData')) || {
            name: 'John Doe',
            role: 'Developer',
            team: 'Development Team'
        };

        // Update display name
        document.querySelector('#userDropdown span').textContent = userData.name;
    }

    updateNotificationCount() {
        const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        const unreadCount = notifications.filter(n => !n.read).length;
        
        const badge = document.querySelector('#notificationDropdown .badge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop().split('.')[0];
        document.querySelectorAll('#sidebar .components a').forEach(link => {
            if (link.getAttribute('href').includes(currentPage)) {
                link.parentElement.classList.add('active');
            }
        });
    }

    handleSearch(query) {
        // Implement search functionality for user's tasks and team members
        if (!query.trim()) return;

        // Example search implementation
        const searchableItems = document.querySelectorAll('table tbody tr, .team-members div');
        searchableItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
        });
    }

    showProfileModal() {
        // Implement profile view/edit modal
        // Users can only view and edit their basic information
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    const userDashboard = new UserDashboard();
}); 