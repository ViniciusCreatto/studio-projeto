// ===== Content Manager =====
class ContentManager {
    constructor() {
        this.originalContent = {};
        this.currentContent = {};
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupImageUploads();
        this.setupColorPickers();
        this.setupLogoPreview();
        this.loadCurrentContent();
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                button.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');
            });
        });
    }

    setupImageUploads() {
        const uploadAreas = document.querySelectorAll('.image-upload-area');
        
        uploadAreas.forEach(area => {
            const input = area.querySelector('input[type="file"]');
            
            // Click to upload
            area.addEventListener('click', () => {
                input.click();
            });
            
            // File selection
            input.addEventListener('change', (e) => {
                this.handleFileSelect(e, area);
            });
            
            // Drag and drop
            area.addEventListener('dragover', (e) => {
                e.preventDefault();
                area.classList.add('dragover');
            });
            
            area.addEventListener('dragleave', () => {
                area.classList.remove('dragover');
            });
            
            area.addEventListener('drop', (e) => {
                e.preventDefault();
                area.classList.remove('dragover');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFileUpload(files[0], area);
                }
            });
        });
    }

    handleFileSelect(e, area) {
        const file = e.target.files[0];
        if (file) {
            this.handleFileUpload(file, area);
        }
    }

    handleFileUpload(file, area) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showNotification('Por favor, selecione um arquivo de imagem válido.', 'error');
            return;
        }

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('O arquivo deve ter no máximo 2MB.', 'error');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            this.updateImagePreview(area, e.target.result, file.name);
        };
        reader.readAsDataURL(file);
    }

    updateImagePreview(area, imageSrc, fileName) {
        const currentImageDiv = area.nextElementSibling;
        const img = currentImageDiv.querySelector('img');
        const info = currentImageDiv.querySelector('.image-info');
        
        img.src = imageSrc;
        info.textContent = `Novo arquivo: ${fileName}`;
        
        // Add visual feedback
        area.style.borderColor = 'var(--secondary-color)';
        area.style.background = 'rgba(16, 185, 129, 0.05)';
        
        setTimeout(() => {
            area.style.borderColor = '';
            area.style.background = '';
        }, 2000);
        
        this.showNotification('Imagem carregada com sucesso!', 'success');
    }

    setupColorPickers() {
        const colorInputs = document.querySelectorAll('.color-input');
        
        colorInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const colorValue = e.target.value;
                const valueDisplay = e.target.nextElementSibling;
                valueDisplay.textContent = colorValue;
                
                // Update preview
                this.updateColorPreview(e.target.id, colorValue);
            });
        });
    }

    updateColorPreview(colorId, colorValue) {
        const preview = document.querySelector('.preview-content');
        if (!preview) return;
        
        const colorMap = {
            'primary-color': 'var(--primary-color)',
            'secondary-color': 'var(--secondary-color)',
            'accent-color': 'var(--accent-color)',
            'text-color': 'var(--text-color)'
        };
        
        const cssVar = colorMap[colorId];
        if (cssVar) {
            preview.style.setProperty(cssVar, colorValue);
        }
    }

    setupLogoPreview() {
        const logoInput = document.getElementById('logo-input');
        const companyNameInput = document.getElementById('company-name');
        
        if (logoInput) {
            logoInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        document.getElementById('logo-preview-img').src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        if (companyNameInput) {
            companyNameInput.addEventListener('input', (e) => {
                document.getElementById('logo-preview-text').textContent = e.target.value;
            });
        }
    }

    loadCurrentContent() {
        // Save original content for reset functionality
        const textInputs = document.querySelectorAll('input[type="text"], textarea');
        const colorInputs = document.querySelectorAll('.color-input');
        
        textInputs.forEach(input => {
            this.originalContent[input.id] = input.value;
        });
        
        colorInputs.forEach(input => {
            this.originalContent[input.id] = input.value;
        });
    }

    async saveChanges() {
        try {
            // Collect all form data
            const formData = this.collectFormData();
            
            // Show loading state
            const saveBtn = document.querySelector('.btn-save');
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
            saveBtn.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Save to localStorage (in real app, this would be an API call)
            localStorage.setItem('siteContent', JSON.stringify(formData));
            
            this.showNotification('Alterações salvas com sucesso!', 'success');
            
            // Update original content
            this.loadCurrentContent();
            
        } catch (error) {
            this.showNotification('Erro ao salvar alterações.', 'error');
        } finally {
            const saveBtn = document.querySelector('.btn-save');
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';
            saveBtn.disabled = false;
        }
    }

    collectFormData() {
        const formData = {};
        
        // Collect text inputs
        const textInputs = document.querySelectorAll('input[type="text"], textarea');
        textInputs.forEach(input => {
            formData[input.id] = input.value;
        });
        
        // Collect color inputs
        const colorInputs = document.querySelectorAll('.color-input');
        colorInputs.forEach(input => {
            formData[input.id] = input.value;
        });
        
        // Collect uploaded images (in real app, these would be file uploads)
        const imageInputs = document.querySelectorAll('input[type="file"]');
        imageInputs.forEach(input => {
            if (input.files.length > 0) {
                formData[input.id] = input.files[0].name;
            }
        });
        
        return formData;
    }

    resetChanges() {
        if (confirm('Tem certeza que deseja cancelar todas as alterações?')) {
            // Reset all inputs to original values
            Object.entries(this.originalContent).forEach(([id, value]) => {
                const input = document.getElementById(id);
                if (input) {
                    input.value = value;
                    
                    // Trigger change events for color pickers
                    if (input.type === 'color') {
                        input.dispatchEvent(new Event('input'));
                    }
                    
                    // Trigger input events for text inputs
                    if (input.type === 'text' || input.tagName === 'TEXTAREA') {
                        input.dispatchEvent(new Event('input'));
                    }
                }
            });
            
            // Reset image previews
            const currentImages = document.querySelectorAll('.current-image img');
            currentImages.forEach(img => {
                const originalSrc = img.src;
                img.src = originalSrc;
            });
            
            this.showNotification('Alterações canceladas.', 'info');
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

// ===== Initialize Content Manager =====
document.addEventListener('DOMContentLoaded', () => {
    window.contentManager = new ContentManager();
});
