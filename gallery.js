// Gallery page flip functionality - single page at a time
let currentPageIndex = 0;
const totalPages = 11;
let isFlipping = false;

const pages = document.querySelectorAll('.page');
const pageCounter = document.getElementById('current-page');
const bookPages = document.getElementById('book-pages');

function updatePageDisplay() {
    pages.forEach((page, idx) => {
        page.classList.remove('active', 'prev');
        
        if (idx === currentPageIndex) {
            page.classList.add('active');
        } else if (idx < currentPageIndex) {
            page.classList.remove('prev');
        }
    });
    pageCounter.textContent = currentPageIndex + 1;
}

function nextPage() {
    if (currentPageIndex < totalPages - 1 && !isFlipping) {
        isFlipping = true;
        currentPageIndex++;
        updatePageDisplay();
        setTimeout(() => { isFlipping = false; }, 600);
    }
}

function prevPage() {
    if (currentPageIndex > 0 && !isFlipping) {
        isFlipping = true;
        currentPageIndex--;
        updatePageDisplay();
        setTimeout(() => { isFlipping = false; }, 600);
    }
}

// Mouse tracking for page tilt effect
document.addEventListener('mousemove', (e) => {
    if (!bookPages || window.innerWidth <= 768) return;
    
    const rect = bookPages.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Subtle tilt based on mouse position
    const tiltX = ((y - centerY) / centerY) * 6;
    const tiltY = ((x - centerX) / centerX) * 8;
    
    bookPages.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
});

// Reset tilt on mouse leave
document.addEventListener('mouseleave', () => {
    if (bookPages) {
        bookPages.style.transform = 'rotateX(0) rotateY(0)';
    }
});

// Initialize display
updatePageDisplay();

// Heart animation
function createHearts() {
    const container = document.querySelector('.hearts-container');
    if (!container) return;
    
    const heartCount = 15;
    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = '❤️';
            
            const randomX = Math.random() * window.innerWidth;
            const randomTx = (Math.random() - 0.5) * 200;
            
            heart.style.left = randomX + 'px';
            heart.style.setProperty('--tx', randomTx + 'px');
            
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 3000);
        }, i * 80);
    }
}

// Start hearts on page load
document.addEventListener('DOMContentLoaded', createHearts);
