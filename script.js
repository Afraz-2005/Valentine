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

// No button interactions: floating frosted content boxes
let noBoxCount = 0;
const noBoxStatements = [
    [
        "You sure? Hearts are watching.",
        "Think about you throwing a microwave at me, then taking care of me all by yourself",
        "That would be a cute story to tell our grandkids."
    ],
    [
        "Our favorite song on repeat.",
        "Imagine us sharing the earphones, walking holding hands, and laughing together.",
        "Are you really going to say no?"
    ],
    [
        "Good vibes only. Be my reason to smile.",
        "You + me = best story.",
        "Last chance before I surrender... maybe."
    ]
];

function createFloatingBox(statements, options = {}) {
    // create an overlay that blurs/dims the page, then center the floating box inside it
    const overlay = document.createElement('div');
    overlay.className = 'floating-overlay';

    const box = document.createElement('div');
    box.className = 'floating-box';

    const stm = document.createElement('div');
    stm.className = 'floating-statements';
    statements.forEach(s => {
        const p = document.createElement('p');
        p.textContent = s;
        stm.appendChild(p);
    });
    box.appendChild(stm);

    const actions = document.createElement('div');
    actions.className = options.final ? 'final-buttons' : 'floating-actions';

    if (options.final) {
        const yes = document.createElement('button');
        yes.className = 'yes';
        yes.textContent = 'Yes';
        yes.addEventListener('click', () => { window.location.href = 'confession.html'; });

        const obv = document.createElement('button');
        obv.className = 'obvious';
        obv.textContent = 'Obviously';
        obv.addEventListener('click', () => { window.location.href = 'confession.html'; });

        actions.appendChild(yes);
        actions.appendChild(obv);
    } else {
        const close = document.createElement('button');
        close.className = 'btn';
        close.textContent = 'Close';
        close.addEventListener('click', () => { overlay.classList.remove('show'); setTimeout(() => overlay.remove(), 260); });
        actions.appendChild(close);
    }

    box.appendChild(actions);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // show with animation: reveal overlay and box
    requestAnimationFrame(() => {
        overlay.classList.add('show');
        box.classList.add('show');
    });

    // return overlay so caller can remove it if needed
    return overlay;
}

function setupButtons() {
    const yesBtn = document.querySelector('.yes-btn');
    const noBtn = document.querySelector('.no-btn');

    yesBtn.addEventListener('click', () => {
        window.location.href = 'confession.html';
    });

    noBtn.addEventListener('click', () => {
        // show up to 3 floating boxes, each with 3 statements
        if (noBoxCount < 3) {
            createFloatingBox(noBoxStatements[noBoxCount]);
            noBoxCount++;
        } else {
            // final box with options
            createFloatingBox([
                'Nice try kid, you know you cant reject me, and you still have two options to choose from 😎'
            ], { final: true });
            // remove the no button so user chooses from final box
            if (noBtn && noBtn.parentNode) noBtn.parentNode.removeChild(noBtn);
        }
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
