// ===== Users Manager =====
class UsersManager {
    constructor() {
        this.users = [];
        this.currentEditUser = null;
        this.init();
    }

    init() {
        this.loadUsers();
        this.setupEventListeners();
        this.renderUsers();
    }

    loadUsers() {
        // Simulate users data
        this.users = [
            {
                id: 1,
                name: 'Administrador Principal',
                email: 'admin@nexustech.com',
                phone: '(11) 9999-9999',
                role: 'admin',
                status: 'active',
                createdAt: '2024-01-15',
                lastLogin: '2024-02-26 14:30'
            },
            {
                id: 2,
                name: 'João Silva',
                email: 'joao@nexustech.com',
                phone: '(11) 8888-8888',
                role: 'manager',
                status: 'active',
                createdAt: '2024-01-20',
                lastLogin: '2024-02-26 10:15'
            },
            {
                id: 3,
                name: 'Maria Santos',
                email: 'maria@nexustech.com',
                phone: '(11) 7777-7777',
                role: 'user',
                status: 'active',
                createdAt: '2024-02-01',
                lastLogin: '2024-02-25 16:45'
            },
            {
                id: 4,
                name: 'Pedro Costa',
                email: 'pedro@nexustech.com',
                phone: '(11) 6666-6666',
                role: 'user',
                status: 'inactive',
                createdAt: '2024-02-10',
                lastLogin: '2024-02-20 09:30'
            }
        ];
    }

    setupEventListeners() {
        // Add user button
        document.getElementById('add-user-btn').addEventListener('click', () => {
            this.openModal();
        });

        // Modal controls
        document.getElementById('modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal on outside click
        document.getElementById('user-modal').addEventListener('click', (e) => {
            if (e.target.id === 'user-modal') {
                this.closeModal();
            }
        });

        // Form submission
        document.getElementById('user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUser();
        });

        // Password strength checker
        document.getElementById('user-password').addEventListener('input', (e) => {
            this.checkPasswordStrength(e.target.value);
        });

        // Search functionality
        document.getElementById('user-search').addEventListener('input', (e) => {
            this.searchUsers(e.target.value);
        });
    }

    renderUsers(usersToRender = this.users) {
        const usersGrid = document.getElementById('users-grid');
        
        if (usersToRender.length === 0) {
            usersGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-users"></i>
                    <p>Nenhum usuário encontrado</p>
                </div>
            `;
            return;
        }

        usersGrid.innerHTML = usersToRender.map(user => `
            <div class="user-card ${user.status === 'inactive' ? 'inactive' : ''}">
                <div class="user-header">
                    <div class="user-avatar">
                        ${this.getUserInitials(user.name)}
                        <div class="user-status ${user.status}"></div>
                    </div>
                    <div class="user-info">
                        <h3>${user.name}</h3>
                        <p>${user.email}</p>
                    </div>
                </div>
                
                <div class="user-details">
                    <div class="user-detail">
                        <i class="fas fa-phone"></i>
                        <span>${user.phone || 'Não informado'}</span>
                    </div>
                    <div class="user-detail">
                        <i class="fas fa-user-tag"></i>
                        <span>${this.getRoleLabel(user.role)}</span>
                    </div>
                    <div class="user-detail">
                        <i class="fas fa-calendar"></i>
                        <span>Criado em ${this.formatDate(user.createdAt)}</span>
                    </div>
                    <div class="user-detail">
                        <i class="fas fa-clock"></i>
                        <span>Último acesso: ${user.lastLogin || 'Nunca'}</span>
                    </div>
                </div>
                
                <div class="user-role ${user.role}">
                    ${this.getRoleLabel(user.role)}
                </div>
                
                <div class="user-actions">
                    <button class="btn btn-sm btn-outline" onclick="userManager.editUser(${user.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    ${user.status === 'active' ? `
                        <button class="btn btn-sm btn-outline" onclick="userManager.toggleUserStatus(${user.id})">
                            <i class="fas fa-pause"></i> Desativar
                        </button>
                    ` : `
                        <button class="btn btn-sm btn-success" onclick="userManager.toggleUserStatus(${user.id})">
                            <i class="fas fa-play"></i> Ativar
                        </button>
                    `}
                    <button class="btn btn-sm btn-danger" onclick="userManager.deleteUser(${user.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `).join('');
    }

    getUserInitials(name) {
        return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
    }

    getRoleLabel(role) {
        const roleLabels = {
            admin: 'Administrador',
            manager: 'Gerente',
            user: 'Usuário'
        };
        return roleLabels[role] || role;
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
    }

