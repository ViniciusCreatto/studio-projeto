// ===== Admin Authentication =====
class AdminAuth {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('adminUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.redirectToDashboard();
        }

        // Setup form handlers
        this.setupLoginForm();
        this.setupPasswordToggle();
    }

    setupLoginForm() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
        }
    }

    setupPasswordToggle() {
        const toggleBtn = document.getElementById('toggle-password');
        const passwordInput = document.getElementById('password');
        
        if (toggleBtn && passwordInput) {
            toggleBtn.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                const icon = toggleBtn.querySelector('i');
                icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
            });
        }
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = document.getElementById('remember').checked;

        // Basic validation
        if (!email || !password) {
            this.showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await this.simulateLogin(email, password);
            
            // Save user session
            const user = {
                email: email,
                name: 'Administrador',
                role: 'admin',
                loginTime: new Date().toISOString()
            };
            
            if (remember) {
                localStorage.setItem('adminUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('adminUser', JSON.stringify(user));
            }
            
            this.showNotification('Login realizado com sucesso!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                this.redirectToDashboard();
            }, 1000);
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async simulateLogin(email, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Demo credentials
        const validCredentials = [
            { email: 'admin@nexustech.com', password: 'admin123' },
            { email: 'demo@nexustech.com', password: 'demo123' }
        ];
        
        const isValid = validCredentials.some(cred => 
            cred.email === email && cred.password === password
        );
        
        if (!isValid) {
            throw new Error('Email ou senha incorretos.');
        }
    }

    redirectToDashboard() {
        window.location.href = 'dashboard.html';
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: '#ffffff',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '400px',
            wordWrap: 'break-word',
            backgroundColor: this.getNotificationColor(type)
        });

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    getNotificationColor(type) {
        switch (type) {
            case 'success': return '#10b981';
            case 'error': return '#ef4444';
            case 'warning': return '#f59e0b';
            default: return '#3b82f6';
        }
    }

    logout() {
        localStorage.removeItem('adminUser');
        sessionStorage.removeItem('adminUser');
        window.location.href = 'login.html';
    }
}

// ===== Admin Dashboard =====
class AdminDashboard {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check authentication
        this.checkAuth();
        
        // Setup dashboard
        this.setupSidebar();
        this.setupTopbar();
        this.loadDashboardData();
    }

    checkAuth() {
        const savedUser = localStorage.getItem('adminUser') || sessionStorage.getItem('adminUser');
        if (!savedUser) {
            window.location.href = 'login.html';
            return;
        }
        
        this.currentUser = JSON.parse(savedUser);
    }

    setupSidebar() {
        const sidebar = document.querySelector('.admin-sidebar');
        const toggleBtn = document.getElementById('sidebar-toggle');
        const navItems = document.querySelectorAll('.admin-nav-item');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
            });
        }
        
        // Set active nav item
        const currentPath = window.location.pathname;
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href && currentPath.includes(href)) {
                item.classList.add('active');
            }
        });
    }

    setupTopbar() {
        const logoutBtn = document.getElementById('logout-btn');
        const userMenuBtn = document.getElementById('user-menu-btn');
        const userMenu = document.getElementById('user-menu');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
        
        if (userMenuBtn && userMenu) {
            userMenuBtn.addEventListener('click', () => {
                userMenu.classList.toggle('show');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenuBtn.contains(e.target) && !userMenu.contains(e.target)) {
                    userMenu.classList.remove('show');
                }
            });
        }
    }

    async loadDashboardData() {
        try {
            // Simulate loading dashboard data
            await this.loadStats();
            await this.loadAppointments();
            await this.loadRecentActivity();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    async loadStats() {
        // Simulate API call
        const stats = {
            totalAppointments: 156,
            pendingAppointments: 23,
            confirmedAppointments: 133,
            newUsers: 8,
            totalUsers: 42
        };
        
        this.updateStatsDisplay(stats);
    }

    updateStatsDisplay(stats) {
        const elements = {
            'total-appointments': stats.totalAppointments,
            'pending-appointments': stats.pendingAppointments,
            'confirmed-appointments': stats.confirmedAppointments,
            'new-users': stats.newUsers,
            'total-users': stats.totalUsers
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    async loadAppointments() {
        // Simulate appointments data
        const appointments = [
            {
                id: 1,
                name: 'João Silva',
                email: 'joao@email.com',
                phone: '(11) 9999-9999',
                date: '2024-02-27',
                time: '14:00',
                status: 'pending',
                service: 'Landing Page Professional'
            },
            {
                id: 2,
                name: 'Maria Santos',
                email: 'maria@email.com',
                phone: '(11) 8888-8888',
                date: '2024-02-27',
                time: '15:30',
                status: 'confirmed',
                service: 'E-commerce Complete'
            },
            {
                id: 3,
                name: 'Pedro Costa',
                email: 'pedro@email.com',
                phone: '(11) 7777-7777',
                date: '2024-02-28',
                time: '10:00',
                status: 'pending',
                service: 'App Mobile'
            }
        ];
        
        this.displayAppointments(appointments);
    }

    displayAppointments(appointments) {
        const container = document.getElementById('appointments-list');
        if (!container) return;
        
        container.innerHTML = appointments.map(apt => `
            <div class="appointment-item ${apt.status}">
                <div class="appointment-info">
                    <h4>${apt.name}</h4>
                    <p>${apt.service}</p>
                    <small>${apt.email} | ${apt.phone}</small>
                </div>
                <div class="appointment-time">
                    <strong>${this.formatDate(apt.date)}</strong>
                    <span>${apt.time}</span>
                </div>
                <div class="appointment-status">
                    <span class="status-badge ${apt.status}">
                        ${apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                    </span>
                    <div class="appointment-actions">
                        ${apt.status === 'pending' ? `
                            <button class="btn btn-sm btn-success" onclick="dashboard.confirmAppointment(${apt.id})">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="dashboard.rejectAppointment(${apt.id})">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : `
                            <button class="btn btn-sm btn-outline" onclick="dashboard.viewAppointment(${apt.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `).join('');
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    async confirmAppointment(id) {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.showNotification('Agendamento confirmado com sucesso!', 'success');
            this.loadAppointments(); // Reload appointments
        } catch (error) {
            this.showNotification('Erro ao confirmar agendamento.', 'error');
        }
    }

    async rejectAppointment(id) {
        if (confirm('Tem certeza que deseja rejeitar este agendamento?')) {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));
                
                this.showNotification('Agendamento rejeitado.', 'warning');
                this.loadAppointments(); // Reload appointments
            } catch (error) {
                this.showNotification('Erro ao rejeitar agendamento.', 'error');
            }
        }
    }

    viewAppointment(id) {
        // Show appointment details modal
        this.showNotification(`Visualizando detalhes do agendamento #${id}`, 'info');
    }

    logout() {
        localStorage.removeItem('adminUser');
        sessionStorage.removeItem('adminUser');
        window.location.href = 'login.html';
    }

    showNotification(message, type = 'info') {
        // Same notification method as AdminAuth
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: '#ffffff',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '400px',
            wordWrap: 'break-word',
            backgroundColor: this.getNotificationColor(type)
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    getNotificationColor(type) {
        switch (type) {
            case 'success': return '#10b981';
            case 'error': return '#ef4444';
            case 'warning': return '#f59e0b';
            default: return '#3b82f6';
        }
    }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on login page or dashboard
    if (window.location.pathname.includes('login.html')) {
        new AdminAuth();
    } else {
        window.dashboard = new AdminDashboard();
    }
});
