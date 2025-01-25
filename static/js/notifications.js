// Notification System
class NotificationSystem {
    constructor() {
        this.notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        this.maxNotifications = 10;
        this.initializeNotifications();
        this.setupEventListeners();
    }

    initializeNotifications() {
        // Update notification badge
        this.updateNotificationBadge();
        
        // Populate notification dropdown
        this.updateNotificationDropdown();

        // If no notifications exist, add some sample notifications
        if (this.notifications.length === 0) {
            this.addSampleNotifications();
        }
    }

    setupEventListeners() {
        // Mark as read when notification is clicked
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const notificationId = e.currentTarget.dataset.id;
                this.markAsRead(notificationId);
            });
        });

        // Clear all notifications button
        document.getElementById('clearNotifications')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.clearAllNotifications();
        });

        // Mark all as read button
        document.getElementById('markAllRead')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.markAllAsRead();
        });
    }

    addNotification(notification) {
        const newNotification = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            read: false,
            ...notification
        };

        this.notifications.unshift(newNotification);

        // Keep only the latest notifications
        if (this.notifications.length > this.maxNotifications) {
            this.notifications = this.notifications.slice(0, this.maxNotifications);
        }

        // Save to localStorage
        this.saveNotifications();

        // Update UI
        this.updateNotificationBadge();
        this.updateNotificationDropdown();

        // Show toast notification
        this.showToast(newNotification);
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === parseInt(notificationId));
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateNotificationBadge();
            this.updateNotificationDropdown();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.saveNotifications();
        this.updateNotificationBadge();
        this.updateNotificationDropdown();
    }

    clearAllNotifications() {
        this.notifications = [];
        this.saveNotifications();
        this.updateNotificationBadge();
        this.updateNotificationDropdown();
    }

    updateNotificationBadge() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const badge = document.querySelector('#notificationDropdown .badge');
        
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    updateNotificationDropdown() {
        const dropdownMenu = document.querySelector('#notificationDropdown + .dropdown-menu');
        if (!dropdownMenu) return;

        if (this.notifications.length === 0) {
            dropdownMenu.innerHTML = `
                <li><div class="dropdown-item text-center text-muted">No notifications</div></li>
            `;
            return;
        }

        let html = `
            <li class="notification-header">
                <div class="d-flex justify-content-between align-items-center px-3 py-2">
                    <span class="fw-bold">Notifications</span>
                    <div class="notification-actions">
                        <button class="btn btn-link btn-sm text-decoration-none" id="markAllRead">
                            Mark all read
                        </button>
                        <button class="btn btn-link btn-sm text-decoration-none text-danger" id="clearNotifications">
                            Clear all
                        </button>
                    </div>
                </div>
            </li>
            <li><hr class="dropdown-divider m-0"></li>
        `;

        html += this.notifications.map(notification => `
            <li>
                <a class="dropdown-item notification-item ${notification.read ? 'read' : 'unread'}" 
                   href="#" 
                   data-id="${notification.id}">
                    <div class="d-flex align-items-center">
                        <div class="notification-icon ${notification.type}">
                            <i class="fas ${this.getIconForType(notification.type)}"></i>
                        </div>
                        <div class="notification-content ms-3">
                            <div class="notification-text">${notification.message}</div>
                            <div class="notification-time">${this.formatTimestamp(notification.timestamp)}</div>
                        </div>
                        ${!notification.read ? '<div class="unread-indicator"></div>' : ''}
                    </div>
                </a>
            </li>
        `).join('');

        dropdownMenu.innerHTML = html;
        this.setupEventListeners();
    }

    showToast(notification) {
        const toastHTML = `
            <div class="toast-container position-fixed top-0 end-0 p-3">
                <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <i class="fas ${this.getIconForType(notification.type)} me-2"></i>
                        <strong class="me-auto">New Notification</strong>
                        <small>${this.formatTimestamp(notification.timestamp)}</small>
                        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body">
                        ${notification.message}
                    </div>
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

    getIconForType(type) {
        const icons = {
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            danger: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            task: 'fa-tasks',
            message: 'fa-envelope',
            user: 'fa-user'
        };
        return icons[type] || 'fa-bell';
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) { // Less than 1 minute
            return 'Just now';
        } else if (diff < 3600000) { // Less than 1 hour
            const minutes = Math.floor(diff / 60000);
            return `${minutes}m ago`;
        } else if (diff < 86400000) { // Less than 1 day
            const hours = Math.floor(diff / 3600000);
            return `${hours}h ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }

    addSampleNotifications() {
        const sampleNotifications = [
            {
                type: 'task',
                message: 'New task assigned: Update user interface',
                timestamp: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
            },
            {
                type: 'message',
                message: 'Team meeting scheduled for tomorrow',
                timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
            },
            {
                type: 'warning',
                message: 'System maintenance scheduled',
                timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
            }
        ];

        sampleNotifications.forEach(notification => this.addNotification(notification));
    }
} 