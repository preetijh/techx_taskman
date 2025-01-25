class TeamManager {
    constructor() {
        this.teamMembers = [
            {
                id: 1,
                name: 'Sarah Johnson',
                role: 'Team Lead',
                initials: 'SJ',
                projects: 8,
                tasks: 15,
                email: 'sarah@techxsolution.com',
                phone: '+1234567890'
            },
            {
                id: 2,
                name: 'Mike Chen',
                role: 'Senior Developer',
                initials: 'MC',
                projects: 6,
                tasks: 12,
                email: 'mike@techxsolution.com',
                phone: '+1234567891'
            },
            {
                id: 3,
                name: 'Emma Wilson',
                role: 'UI/UX Designer',
                initials: 'EW',
                projects: 5,
                tasks: 10,
                email: 'emma@techxsolution.com',
                phone: '+1234567892'
            }
            // Add more team members as needed
        ];

        this.teamEvents = [
            {
                date: new Date(2024, 2, 25),
                title: 'Team Meeting',
                type: 'meeting'
            },
            {
                date: new Date(2024, 2, 26),
                title: 'Project Deadline',
                type: 'deadline'
            }
            // Add more events as needed
        ];

        this.messages = [];
        this.currentUser = {
            id: 'current-user',
            name: 'John Doe',
            initials: 'JD',
            online: true
        };

        this.initializeTeam();
        this.initializeEventListeners();
    }

    initializeTeam() {
        this.renderTeamMembers();
        this.renderTeamEvents();
        this.initializeSearch();
    }

    initializeEventListeners() {
        // Search functionality
        document.querySelector('.search-box input').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Contact buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.member-contact')) {
                this.handleContactAction(e);
            }
        });

        // Team chat
        const chatButton = document.querySelector('[data-bs-target="#teamChatModal"]');
        if (chatButton) {
            chatButton.addEventListener('click', () => this.initializeTeamChat());
        }
    }

    renderTeamMembers() {
        const grid = document.querySelector('.team-members-grid');
        if (!grid) return;

        grid.innerHTML = this.teamMembers.map(member => `
            <div class="team-member-card" data-member-id="${member.id}">
                <div class="member-avatar">
                    <div class="avatar-circle">
                        <span>${member.initials}</span>
                    </div>
                </div>
                <div class="member-info">
                    <h4>${member.name}</h4>
                    <p class="role">${member.role}</p>
                    <div class="member-stats">
                        <span><i class="fas fa-project-diagram"></i> ${member.projects} Projects</span>
                        <span><i class="fas fa-tasks"></i> ${member.tasks} Tasks</span>
                    </div>
                    <div class="member-contact">
                        <button class="btn btn-sm btn-outline-primary" data-action="email" title="Send Email">
                            <i class="fas fa-envelope"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-primary" data-action="call" title="Call">
                            <i class="fas fa-phone"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-primary" data-action="video" title="Video Call">
                            <i class="fas fa-video"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderTeamEvents() {
        const calendar = document.querySelector('.calendar-events');
        if (!calendar) return;

        calendar.innerHTML = this.teamEvents.map(event => `
            <div class="event-item">
                <div class="event-date">
                    <div class="event-day">${event.date.getDate()}</div>
                    <div class="event-month">${event.date.toLocaleString('default', { month: 'short' })}</div>
                </div>
                <div class="event-info">
                    <div class="event-title">${event.title}</div>
                    <div class="event-type">${event.type}</div>
                </div>
            </div>
        `).join('');
    }

    handleSearch(query) {
        const cards = document.querySelectorAll('.team-member-card');
        cards.forEach(card => {
            const memberName = card.querySelector('h4').textContent.toLowerCase();
            const memberRole = card.querySelector('.role').textContent.toLowerCase();
            const isMatch = memberName.includes(query.toLowerCase()) || 
                           memberRole.includes(query.toLowerCase());
            card.style.display = isMatch ? 'flex' : 'none';
        });
    }

    handleContactAction(event) {
        const button = event.target.closest('button');
        if (!button) return;

        const action = button.dataset.action;
        const memberId = button.closest('.team-member-card').dataset.memberId;
        const member = this.teamMembers.find(m => m.id === parseInt(memberId));

        switch(action) {
            case 'email':
                window.location.href = `mailto:${member.email}`;
                break;
            case 'call':
                window.location.href = `tel:${member.phone}`;
                break;
            case 'video':
                this.initiateVideoCall(member);
                break;
        }
    }

    initializeTeamChat() {
        this.renderChatMembers();
        this.setupChatEventListeners();
        this.loadChatHistory();
        this.scrollToBottom();
    }

    renderChatMembers() {
        const membersList = document.querySelector('.members-list');
        if (!membersList) return;

        const onlineMembers = this.teamMembers.map(member => ({
            ...member,
            online: Math.random() > 0.3 // Simulate online status randomly
        }));

        membersList.innerHTML = onlineMembers.map(member => `
            <div class="chat-member" data-member-id="${member.id}">
                <div class="member-status ${member.online ? 'status-online' : 'status-offline'}"></div>
                <div class="member-avatar">
                    <div class="avatar-circle">
                        <span>${member.initials}</span>
                    </div>
                </div>
                <div class="member-info">
                    <div class="member-name">${member.name}</div>
                    <small class="member-role">${member.role}</small>
                </div>
            </div>
        `).join('');
    }

    setupChatEventListeners() {
        const chatForm = document.getElementById('chatForm');
        const messageInput = document.getElementById('messageInput');

        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const message = messageInput.value.trim();
                if (message) {
                    this.sendMessage(message);
                    messageInput.value = '';
                }
            });
        }

        // Auto-resize input
        if (messageInput) {
            messageInput.addEventListener('input', () => {
                messageInput.style.height = 'auto';
                messageInput.style.height = messageInput.scrollHeight + 'px';
            });
        }
    }

    sendMessage(text) {
        const message = {
            id: Date.now(),
            text,
            sender: this.currentUser,
            timestamp: new Date(),
            type: 'outgoing'
        };

        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();

        // Simulate response after a short delay
        setTimeout(() => {
            this.simulateResponse();
        }, 1000);
    }

    simulateResponse() {
        const responses = [
            "I'll look into that right away!",
            "Thanks for the update.",
            "Good point, let's discuss this in our next meeting.",
            "I'm working on it now.",
            "Could you provide more details?"
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const randomMember = this.teamMembers[Math.floor(Math.random() * this.teamMembers.length)];

        const response = {
            id: Date.now(),
            text: randomResponse,
            sender: randomMember,
            timestamp: new Date(),
            type: 'incoming'
        };

        this.messages.push(response);
        this.renderMessage(response);
        this.scrollToBottom();
    }

    renderMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageHTML = `
            <div class="message ${message.type}">
                <div class="message-avatar">
                    ${message.sender.initials}
                </div>
                <div class="message-content">
                    <div class="message-bubble">
                        <div class="message-text">${message.text}</div>
                        <div class="message-time">
                            ${this.formatMessageTime(message.timestamp)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        chatMessages.insertAdjacentHTML('beforeend', messageHTML);
    }

    loadChatHistory() {
        // Simulate loading chat history
        const sampleMessages = [
            {
                id: 1,
                text: "Good morning team! How's everyone doing?",
                sender: this.currentUser,
                timestamp: new Date(Date.now() - 3600000),
                type: 'outgoing'
            },
            {
                id: 2,
                text: "Morning! Working on the new feature.",
                sender: this.teamMembers[0],
                timestamp: new Date(Date.now() - 3500000),
                type: 'incoming'
            }
        ];

        sampleMessages.forEach(message => {
            this.messages.push(message);
            this.renderMessage(message);
        });
    }

    formatMessageTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    initiateVideoCall(member) {
        // Implement video call functionality
        console.log(`Initiating video call with ${member.name}`);
    }
}

// Initialize Team Manager
document.addEventListener('DOMContentLoaded', () => {
    const teamManager = new TeamManager();
}); 