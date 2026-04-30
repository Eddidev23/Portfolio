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

    // ─── 2. Unified Hero Reveal — H1, Subtitle & CTA ────────────────────────
    const hero     = document.getElementById('hero');
    const heroH1   = hero?.querySelector('h1');
    const subtitle = hero?.querySelector('.hero-subline');
    const cta      = hero?.querySelector('.hero-cta') || hero?.querySelector('a[href="#contact"]');

    if (heroH1 && subtitle && cta) {
        
        // Helper to wrap text into words with individual delays
        const wrapWords = (el, baseDelayMs, stepDelayS, isSingleBlock = false) => {
            if (isSingleBlock) {
                const inner = el.innerHTML;
                const delay = (baseDelayMs / 1000).toFixed(2);
                el.innerHTML = `<span class="word-wrapper"><span class="word" style="--delay: ${delay}s">${inner}</span></span>`;
                return 1; // 1 block
            }

            const parts = el.innerHTML.split(/(<br\s*\/?>)/i);
            let wordCount = 0;

            el.innerHTML = parts.map(part => {
                if (/^<br/i.test(part)) return part;
                return part
                    .split(' ')
                    .filter(w => w.length > 0)
                    .map(word => {
                        const delay = (baseDelayMs / 1000 + wordCount * stepDelayS).toFixed(2);
                        wordCount++;
                        return `<span class="word-wrapper"><span class="word" style="--delay: ${delay}s">${word}</span></span>`;
                    })
                    .join(' ');
            }).join('');

            return wordCount;
        };

        // 1. Wrap H1 (Starts at 0)
        const h1Count = wrapWords(heroH1, 0, 0.08);

        // 2. Wrap Subtitle (Starts after H1 ends)
        // startDelay = 400 + (h1 words * 90) + 700
        const subtitleStartDelay = 400 + (h1Count * 90) + 700;
        const subCount = wrapWords(subtitle, subtitleStartDelay, 0.07);

        // 3. Wrap CTA (Starts after Subtitle ends)
        // Delay = subtitleStartDelay + (sub words * 70) + 500
        const ctaDelay = subtitleStartDelay + (subCount * 70) + 500;
        wrapWords(cta, ctaDelay, 0, true);

        // Trigger animation
        setTimeout(() => {
            hero.classList.add('animate');
        }, 300);
    }

    // ─── 3. Reveal on Scroll (Intersection Observer) ─────────────────────────
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
