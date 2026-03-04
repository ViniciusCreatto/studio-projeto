// ===== Calendar Manager =====
class CalendarManager {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.appointments = [];
        this.init();
    }

    init() {
        this.loadAppointments();
        this.setupEventListeners();
        this.renderCalendar();
    }

    loadAppointments() {
        // Simulate appointments data
        this.appointments = [
            {
                id: 1,
                clientName: 'João Silva',
                clientEmail: 'joao@email.com',
                clientPhone: '(11) 9999-9999',
                date: '2024-02-27',
                time: '09:00',
                duration: '1h',
                service: 'Landing Page Professional',
                status: 'confirmed',
                notes: 'Cliente interessado em e-commerce'
            },
            {
                id: 2,
                clientName: 'Maria Santos',
                clientEmail: 'maria@email.com',
                clientPhone: '(11) 8888-8888',
                date: '2024-02-27',
                time: '14:00',
                duration: '30min',
                service: 'Consulta Gratuita',
                status: 'confirmed',
                notes: 'Primeiro contato'
            },
            {
                id: 3,
                clientName: 'Pedro Costa',
                clientEmail: 'pedro@email.com',
                clientPhone: '(11) 7777-7777',
                date: '2024-02-27',
                time: '16:30',
                duration: '1h',
                service: 'App Mobile',
                status: 'pending',
                notes: 'Aguardando confirmação'
            },
            {
                id: 4,
                clientName: 'Ana Oliveira',
                clientEmail: 'ana@email.com',
                clientPhone: '(11) 6666-6666',
                date: '2024-02-28',
                time: '10:00',
                duration: '1h',
                service: 'SEO Marketing',
                status: 'confirmed',
                notes: 'Reunião de estratégia'
            },
            {
                id: 5,
                clientName: 'Carlos Ferreira',
                clientEmail: 'carlos@email.com',
                clientPhone: '(11) 5555-5555',
                date: '2024-02-28',
                time: '15:00',
                duration: '45min',
                service: 'UI/UX Design',
                status: 'pending',
                notes: 'Apresentação de mockups'
            },
            {
                id: 6,
                clientName: 'Lucia Mendes',
                clientEmail: 'lucia@email.com',
                clientPhone: '(11) 4444-4444',
                date: '2024-02-29',
                time: '11:00',
                duration: '1h',
                service: 'Landing Page Professional',
                status: 'confirmed',
                notes: 'Follow-up de proposta'
            }
        ];
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        document.getElementById('today-btn').addEventListener('click', () => {
            this.currentDate = new Date();
            this.selectedDate = new Date();
            this.renderCalendar();
            this.showDayAppointments(this.selectedDate);
        });
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month/year display
        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                           'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        // Generate calendar days
        const calendarDays = document.getElementById('calendar-days');
        calendarDays.innerHTML = '';
        
        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const dayElement = this.createDayElement(day, true, new Date(year, month - 1, day));
            calendarDays.appendChild(dayElement);
        }
        
        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayElement = this.createDayElement(day, false, date);
            calendarDays.appendChild(dayElement);
        }
        
        // Next month days to fill the grid
        const totalCells = calendarDays.children.length;
        const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = this.createDayElement(day, true, new Date(year, month + 1, day));
            calendarDays.appendChild(dayElement);
        }
    }

    createDayElement(day, isOtherMonth, date) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        }
        
        // Check if it's today
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Check if it's selected
        if (this.selectedDate && date.toDateString() === this.selectedDate.toDateString()) {
            dayElement.classList.add('selected');
        }
        
        // Add day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Add appointments dots
        const appointmentsContainer = document.createElement('div');
        appointmentsContainer.className = 'calendar-day-appointments';
        
        const dayAppointments = this.getAppointmentsForDate(date);
        const maxDots = 3; // Maximum dots to display
        
        dayAppointments.slice(0, maxDots).forEach(appointment => {
            const dot = document.createElement('div');
            dot.className = `appointment-dot ${appointment.status}`;
            dot.title = `${appointment.time} - ${appointment.clientName}`;
            appointmentsContainer.appendChild(dot);
        });
        
        if (dayAppointments.length > maxDots) {
            const moreDot = document.createElement('div');
            moreDot.className = 'appointment-dot';
            moreDot.style.background = 'var(--text-light)';
            moreDot.title = `+${dayAppointments.length - maxDots} mais`;
            appointmentsContainer.appendChild(moreDot);
        }
        
        dayElement.appendChild(appointmentsContainer);
        
        // Add click event
        if (!isOtherMonth) {
            dayElement.addEventListener('click', () => {
                this.selectDate(date);
            });
        }
        
        return dayElement;
    }

    selectDate(date) {
        this.selectedDate = date;
        
        // Update selected state
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });
        
        event.currentTarget.classList.add('selected');
        
        // Show appointments for selected date
        this.showDayAppointments(date);
    }

    getAppointmentsForDate(date) {
        const dateStr = this.formatDate(date);
        return this.appointments.filter(apt => apt.date === dateStr);
    }

    showDayAppointments(date) {
        const dayAppointments = this.getAppointmentsForDate(date);
        const appointmentList = document.getElementById('appointment-list');
        const selectedDateElement = document.getElementById('selected-date');
        
        // Update selected date display
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        selectedDateElement.textContent = date.toLocaleDateString('pt-BR', dateOptions);
        
        if (dayAppointments.length === 0) {
            appointmentList.innerHTML = `
                <div class="no-appointments">
                    <i class="fas fa-calendar-times"></i>
                    <p>Nenhum agendamento para este dia</p>
                </div>
            `;
            return;
        }
        
        // Sort appointments by time
        dayAppointments.sort((a, b) => a.time.localeCompare(b.time));
        
        appointmentList.innerHTML = dayAppointments.map(appointment => `
            <div class="appointment-card ${appointment.status}">
                <div class="appointment-header">
                    <div class="appointment-client">
                        <h4>${appointment.clientName}</h4>
                        <p>${appointment.clientEmail} | ${appointment.clientPhone}</p>
                    </div>
                    <div class="appointment-time">
                        <div class="time">${appointment.time}</div>
                        <div class="duration">${appointment.duration}</div>
                    </div>
                </div>
                
                <div class="appointment-service">
                    <i class="fas fa-briefcase"></i> ${appointment.service}
                </div>
                
                ${appointment.notes ? `
                    <div style="margin-bottom: 0.75rem; color: var(--text-secondary); font-size: 0.875rem;">
                        <i class="fas fa-sticky-note"></i> ${appointment.notes}
                    </div>
                ` : ''}
                
                <div class="appointment-actions">
                    <span class="appointment-status ${appointment.status}">
                        <i class="fas ${appointment.status === 'confirmed' ? 'fa-check-circle' : 'fa-clock'}"></i>
                        ${appointment.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                    </span>
                    
                    <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                        ${appointment.status === 'pending' ? `
                            <button class="btn btn-sm btn-success" onclick="calendar.confirmAppointment(${appointment.id})">
                                <i class="fas fa-check"></i> Confirmar
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="calendar.rejectAppointment(${appointment.id})">
                                <i class="fas fa-times"></i> Rejeitar
                            </button>
                        ` : `
                            <button class="btn btn-sm btn-outline" onclick="calendar.editAppointment(${appointment.id})">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="calendar.cancelAppointment(${appointment.id})">
                                <i class="fas fa-trash"></i> Cancelar
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `).join('');
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    async confirmAppointment(id) {
        try {
            const appointment = this.appointments.find(apt => apt.id === id);
            if (appointment) {
                appointment.status = 'confirmed';
                this.showNotification('Agendamento confirmado com sucesso!', 'success');
                this.renderCalendar();
                if (this.selectedDate) {
                    this.showDayAppointments(this.selectedDate);
                }
            }
        } catch (error) {
            this.showNotification('Erro ao confirmar agendamento.', 'error');
        }
    }

    async rejectAppointment(id) {
        if (confirm('Tem certeza que deseja rejeitar este agendamento?')) {
            try {
                const appointment = this.appointments.find(apt => apt.id === id);
                if (appointment) {
                    appointment.status = 'rejected';
                    this.showNotification('Agendamento rejeitado.', 'warning');
                    this.renderCalendar();
                    if (this.selectedDate) {
                        this.showDayAppointments(this.selectedDate);
                    }
                }
            } catch (error) {
                this.showNotification('Erro ao rejeitar agendamento.', 'error');
            }
        }
    }

    async cancelAppointment(id) {
        if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
            try {
                const index = this.appointments.findIndex(apt => apt.id === id);
                if (index !== -1) {
                    this.appointments.splice(index, 1);
                    this.showNotification('Agendamento cancelado.', 'warning');
                    this.renderCalendar();
                    if (this.selectedDate) {
                        this.showDayAppointments(this.selectedDate);
                    }
                }
            } catch (error) {
                this.showNotification('Erro ao cancelar agendamento.', 'error');
            }
        }
    }

    editAppointment(id) {
        const appointment = this.appointments.find(apt => apt.id === id);
        if (appointment) {
            this.showNotification(`Editando agendamento de ${appointment.clientName}`, 'info');
            // In a real app, this would open an edit modal
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

// ===== Initialize Calendar Manager =====
document.addEventListener('DOMContentLoaded', () => {
    window.calendar = new CalendarManager();
});
