// Heart animation on page load
function createHearts() {
    const container = document.querySelector('.hearts-container');
    const heartCount = 30;
    const duration = 1500; // milliseconds for hearts to shoot up

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
        }, i * 50);
    }
}

// Show content after 2 seconds
function showContent() {
    const nameEl = document.querySelector('.name');
    const questionEl = document.querySelector('.question');
    const buttonsEl = document.querySelector('.buttons');
    
    setTimeout(() => {
        nameEl.classList.remove('hidden');
        setTimeout(() => {
            questionEl.classList.remove('hidden');
            setTimeout(() => {
                buttonsEl.classList.remove('hidden');
            }, 200);
        }, 200);
    }, 2000);
}

// No button interactions: sequential random buttons flow
let sequenceStarted = false;

function createRandomButton(text, onClick) {
    const btn = document.createElement('button');
    btn.className = 'no-random';
    btn.textContent = text;
    btn.style.position = 'fixed';
    const w = Math.min(200, window.innerWidth * 0.35);
    const h = 50;

    const container = document.querySelector('.content');
    const rect = container ? container.getBoundingClientRect() : { left: window.innerWidth/2 - 100, right: window.innerWidth/2 + 100, top: window.innerHeight/2 - 100, bottom: window.innerHeight/2 + 100 };

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const rand = (a, b) => Math.random() * (b - a) + a;

    // choose a side around the container: top, bottom, left, right
    const sides = ['top', 'bottom', 'left', 'right'];
    const side = sides[Math.floor(Math.random() * sides.length)];

    let randomX, randomY;
    if (side === 'top') {
        randomX = rand(rect.left - w + 20, rect.right - 20);
        randomX = clamp(randomX, 10, window.innerWidth - w - 10);
        randomY = clamp(rect.top - h - 20 - rand(0, 120), 10, window.innerHeight - h - 10);
    } else if (side === 'bottom') {
        randomX = rand(rect.left - w + 20, rect.right - 20);
        randomX = clamp(randomX, 10, window.innerWidth - w - 10);
        randomY = clamp(rect.bottom + 20 + rand(0, 120), 10, window.innerHeight - h - 10);
    } else if (side === 'left') {
        randomX = clamp(rect.left - w - 20 - rand(0, 120), 10, window.innerWidth - w - 10);
        randomY = rand(rect.top - 10, rect.bottom - h + 10);
        randomY = clamp(randomY, 10, window.innerHeight - h - 10);
    } else { // right
        randomX = clamp(rect.right + 20 + rand(0, 120), 10, window.innerWidth - w - 10);
        randomY = rand(rect.top - 10, rect.bottom - h + 10);
        randomY = clamp(randomY, 10, window.innerHeight - h - 10);
    }

    btn.style.left = randomX + 'px';
    btn.style.top = randomY + 'px';
    btn.style.zIndex = 1000;
    document.body.appendChild(btn);

    const handler = (e) => {
        e.stopPropagation();
        btn.removeEventListener('click', handler);
        if (typeof onClick === 'function') onClick(btn);
    };

    btn.addEventListener('click', handler);
    return btn;
}

function setupButtons() {
    const yesBtn = document.querySelector('.yes-btn');
    const noBtn = document.querySelector('.no-btn');

    yesBtn.addEventListener('click', () => {
        window.location.href = 'confession.html';
    });

    noBtn.addEventListener('click', () => {
        if (sequenceStarted) return;
        sequenceStarted = true;
        // hide the original No button while sequence runs
        noBtn.style.visibility = 'hidden';

        // Step 1: show "are you sure?"
        const first = createRandomButton('are you sure?', (firstBtn) => {
            // remove first button and show second
            firstBtn.remove();

            // Step 2: show "try again kid"
            const second = createRandomButton('try again kid', (secondBtn) => {
                // clicking second removes it and ensures only Yes remains
                secondBtn.remove();
                // remove the original No button entirely
                if (noBtn && noBtn.parentNode) noBtn.parentNode.removeChild(noBtn);
                // sequence finished
                sequenceStarted = false;
            });
        });
    });
}

// Initialize
// Mobile handling: show overlay on small devices
function showMobileOverlay() {
    if (document.getElementById('mobile-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'mobile-overlay';
    overlay.className = 'mobile-overlay';
    overlay.innerHTML = `<div class="message">phone diye toh open kora jabena 😢</div>`;
    document.body.appendChild(overlay);
}

function hideMobileOverlay() {
    const el = document.getElementById('mobile-overlay');
    if (el) el.remove();
}

let appInitialized = false;
function initApp() {
    if (appInitialized) return;
    createHearts();
    showContent();
    setupButtons();
    appInitialized = true;
}

function teardownApp() {
    // Minimal teardown: remove hearts and allow re-init later
    const container = document.querySelector('.hearts-container');
    if (container) container.innerHTML = '';
    const buttons = document.querySelectorAll('.no-random');
    buttons.forEach(b => b.remove());
    appInitialized = false;
}

function checkSmallDeviceAndAct() {
    const width = window.innerWidth || document.documentElement.clientWidth;
    const threshold = 680; // phones and small tablets
    if (width <= threshold) {
        // show overlay and teardown interactive parts
        showMobileOverlay();
        teardownApp();
    } else {
        hideMobileOverlay();
        initApp();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkSmallDeviceAndAct();
    window.addEventListener('resize', () => {
        checkSmallDeviceAndAct();
    });
});
