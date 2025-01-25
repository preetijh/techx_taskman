document.addEventListener('DOMContentLoaded', function() {
    // Initialize the task board
    initializeTaskBoard();
    
    // Populate form dropdowns
    populateAssignees();
    populateTeams();
    
    // Initialize filters
    initializeFilters();
});

// Function to initialize task board
function initializeTaskBoard() {
    // Sample tasks data (replace with API call in production)
    const tasks = [
        {
            id: 1,
            title: 'Design Homepage Mockup',
            description: 'Create modern homepage design for the new website',
            status: 'pending',
            priority: 'high',
            assignee: 'John Doe',
            assigneeAvatar: 'path/to/avatar.jpg',
            dueDate: '2024-03-25',
            team: 'Design Team'
        },
        {
            id: 2,
            title: 'Implement User Authentication',
            description: 'Set up JWT authentication system',
            status: 'in_progress',
            priority: 'medium',
            assignee: 'Jane Smith',
            assigneeAvatar: 'path/to/avatar.jpg',
            dueDate: '2024-03-28',
            team: 'Backend Team'
        },
        // Add more sample tasks as needed
    ];

    // Render tasks
    renderTasks(tasks);
}

// Function to render tasks
function renderTasks(tasks) {
    const columns = {
        pending: document.getElementById('pendingTasks'),
        in_progress: document.getElementById('inProgressTasks'),
        review: document.getElementById('reviewTasks'),
        completed: document.getElementById('completedTasks')
    };

    // Clear existing tasks
    Object.values(columns).forEach(column => column.innerHTML = '');

    // Render tasks in appropriate columns
    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        columns[task.status].appendChild(taskCard);
    });

    // Update task counts
    updateTaskCounts();
}

// Function to create task card
function createTaskCard(task) {
    const div = document.createElement('div');
    div.className = 'task-card';
    div.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
            <h6 class="task-title">${task.title}</h6>
            <span class="priority-badge ${task.priority}">${task.priority}</span>
        </div>
        <div class="task-meta">
            <div><i class="far fa-calendar-alt me-1"></i> Due: ${formatDate(task.dueDate)}</div>
            <div><i class="fas fa-users me-1"></i> ${task.team}</div>
        </div>
        <div class="assignee">
            <img src="${task.assigneeAvatar}" alt="${task.assignee}" class="assignee-avatar">
            <span>${task.assignee}</span>
        </div>
    `;

    // Add click event to open task details
    div.addEventListener('click', () => openTaskDetails(task));

    // Make task card draggable
    div.draggable = true;
    div.addEventListener('dragstart', (e) => handleDragStart(e, task));

    return div;
}

// Function to handle drag start
function handleDragStart(e, task) {
    e.dataTransfer.setData('text/plain', task.id);
}

// Function to open task details
function openTaskDetails(task) {
    // Implement task details view
    console.log('Opening task details:', task);
}

// Function to create new task
function createTask() {
    const form = document.getElementById('createTaskForm');
    
    if (form.checkValidity()) {
        const newTask = {
            id: Date.now(),
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            priority: document.getElementById('taskPriority').value,
            assignee: document.getElementById('taskAssignee').value,
            team: document.getElementById('taskTeam').value,
            startDate: document.getElementById('taskStartDate').value,
            dueDate: document.getElementById('taskDueDate').value,
            status: 'pending'
        };

        // Here you would typically send this to your backend
        console.log('Creating new task:', newTask);

        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('createTaskModal'));
        modal.hide();
        form.reset();

        // Refresh task board
        initializeTaskBoard();
    } else {
        form.reportValidity();
    }
}

// Function to populate assignees dropdown
function populateAssignees() {
    const assigneeSelect = document.getElementById('taskAssignee');
    // Get users from localStorage or API
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    assigneeSelect.innerHTML = '<option value="">Select Assignee</option>';
    users.forEach(user => {
        assigneeSelect.add(new Option(user.name, user.email));
    });
}

// Function to populate teams dropdown
function populateTeams() {
    const teamSelect = document.getElementById('taskTeam');
    // Get teams from localStorage or API
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    
    teamSelect.innerHTML = '<option value="">Select Team</option>';
    teams.forEach(team => {
        teamSelect.add(new Option(team.name, team.id));
    });
}

// Function to initialize filters
function initializeFilters() {
    const filters = ['status', 'priority', 'team'];
    filters.forEach(filter => {
        document.getElementById(`${filter}Filter`).addEventListener('change', applyFilters);
    });
    
    document.getElementById('searchTask').addEventListener('input', applyFilters);
}

// Function to apply filters
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    const teamFilter = document.getElementById('teamFilter').value;
    const searchText = document.getElementById('searchTask').value.toLowerCase();

    // Get all tasks (replace with API call in production)
    let tasks = []; // Your tasks array

    // Filter tasks based on criteria
    tasks = tasks.filter(task => {
        return (!statusFilter || task.status === statusFilter) &&
               (!priorityFilter || task.priority === priorityFilter) &&
               (!teamFilter || task.team === teamFilter) &&
               (!searchText || task.title.toLowerCase().includes(searchText));
    });

    // Render filtered tasks
    renderTasks(tasks);
}

// Function to update task counts
function updateTaskCounts() {
    const columns = ['pending', 'in_progress', 'review', 'completed'];
    columns.forEach(status => {
        const column = document.getElementById(`${status}Tasks`);
        const count = column.children.length;
        const countElement = column.parentElement.querySelector('.task-count');
        countElement.textContent = count;
    });
}

// Utility function to format date
function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
} 