// ===== DOM Elements =====
const header = document.getElementById('header');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const backToTopBtn = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const newsletterForm = document.getElementById('newsletter-form');

// ===== Carousel Elements =====
const carousel = document.getElementById('hero-carousel');
const slides = document.querySelectorAll('.carousel__slide');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
const indicators = document.querySelectorAll('.carousel__indicator');

// ===== Landing Page Elements =====
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

// ===== Variables =====
let currentSlide = 0;
let autoplayInterval;
const autoplayDelay = 5000; // 5 seconds

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    initHeroBeforeAfterCarousel();
    initNavigation();
    initScrollEffects();
    initForms();
    initLandingPageFeatures();
    startAutoplay();
});

// ===== Hero Before/After Carousel =====
function initHeroBeforeAfterCarousel() {
    const baCarousel = document.getElementById('hero-ba-carousel');
    const baTrack = document.getElementById('hero-ba-track');
    const baPrev = document.getElementById('hero-ba-prev');
    const baNext = document.getElementById('hero-ba-next');
    const baDotsWrap = document.getElementById('hero-ba-dots');

    if (!baCarousel || !baTrack) return;

    const baSlides = Array.from(baTrack.querySelectorAll('.ba-slide'));
    const baDots = baDotsWrap ? Array.from(baDotsWrap.querySelectorAll('.ba-dot')) : [];
    if (baSlides.length === 0) return;

    let index = 0;

    function clampIndex(i) {
        const max = baSlides.length - 1;
        if (i < 0) return max;
        if (i > max) return 0;
        return i;
    }

    function update() {
        baTrack.style.transform = `translateX(-${index * 100}%)`;
        baSlides.forEach((s, i) => s.classList.toggle('active', i === index));
        baDots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function goTo(i) {
        index = clampIndex(i);
        update();
    }

    if (baPrev) {
        baPrev.addEventListener('click', () => goTo(index - 1));
    }

    if (baNext) {
        baNext.addEventListener('click', () => goTo(index + 1));
    }

    baDots.forEach((dot, i) => {
        dot.addEventListener('click', () => goTo(i));
    });

    // Touch/swipe
    let touchStartX = 0;
    let touchEndX = 0;

    baCarousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    baCarousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const delta = touchEndX - touchStartX;
        if (delta < -50) goTo(index + 1);
        if (delta > 50) goTo(index - 1);
    });

    update();
}

// ===== Landing Page Conversion Elements =====

// Countdown Timer
function initCountdown() {
    if (!hoursEl || !minutesEl || !secondsEl) return;
    
    // Set target time (48 hours from now)
    const targetTime = new Date().getTime() + (48 * 60 * 60 * 1000);
    
    function updateTimer() {
        const now = new Date().getTime();
        const distance = targetTime - now;
        
        if (distance < 0) {
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }
        
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// FAQ Accordion
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq__question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');
            
            // Close all other FAQs
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });
            
            // Toggle current FAQ
            if (!isActive) {
                question.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
}

// Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Exit Intent Popup
function initExitIntent() {
    // let mouseLeaveTimer;
    
    // document.addEventListener('mouseleave', (e) => {
    //     if (e.clientY < 10) {
    //         mouseLeaveTimer = setTimeout(() => {
    //             showExitPopup();
    //         }, 500);
    //     }
    // });
    
    // document.addEventListener('mouseenter', () => {
    //     clearTimeout(mouseLeaveTimer);
    // });
}