    openModal(userId = null) {
        const modal = document.getElementById('user-modal');
        const modalTitle = document.getElementById('modal-title');
        const form = document.getElementById('user-form');
        
        if (userId) {
            // Edit mode
            this.currentEditUser = this.users.find(user => user.id === userId);
            modalTitle.textContent = 'Editar Usuário';
            this.populateForm(this.currentEditUser);
        } else {
            // Add mode
            this.currentEditUser = null;
            modalTitle.textContent = 'Novo Usuário';
            form.reset();
            this.checkPasswordStrength('');
        }
        
        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('user-modal');
        modal.classList.remove('active');
        document.getElementById('user-form').reset();
        this.currentEditUser = null;
    }

    populateForm(user) {
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-phone').value = user.phone || '';
        document.getElementById('user-role').value = user.role;
        document.getElementById('user-status').value = user.status;
        
        // Clear password fields for edit mode
        document.getElementById('user-password').value = '';
        document.getElementById('user-confirm-password').value = '';
        document.getElementById('user-password').removeAttribute('required');
        document.getElementById('user-confirm-password').removeAttribute('required');
    }

    async saveUser() {
        const formData = this.collectFormData();
        
        // Validate passwords for new users
        if (!this.currentEditUser) {
            if (formData.password !== formData.confirmPassword) {
                this.showNotification('As senhas não coincidem.', 'error');
                return;
            }
            
            if (formData.password.length < 6) {
                this.showNotification('A senha deve ter pelo menos 6 caracteres.', 'error');
                return;
            }
        }
        
        try {
            // Show loading state
            const saveBtn = document.querySelector('#user-form button[type="submit"]');
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
            saveBtn.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            if (this.currentEditUser) {
                // Update existing user
                const index = this.users.findIndex(user => user.id === this.currentEditUser.id);
                this.users[index] = { ...this.currentEditUser, ...formData };
                this.showNotification('Usuário atualizado com sucesso!', 'success');
            } else {
                // Add new user
                const newUser = {
                    id: Math.max(...this.users.map(u => u.id)) + 1,
                    ...formData,
                    createdAt: new Date().toISOString().split('T')[0],
                    lastLogin: null
                };
                this.users.push(newUser);
                this.showNotification('Usuário criado com sucesso!', 'success');
            }
            
            this.renderUsers();
            this.closeModal();
            
        } catch (error) {
            this.showNotification('Erro ao salvar usuário.', 'error');
        } finally {
            const saveBtn = document.querySelector('#user-form button[type="submit"]');
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }
    }

    collectFormData() {
        return {
            name: document.getElementById('user-name').value,
            email: document.getElementById('user-email').value,
            phone: document.getElementById('user-phone').value,
            role: document.getElementById('user-role').value,
            status: document.getElementById('user-status').value,
            password: document.getElementById('user-password').value
        };
    }

    editUser(userId) {
        this.openModal(userId);
    }

    async toggleUserStatus(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        const action = newStatus === 'active' ? 'ativar' : 'desativar';
        
        if (confirm(`Tem certeza que deseja ${action} o usuário ${user.name}?`)) {
            try {
                user.status = newStatus;
                this.showNotification(`Usuário ${action === 'ativar' ? 'ativado' : 'desativado'} com sucesso!`, 'success');
                this.renderUsers();
            } catch (error) {
                this.showNotification('Erro ao alterar status do usuário.', 'error');
            }
        }
    }

    async deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}? Esta ação não pode ser desfeita.`)) {
            try {
                const index = this.users.findIndex(u => u.id === userId);
                this.users.splice(index, 1);
                this.showNotification('Usuário excluído com sucesso!', 'success');
                this.renderUsers();
            } catch (error) {
                this.showNotification('Erro ao excluir usuário.', 'error');
            }
        }
    }

    searchUsers(query) {
        if (!query) {
            this.renderUsers();
            return;
        }
        
        const filteredUsers = this.users.filter(user => 
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase()) ||
            user.role.toLowerCase().includes(query.toLowerCase())
        );
        
        this.renderUsers(filteredUsers);
    }

    checkPasswordStrength(password) {
        const strengthBar = document.getElementById('password-strength-bar');
        const strengthText = document.getElementById('password-strength-text');
        
        if (!password) {
            strengthBar.className = 'password-strength-bar';
            strengthText.textContent = 'Força da senha';
            return;
        }
        
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Character variety checks
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        // Update UI
        strengthBar.className = 'password-strength-bar';
        
        if (strength <= 2) {
            strengthBar.classList.add('weak');
            strengthText.textContent = 'Senha fraca';
            strengthText.style.color = 'var(--danger-color)';
        } else if (strength <= 4) {
            strengthBar.classList.add('medium');
            strengthText.textContent = 'Senha média';
            strengthText.style.color = 'var(--warning-color)';
        } else {
            strengthBar.classList.add('strong');
            strengthText.textContent = 'Senha forte';
            strengthText.style.color = 'var(--secondary-color)';
        }
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
}

// ===== Initialize Users Manager =====
document.addEventListener('DOMContentLoaded', () => {
    window.userManager = new UsersManager();
});
