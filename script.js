// --- Interactive Connected Points & Lines Background Animation ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const numParticles = 65;
const maxDistance = 140;

let mouse = {
    x: null,
    y: null,
    radius: 180
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse interaction: push/pull or highlight reaction
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                this.x -= forceDirectionX * force * 2;
                this.y -= forceDirectionY * force * 2;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = document.body.classList.contains('light-theme') ? 'rgba(0, 119, 182, 0.6)' : 'rgba(0, 212, 255, 0.7)';
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDistance) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                let opacity = (1 - (dist / maxDistance)) * 0.35;
                const isLight = document.body.classList.contains('light-theme');
                ctx.strokeStyle = isLight ? `rgba(0, 119, 182, ${opacity})` : `rgba(0, 212, 255, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// --- Theme Toggle Functionality ---
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('light-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// --- Navigation Active Link Highlighter on Scroll ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// --- Contact Form Submission Handler ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for reaching out! Your message has been sent successfully.');
        contactForm.reset();
    });
}
// --- Cows and Bulls Game Logic ---
let secretCode = '';
let attempts = 0;

const startBtn = document.getElementById('start-btn');
const submitGuessBtn = document.getElementById('submit-guess-btn');
const userGuessInput = document.getElementById('user-guess');
const inputArea = document.getElementById('input-area');
const gameStatus = document.getElementById('game-status');
const historyList = document.getElementById('history-list');

function generateSecretNumber() {
    let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    digits.sort(() => Math.random() - 0.5);
    if (digits[0] === '0') {
        let nonZeroIndex = digits.findIndex(d => d !== '0');
        let temp = digits[0];
        digits[0] = digits[nonZeroIndex];
        digits[nonZeroIndex] = temp;
    }
    return digits.slice(0, 4).join('');
}

if (startBtn) {
    startBtn.addEventListener('click', () => {
        secretCode = generateSecretNumber();
        attempts = 0;
        gameStatus.textContent = "Game started! Try to guess the 4-digit code.";
        inputArea.classList.remove('disabled');
        historyList.innerHTML = '<p class="no-history">No guesses yet.</p>';
        userGuessInput.value = '';
        userGuessInput.focus();
    });
}

function handleGuess() {
    let guess = userGuessInput.value.trim();

    if (!/^\d{4}$/.test(guess)) {
        alert("Please enter a valid 4-digit number.");
        return;
    }

    let uniqueDigits = new Set(guess);
    if (uniqueDigits.size !== 4) {
        alert("All 4 digits must be unique (no repeating numbers)!");
        return;
    }

    attempts++;
    let bulls = 0;
    let cows = 0;

    for (let i = 0; i < 4; i++) {
        if (guess[i] === secretCode[i]) {
            bulls++;
        } else if (secretCode.includes(guess[i])) {
            cows++;
        }
    }

    if (historyList.querySelector('.no-history')) {
        historyList.innerHTML = '';
    }

    let item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `<span>Attempt #${attempts}: <strong>${guess}</strong></span> <span>🐂 ${bulls} Bull(s) | 🐄 ${cows} Cow(s)</span>`;
    historyList.prepend(item);

    if (bulls === 4) {
        gameStatus.textContent = `🎉 Congratulations! You guessed the code in ${attempts} attempts!`;
        inputArea.classList.add('disabled');
    } else {
        gameStatus.textContent = `Attempt ${attempts}: 🐂 ${bulls} Bull(s), 🐄 ${cows} Cow(s). Keep going!`;
    }

    userGuessInput.value = '';
    userGuessInput.focus();
}

if (submitGuessBtn) {
    submitGuessBtn.addEventListener('click', handleGuess);
}

if (userGuessInput) {
    userGuessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleGuess();
        }
    });
}
/* =========================================================
   PREMIUM HERO TYPING EFFECT
========================================================= */

const typingRole = document.getElementById("typing-role");

if (typingRole) {

    const roles = [
        "Software Developer",
        "Data Analyst",
        "Web Developer",
        "Java Developer",
        "Problem Solver"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeRole() {

        const currentRole = roles[roleIndex];

        if (!deleting) {

            typingRole.textContent =
                currentRole.substring(0, charIndex + 1);

            charIndex++;

            if (charIndex === currentRole.length) {

                deleting = true;

                setTimeout(typeRole, 1600);

                return;
            }

        } else {

            typingRole.textContent =
                currentRole.substring(0, charIndex - 1);

            charIndex--;

            if (charIndex === 0) {

                deleting = false;

                roleIndex =
                    (roleIndex + 1) % roles.length;
            }
        }

        setTimeout(
            typeRole,
            deleting ? 55 : 90
        );
    }

    typeRole();
}