function showExitPopup() {
    // Check if popup was already shown
    if (localStorage.getItem('exitPopupShown')) return;
    
    const popup = document.createElement('div');
    popup.className = 'exit-popup';
    popup.innerHTML = `
        <div class="exit-popup__content">
            <button class="exit-popup__close">&times;</button>
            <h3>🎯 Antes de ir...</h3>
            <p>Receba 20% de desconto no seu primeiro projeto!</p>
            <p>Agende sua reunião gratuita agora:</p>
            <a href="./contato.html" class="btn btn--primary">📅 Agendar Reunião</a>
            <p class="exit-popup__guarantee">🛡️ Sem compromisso</p>
        </div>
    `;
    
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const content = popup.querySelector('.exit-popup__content');
    content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 400px;
        text-align: center;
        position: relative;
        animation: slideUp 0.3s ease;
    `;
    
    const closeBtn = popup.querySelector('.exit-popup__close');
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
    `;
    
    closeBtn.addEventListener('click', () => {
        popup.remove();
        localStorage.setItem('exitPopupShown', 'true');
    });
    
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.remove();
            localStorage.setItem('exitPopupShown', 'true');
        }
    });
    
    document.body.appendChild(popup);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { 
            opacity: 0;
            transform: translateY(20px);
        }
        to { 
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .exit-popup__content h3 {
        color: var(--primary-color);
        margin-bottom: 1rem;
    }
    
    .exit-popup__content p {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
    }
    
    .exit-popup__guarantee {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin-top: 1rem;
    }
`;
document.head.appendChild(style);

// ===== Counter Animation =====
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Velocidade da animação (menor = mais rápido)
    
    const countUp = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const count = parseInt(counter.innerText);
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => countUp(counter), 10);
        } else {
            counter.innerText = target + '+';
        }
    };
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                countUp(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Initialize all landing page features
function initLandingPageFeatures() {
    initCountdown();
    initFAQ();
    initScrollProgress();
    initExitIntent();
    initCounters();
}

// Enhanced Analytics Tracking
function trackConversion(action, value = null) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        const eventData = {
            event_category: 'Landing Page',
            event_label: action
        };
        
        if (value) {
            eventData.value = value;
        }
        
        gtag('event', action, eventData);
    }
    
    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
        fbq('track', action, { value: value });
    }
    
    console.log('Conversion tracked:', action, value);
}

// Track button clicks
document.addEventListener('DOMContentLoaded', () => {
    const ctaButtons = document.querySelectorAll('.btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const buttonText = button.textContent.trim();
            trackConversion('CTA Click', buttonText);
        });
    });
    
    // Track form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', () => {
            trackConversion('Form Submission');
        });
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            // Track milestones
            if (maxScroll === 25) trackConversion('Scroll 25%');
            if (maxScroll === 50) trackConversion('Scroll 50%');
            if (maxScroll === 75) trackConversion('Scroll 75%');
            if (maxScroll === 100) trackConversion('Scroll 100%');
        }
    });
});

// ===== Navigation =====
function initNavigation() {
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // If it's an anchor link, handle smooth scrolling
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Close mobile menu
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    // Smooth scroll to section
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active link
                    navLinks.forEach(l => l.classList.remove('active-link'));
                    link.classList.add('active-link');
                }
            }
        });
    });

    // Active link on scroll
    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink);
}

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active-link'));
            if (navLink) navLink.classList.add('active-link');
        }
    });
}

// ===== Scroll Effects =====
function initScrollEffects() {
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Back to top functionality
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Carousel =====
function initCarousel() {
    if (!carousel || slides.length === 0) return;

    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            pauseAutoplay();
            previousSlide();
            startAutoplay();
        });
    }

    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            pauseAutoplay();
            nextSlide();
            startAutoplay();
        });
    }

    // Indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            pauseAutoplay();
            goToSlide(index);
            startAutoplay();
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            pauseAutoplay();
            previousSlide();
            startAutoplay();
        } else if (e.key === 'ArrowRight') {
            pauseAutoplay();
            nextSlide();
            startAutoplay();
        }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            pauseAutoplay();
            nextSlide();
            startAutoplay();
        }
        if (touchEndX > touchStartX + 50) {
            pauseAutoplay();
            previousSlide();
            startAutoplay();
        }
    }

    // Pause on hover
    carousel.addEventListener('mouseenter', pauseAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
}

function updateCarousel() {
    // Update slides
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });

    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function startAutoplay() {
    pauseAutoplay();
    autoplayInterval = setInterval(nextSlide, autoplayDelay);
}

function pauseAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
    }
}

// ===== Forms =====
function initForms() {
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Newsletter form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }
}

function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email || !data.message) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }

    if (!isValidEmail(data.email)) {
        showNotification('Por favor, insira um email válido.', 'error');
        return;
    }

    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    setTimeout(() => {
        showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function handleNewsletterForm(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (!email || !isValidEmail(email)) {
        showNotification('Por favor, insira um email válido.', 'error');
        return;
    }

    // Simulate subscription
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    setTimeout(() => {
        showNotification('Inscrição realizada com sucesso! Obrigado por se inscrever.', 'success');
        e.target.reset();
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
    }, 1500);
}

// ===== Utility Functions =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
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
        wordWrap: 'break-word'
    });

    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#10b981';
            break;
        case 'error':
            notification.style.backgroundColor = '#ef4444';
            break;
        default:
            notification.style.backgroundColor = '#3b82f6';
    }

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

// ===== Performance Optimization =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Scroll-based animations can be added here
}, 100));

// ===== Intersection Observer for Animations =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service__card, .testimonial__card, .about__text, .about__image');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
}

// Initialize scroll animations when DOM is ready
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// ===== Lazy Loading for Images =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

// ===== Error Handling =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ===== Service Worker Registration (for PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
