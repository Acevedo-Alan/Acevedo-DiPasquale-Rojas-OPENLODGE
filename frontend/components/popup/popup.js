// Popup System JavaScript
let activePopup = null;
let autoDismissTimer = null;
let confettiAnimation = null;

/**
 * Show a popup with the specified configuration
 * @param {string} type - Type of popup: 'success', 'warning', or 'error'
 * @param {string} title - Main title of the popup
 * @param {string} message - Detailed message
 * @param {string} actionText - Text for the primary action button
 * @param {function} actionCallback - Optional callback for primary action
 * @param {boolean} autoDismiss - Whether to auto-dismiss after 5 seconds (default: true for success)
 */
function showPopup(type, title, message, actionText, actionCallback, autoDismiss = null) {
    // Clear any existing popup
    if (activePopup) {
        closePopup();
    }

    // Get elements
    const overlay = document.getElementById('popupOverlay');
    const container = document.getElementById('popupContainer');
    const icon = document.getElementById('popupIcon');
    const titleEl = document.getElementById('popupTitle');
    const messageEl = document.getElementById('popupMessage');
    const actionBtn = document.getElementById('popupActionBtn');
    const closeBtn = document.getElementById('popupCloseBtn');

    // Set content
    titleEl.textContent = title;
    messageEl.textContent = message;
    actionBtn.textContent = actionText;

    // Set type-specific styling
    container.className = `popup-container ${type}`;
    icon.className = `popup-icon ${type}`;

    // Setup action button
    actionBtn.onclick = () => {
        if (actionCallback) {
            actionCallback();
        }
        closePopup();
    };

    // Setup close button
    closeBtn.onclick = closePopup;

    // Show popup
    overlay.classList.add('active');
    activePopup = overlay;

    // Special effects for success type
    if (type === 'success') {
        setTimeout(() => launchConfetti(), 300);
    }

    // Auto-dismiss logic
    const shouldAutoDismiss = autoDismiss !== null ? autoDismiss : type === 'success';
    if (shouldAutoDismiss) {
        autoDismissTimer = setTimeout(() => {
            closePopup();
        }, 5000);
    }

    // Keyboard events
    document.addEventListener('keydown', handleEscapeKey);
    
    // Focus management
    setTimeout(() => {
        actionBtn.focus();
    }, 100);

    // Prevent background scroll
    document.body.style.overflow = 'hidden';
}

/**
 * Close the active popup
 */
function closePopup() {
    if (!activePopup) return;

    activePopup.classList.remove('active');
    
    // Clear timers
    if (autoDismissTimer) {
        clearTimeout(autoDismissTimer);
        autoDismissTimer = null;
    }

    // Stop confetti
    if (confettiAnimation) {
        cancelAnimationFrame(confettiAnimation);
        confettiAnimation = null;
        clearConfetti();
    }

    // Cleanup after animation
    setTimeout(() => {
        if (activePopup) {
            const container = activePopup.querySelector('.popup-container');
            container.className = 'popup-container';
        }
        activePopup = null;
        document.body.style.overflow = '';
    }, 300);

    // Remove keyboard listener
    document.removeEventListener('keydown', handleEscapeKey);
}

/**
 * Handle Escape key to close popup
 */
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closePopup();
    }
}

/**
 * Confetti Effect for Success Popups
 */
const confettiColors = ['#2b9c4f', '#6b9b7a', '#d4e6d7', '#f5a524', '#667eea'];
const confettiParticles = [];

function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create particles
    for (let i = 0; i < 100; i++) {
        confettiParticles.push({
            x: Math.random() * canvas.width,
            y: -10,
            vx: Math.random() * 6 - 3,
            vy: Math.random() * 3 + 2,
            size: Math.random() * 3 + 2,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            angle: Math.random() * 360,
            angleVelocity: Math.random() * 10 - 5,
            opacity: 1
        });
    }
    
    animateConfetti(ctx, canvas);
}

function animateConfetti(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let activeParticles = 0;
    
    confettiParticles.forEach((particle, index) => {
        if (particle.opacity <= 0) return;
        
        activeParticles++;
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // gravity
        particle.angle += particle.angleVelocity;
        
        // Fade out
        if (particle.y > canvas.height * 0.7) {
            particle.opacity -= 0.02;
        }
        
        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.angle * Math.PI / 180);
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 1.5);
        ctx.restore();
    });
    
    if (activeParticles > 0) {
        confettiAnimation = requestAnimationFrame(() => animateConfetti(ctx, canvas));
    } else {
        clearConfetti();
    }
}

function clearConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles.length = 0;
}

// Handle window resize for confetti
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confettiCanvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// Click outside to close
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('popupOverlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closePopup();
            }
        });
    }
});

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { showPopup, closePopup };
}