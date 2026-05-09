/**
 * Eddi Flowin Portfolio — Interactivity
 */

// ─── Hero Elements ────────────────────────────────────────────────────────────
const h1 = document.querySelector('#hero h1');
const subtitle = document.querySelector('#hero .hero-subline');
const cta = null; // CTA je řízeno přes classList.add('visible')

// ─── Word by Word Reveal ──────────────────────────────────────────────────────
function wordReveal(element, startDelay, wordDelay) {
    const text = element.innerText;
    const words = text.split(' ');
    element.innerHTML = words.map(function(word, i) {
        return '<span style="display:inline-block; overflow:hidden; vertical-align:bottom; margin-right:0.25em;">' +
               '<span style="display:inline-block; transform:translateY(110%); opacity:0; transition: transform 0.7s cubic-bezier(0.16,1,0.3,1) ' + (startDelay / 1000 + i * wordDelay) + 's, opacity 0.5s ease ' + (startDelay / 1000 + i * wordDelay) + 's;">' +
               word +
               '</span></span>';
    }).join('');

    setTimeout(function() {
        element.querySelectorAll('span span').forEach(function(w) {
            w.style.transform = 'translateY(0)';
            w.style.opacity = '1';
        });
    }, startDelay);
}

document.addEventListener('DOMContentLoaded', function() {

    // ─── 1. Hero Reveal ───────────────────────────────────────────────────────

    // Nadpis po 200ms, slova po 0.09s
    if (h1) wordReveal(h1, 200, 0.09);

    // Podnadpis po 500ms, slova po 0.07s
    if (subtitle) wordReveal(subtitle, 500, 0.07);

    // CTA tlačítko — objeví se po 2000ms
    setTimeout(function() {
        var btn = document.querySelector('#hero .cta-button');
        if (btn) {
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        }
    }, 2000);

    // ─── 2. Navbar Scroll Effect ──────────────────────────────────────────────
    const navbar = document.getElementById('navbar');

    const handleNavScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // ─── 3. Reveal on Scroll (Intersection Observer) ──────────────────────────
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── 4. Smooth Scroll for Nav Links ──────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetY = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: targetY, behavior: 'smooth' });
            }
        });
    });

    // ─── 5. Web3Forms Contact Form ────────────────────────────────────────────
    const contactForm = document.getElementById('contact-form');
    const submitBtn   = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous feedback
        formMessage.className = 'form-message';
        formMessage.textContent = '';

        // Loading state
        const originalText  = submitBtn.textContent;
        submitBtn.textContent = 'Odesílám...';
        submitBtn.disabled    = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                formMessage.textContent = 'Děkuji za poptávku! Ozvu se do 24 hodin.';
                formMessage.classList.add('success');
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Odeslání selhalo.');
            }
        } catch (err) {
            formMessage.textContent = 'Chyba při odesílání. Zkuste to prosím znovu nebo mě kontaktujte přímo.';
            formMessage.classList.add('error');
            console.error('Form submission error:', err);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled    = false;

            // Scroll feedback into view on mobile
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });

});
