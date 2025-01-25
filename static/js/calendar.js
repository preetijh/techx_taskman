class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.events = [];
        this.view = 'month';
        
        this.initializeCalendar();
        this.setupEventListeners();
        this.loadEvents();
    }

    initializeCalendar() {
        this.updateCalendarHeader();
        this.renderCalendar();
        this.renderUpcomingEvents();
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('prevMonth')?.addEventListener('click', () => this.navigateMonth(-1));
        document.getElementById('nextMonth')?.addEventListener('click', () => this.navigateMonth(1));
        document.getElementById('todayBtn')?.addEventListener('click', () => this.goToToday());

        // View changes
        document.querySelector('.calendar-views')?.addEventListener('click', (e) => {
            if (e.target.dataset.view) {
                this.changeView(e.target.dataset.view);
            }
        });

        // Event form
        document.getElementById('saveEvent')?.addEventListener('click', () => this.saveEvent());

        // Calendar day clicks
        document.getElementById('calendarDays')?.addEventListener('click', (e) => {
            const dayCell = e.target.closest('.calendar-day');
            if (dayCell) {
                this.handleDayClick(dayCell);
            }
        });
    }

    updateCalendarHeader() {
        const monthYearText = this.currentDate.toLocaleString('default', { 
            month: 'long', 
            year: 'numeric' 
        });
        document.getElementById('currentMonth').textContent = monthYearText;
    }

    renderCalendar() {
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - startDate.getDay());

        const calendarDays = document.getElementById('calendarDays');
        if (!calendarDays) return;

        calendarDays.innerHTML = '';
        const today = new Date();

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            
            const isCurrentMonth = date.getMonth() === this.currentDate.getMonth();
            const isToday = date.toDateString() === today.toDateString();
            
            const dayEvents = this.getEventsForDate(date);
            
            const dayElement = this.createDayElement(date, isCurrentMonth, isToday, dayEvents);
            calendarDays.appendChild(dayElement);
        }
    }

    createDayElement(date, isCurrentMonth, isToday, events) {
        const dayElement = document.createElement('div');
        dayElement.className = `calendar-day ${isCurrentMonth ? '' : 'other-month'} ${isToday ? 'current-day' : ''}`;
        dayElement.dataset.date = date.toISOString();

        dayElement.innerHTML = `
            <div class="day-number">${date.getDate()}</div>
            <div class="day-events">
                ${events.map(event => this.createEventElement(event)).join('')}
            </div>
        `;

        return dayElement;
    }

    createEventElement(event) {
        return `
            <div class="event-item event-${event.category}" 
                 title="${event.title}"
                 data-event-id="${event.id}">
                <span class="event-dot"></span>
                ${event.title}
            </div>
        `;
    }

    navigateMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.initializeCalendar();
    }

    goToToday() {
        this.currentDate = new Date();
        this.initializeCalendar();
    }

    changeView(view) {
        this.view = view;
        document.querySelectorAll('.calendar-views button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        this.renderCalendar();
    }

    saveEvent() {
        const form = document.getElementById('eventForm');
        const eventData = {
            id: Date.now(),
            title: document.getElementById('eventTitle').value,
            start: document.getElementById('eventStart').value,
            end: document.getElementById('eventEnd').value,
            category: document.getElementById('eventCategory').value,
            description: document.getElementById('eventDescription').value,
            attendees: Array.from(document.getElementById('eventAttendees').selectedOptions).map(option => option.value),
            reminder: document.getElementById('eventReminder').checked
        };

        this.events.push(eventData);
        this.saveEventsToStorage();
        this.renderCalendar();
        this.renderUpcomingEvents();

        const modal = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
        modal.hide();
        form.reset();
    }

    getEventsForDate(date) {
        return this.events.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate.toDateString() === date.toDateString();
        });
    }

    renderUpcomingEvents() {
        const upcomingEvents = document.getElementById('upcomingEvents');
        if (!upcomingEvents) return;

        const today = new Date();
        const futureEvents = this.events
            .filter(event => new Date(event.start) >= today)
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .slice(0, 5);

        upcomingEvents.innerHTML = futureEvents.map(event => `
            <div class="event-card">
                <div class="event-time">
                    ${this.formatEventTime(event.start)}
                </div>
                <div class="event-details">
                    <h5>${event.title}</h5>
                    <small class="text-muted">${event.description || 'No description'}</small>
                </div>
                <div class="event-actions">
                    <button class="btn btn-sm btn-outline-primary" onclick="calendar.editEvent(${event.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="calendar.deleteEvent(${event.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    formatEventTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('default', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    saveEventsToStorage() {
        localStorage.setItem('calendarEvents', JSON.stringify(this.events));
    }

    loadEvents() {
        const savedEvents = localStorage.getItem('calendarEvents');
        if (savedEvents) {
            this.events = JSON.parse(savedEvents);
        }
    }

    editEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        // Populate form with event data
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventStart').value = event.start;
        document.getElementById('eventEnd').value = event.end;
        document.getElementById('eventCategory').value = event.category;
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('eventReminder').checked = event.reminder;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('eventModal'));
        modal.show();
    }

    deleteEvent(eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.events = this.events.filter(e => e.id !== eventId);
            this.saveEventsToStorage();
            this.renderCalendar();
            this.renderUpcomingEvents();
        }
    }
}

// Initialize Calendar
document.addEventListener('DOMContentLoaded', () => {
    window.calendar = new Calendar();
}); 