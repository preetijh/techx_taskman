class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.initializeEventListeners();
        this.renderTasks();
    }

    initializeEventListeners() {
        // Filter buttons
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Task checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('task-check')) {
                this.toggleTaskComplete(e.target.closest('.task-item').dataset.id);
            }
        });

        // Task actions
        document.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]');
            if (action) {
                const taskId = action.closest('.task-item').dataset.id;
                if (action.dataset.action === 'edit') {
                    this.editTask(taskId);
                } else if (action.dataset.action === 'delete') {
                    this.deleteTask(taskId);
                }
            }
        });

        // Save task
        document.getElementById('saveTask')?.addEventListener('click', () => {
            this.saveTaskChanges();
        });
    }

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.renderTasks();
    }

    renderTasks() {
        const tasksList = document.querySelector('.tasks-list');
        const filteredTasks = this.filterTasks();
        
        tasksList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
        this.updateTaskStats();
    }

    filterTasks() {
        return this.tasks.filter(task => {
            switch(this.currentFilter) {
                case 'today':
                    return this.isToday(task.dueDate);
                case 'upcoming':
                    return !this.isToday(task.dueDate) && !task.completed;
                case 'completed':
                    return task.completed;
                default:
                    return true;
            }
        });
    }

    createTaskHTML(task) {
        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-checkbox">
                    <input type="checkbox" id="task${task.id}" class="task-check" ${task.completed ? 'checked' : ''}>
                    <label for="task${task.id}"></label>
                </div>
                <div class="task-content">
                    <h3 class="task-title">${task.title}</h3>
                    <p class="task-description">${task.description}</p>
                    <div class="task-meta">
                        <span class="task-due"><i class="far fa-calendar"></i> ${this.formatDate(task.dueDate)}</span>
                        <span class="task-priority ${task.priority}">${task.priority} Priority</span>
                        <span class="task-status ${task.status}">${this.formatStatus(task.status)}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn btn-icon" data-action="edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-icon" data-action="delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    toggleTaskComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const modal = new bootstrap.Modal(document.getElementById('taskModal'));
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskDueDate').value = task.dueDate;
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskStatus').value = task.status;
            document.getElementById('taskModal').dataset.taskId = taskId;
            modal.show();
        }
    }

    saveTaskChanges() {
        const taskId = document.getElementById('taskModal').dataset.taskId;
        const task = this.tasks.find(t => t.id === taskId);
        
        if (task) {
            task.title = document.getElementById('taskTitle').value;
            task.description = document.getElementById('taskDescription').value;
            task.dueDate = document.getElementById('taskDueDate').value;
            task.priority = document.getElementById('taskPriority').value;
            task.status = document.getElementById('taskStatus').value;
            
            this.saveTasks();
            this.renderTasks();
            bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.renderTasks();
        }
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    updateTaskStats() {
        const stats = {
            total: this.tasks.length,
            dueToday: this.tasks.filter(t => this.isToday(t.dueDate)).length,
            completed: this.tasks.filter(t => t.completed).length
        };

        document.querySelectorAll('.stat-value').forEach((el, index) => {
            el.textContent = Object.values(stats)[index];
        });
    }

    isToday(date) {
        const today = new Date();
        const taskDate = new Date(date);
        return taskDate.toDateString() === today.toDateString();
    }

    formatDate(date) {
        if (!date) return 'No due date';
        const taskDate = new Date(date);
        const today = new Date();
        
        if (taskDate.toDateString() === today.toDateString()) {
            return 'Due Today';
        }
        return taskDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }

    formatStatus(status) {
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
}

// Initialize Task Manager
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
}); 