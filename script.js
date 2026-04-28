/**
 * Eddi Flowin Portfolio — Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. Navbar Scroll Effect ─────────────────────────────────────────────
    const navbar = document.getElementById('navbar');

    const handleNavScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // ─── 2. Reveal on Scroll (Intersection Observer) ─────────────────────────
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

    // ─── 3. Smooth Scroll for Nav Links ──────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            const navHeight = navbar.offsetHeight;
            const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({ top: targetY, behavior: 'smooth' });
        });
    });

    // ─── 4. Web3Forms Contact Form ────────────────────────────────────────────
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
