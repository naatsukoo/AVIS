document.addEventListener('DOMContentLoaded', function() {
    
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (header) header.classList.toggle('scrolled', window.scrollY > 100);
    });

    const phoneLink = document.getElementById('phoneLink');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile && phoneLink) {
        phoneLink.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    }

    const callbackModal = document.getElementById('callbackModal');
    const modalClose = document.getElementById('modalClose');
    const cornerBtn = document.getElementById('cornerBtn');
    const heroBtn = document.getElementById('heroBtn');
    const productConsultBtn = document.getElementById('productConsultBtn');
    const phoneModal = document.getElementById('phoneModal');
    const phoneModalClose = document.getElementById('phoneModalClose');
    const callBackBtn = document.getElementById('callBackBtn');

    function openModal() { if (callbackModal) { callbackModal.classList.add('active'); document.body.style.overflow = 'hidden'; } }
    function closeModal() { if (callbackModal) { callbackModal.classList.remove('active'); document.body.style.overflow = 'auto'; } }
    function openPhoneModal() { if (phoneModal) { phoneModal.classList.add('active'); document.body.style.overflow = 'hidden'; } }
    function closePhoneModal() { if (phoneModal) { phoneModal.classList.remove('active'); document.body.style.overflow = 'auto'; } }

    if (cornerBtn) cornerBtn.addEventListener('click', openModal);
    if (heroBtn) heroBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if (productConsultBtn) productConsultBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (phoneModalClose) phoneModalClose.addEventListener('click', closePhoneModal);
    if (callBackBtn) callBackBtn.addEventListener('click', () => { closePhoneModal(); setTimeout(openModal, 300); });

    if (callbackModal) callbackModal.addEventListener('click', (e) => { if (e.target === callbackModal) closeModal(); });
    if (phoneModal) phoneModal.addEventListener('click', (e) => { if (e.target === phoneModal) closePhoneModal(); });

    document.querySelectorAll('.btn-contact').forEach(btn => btn.addEventListener('click', openPhoneModal));

    // ТАБЫ
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const isCallback = this.dataset.tab === 'callback';
            const cbForm = document.getElementById('callbackForm');
            const emForm = document.getElementById('emailForm');
            if (cbForm) cbForm.style.display = isCallback ? 'block' : 'none';
            if (emForm) emForm.style.display = isCallback ? 'none' : 'block';
        });
    });

    // ОТПРАВКА ЧЕРЕЗ WEB3FORMS
    function handleFormSubmit(form) {
        if (!form) return;
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';

            try {
                const formData = new FormData(form);
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);

                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });
                
                const result = await response.json();

                if (result.success) {
                    showSuccessMessage(form);
                    form.reset();
                } else {
                    throw new Error(result.message || 'Ошибка отправки');
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при отправке. Пожалуйста, позвоните нам по телефону.');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        });
    }

    function showSuccessMessage(form) {
        const isCallback = form.id === 'callbackForm';
        const msg = isCallback ? 'Спасибо! Мы перезвоним вам в течение 15 минут.' : 'Спасибо! Мы ответим на ваше письмо в течение рабочего дня.';
        form.innerHTML = `<div class="success-message"><i class="fas fa-check-circle"></i><h3>Заявка отправлена!</h3><p>${msg}</p></div>`;
        setTimeout(() => { if (callbackModal?.classList.contains('active')) closeModal(); }, 3000);
    }

    [document.getElementById('callbackForm'), document.getElementById('emailForm'), document.getElementById('contactForm')].forEach(handleFormSubmit);

    // МОБИЛЬНОЕ МЕНЮ
    document.querySelectorAll('.nav-menu > li').forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && this.querySelector('.dropdown-menu')) this.classList.toggle('active');
        });
    });

    // ПЛАВНЫЙ СКРОЛЛ
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.length > 1 && href.includes('#') && !this.onclick) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); closePhoneModal(); } });
});
