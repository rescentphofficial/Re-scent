// =============================================
// EMAILJS CONFIGURATION
// =============================================
// 1. Sign up free at https://www.emailjs.com
// 2. Add Gmail as a service → copy your Service ID
// 3. Create two email templates → copy each Template ID
// 4. Go to Account → copy your Public Key
// Then replace the four placeholder strings below:

const EMAILJS_PUBLIC_KEY   = 'WEaxY9FjAwAfbfZSp';
const EMAILJS_SERVICE_ID   = 'service_zt65vmp';
const ORDER_TEMPLATE_ID    = 'template_0baoi1m';
const FEEDBACK_TEMPLATE_ID = 'template_r7yud9o';

// Initialize EmailJS with your public key
(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: WEaxY9FjAwAfbfZSp });
    }
})();

// =============================================
// CAROUSEL
// =============================================
let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-image');
const dots   = document.querySelectorAll('.dot');
const floatingProduct = document.getElementById('floatingProduct');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        dots[i].classList.remove('active');
    });
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    createBurstParticles();
}

function currentSlide(index) {
    currentIndex = index;
    showSlide(currentIndex);
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
}

function createBurstParticles() {
    const colors = ['#7CB342','#9CCC65','#FF6B9D','#FFB74D','#42A5F5','#FFA3C1','#FFD54F','#558B2F'];
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        const angle = (i / 15) * Math.PI * 2;
        const tx    = Math.cos(angle) * 80;
        const size  = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.cssText = `
            position:absolute; width:${size}px; height:${size}px;
            background:${color}; border-radius:50%;
            left:50%; top:50%; --tx:${tx}px; pointer-events:none;
        `;
        floatingProduct.appendChild(particle);
        particle.classList.add('burst-particle');
        setTimeout(() => particle.remove(), 2000);
    }
}

setInterval(nextSlide, 5000);

// =============================================
// ORDER SYSTEM
// =============================================
let quantity  = 1;
let unitPrice = 0;

function selectProduct(productName, price) {
    document.querySelectorAll('input[name="scent"]').forEach(input => input.checked = false);
    document.getElementById('selectedScent').textContent = productName;
    unitPrice = price;
    quantity  = 1;
    document.getElementById('quantity').textContent = quantity;
    updateOrderSummary();
    document.querySelectorAll('input[name="scent"]').forEach(radio => {
        if (radio.value === productName) radio.checked = true;
    });
    setTimeout(() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }), 100);
}

function handleScent(input) {
    if (input.checked) {
        document.getElementById('selectedScent').textContent = input.value;
        unitPrice = parseInt(input.getAttribute('data-price'));
        quantity  = 1;
        document.getElementById('quantity').textContent = quantity;
        updateOrderSummary();
    }
}

function updateOrderSummary() {
    if (unitPrice === 0) {
        document.getElementById('itemPrice').textContent = '—';
        document.getElementById('subtotal').textContent  = '—';
        document.getElementById('total').textContent     = '—';
        return;
    }
    const subtotal = unitPrice * quantity;
    document.getElementById('itemPrice').textContent = '₱' + unitPrice.toLocaleString();
    document.getElementById('subtotal').textContent  = '₱' + subtotal.toLocaleString();
    document.getElementById('total').textContent     = '₱' + subtotal.toLocaleString();
}

function increaseQty() {
    quantity++;
    document.getElementById('quantity').textContent = quantity;
    updateOrderSummary();
}

function decreaseQty() {
    if (quantity > 1) {
        quantity--;
        document.getElementById('quantity').textContent = quantity;
        updateOrderSummary();
    }
}

// ---- Open Invoice ----
function openInvoice(params) {
    const q = new URLSearchParams({
        name:    params.from_name,
        email:   params.from_email,
        phone:   params.phone,
        address: params.address,
        scent:   params.product,
        qty:     params.quantity,
        price:   unitPrice,
        notes:   params.instructions,
    });
    window.open('invoice.html?' + q.toString(), '_blank');
}

// ---- Send Order ----
function sendOrderEmail() {
    const fullName     = document.getElementById('fullName').value.trim();
    const email        = document.getElementById('email').value.trim();
    const phone        = document.getElementById('phone').value.trim();
    const address      = document.getElementById('address').value.trim();
    const scentInput   = document.querySelector('input[name="scent"]:checked');
    const instructions = document.getElementById('instructions').value.trim();

    if (!fullName || !email || !phone || !address || !scentInput) {
        showToast('❌ Please fill in all required fields and select a scent.', 'error');
        return;
    }

    const subtotal = unitPrice * quantity;
    const btn = document.querySelector('.email-button');
    btn.disabled    = true;
    btn.textContent = '⏳ Sending...';

    const templateParams = {
        to_email:     'rescentph.official@gmail.com',
        from_name:    fullName,
        from_email:   email,
        phone:        phone,
        address:      address,
        product:      scentInput.value,
        net_weight:   '1 oz / 26g',
        quantity:     quantity,
        unit_price:   '₱' + unitPrice,
        subtotal:     '₱' + subtotal.toLocaleString(),
        shipping:     'FREE (₱0)',
        total:        '₱' + subtotal.toLocaleString(),
        instructions: instructions || 'None',
    };

    // Fallback to mailto if EmailJS not yet configured
    if (typeof emailjs === 'undefined' || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        const body = `ORDER SUMMARY\n===========================================\n\nCUSTOMER INFORMATION:\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nDelivery Address: ${address}\n\nORDER DETAILS:\nProduct: ${scentInput.value}\nNet Wt.: 1 oz / 26g\nQuantity: ${quantity}\nUnit Price: ₱${unitPrice}\nSubtotal: ₱${subtotal.toLocaleString()}\n\nSHIPPING: FREE (₱0)\nTOTAL: ₱${subtotal.toLocaleString()}\n\nSPECIAL INSTRUCTIONS:\n${instructions || 'None'}\n===========================================\nThank you for choosing Re:Scent!`;
        window.location.href = `mailto:rescentph.official@gmail.com?subject=New Order from ${fullName}&body=${encodeURIComponent(body)}`;
        openInvoice(templateParams);
        btn.disabled    = false;
        btn.textContent = '📧 Send Order to Email';
        return;
    }

    emailjs.send(EMAILJS_SERVICE_ID, ORDER_TEMPLATE_ID, templateParams)
        .then(() => {
            showToast('✅ Order sent! We\'ll reach out to you shortly.', 'success');
            btn.textContent = '✅ Order Sent!';
            openInvoice(templateParams);
            setTimeout(() => {
                btn.disabled    = false;
                btn.textContent = '📧 Send Order to Email';
            }, 4000);
        })
        .catch((err) => {
            console.error('EmailJS order error:', err);
            showToast('❌ Could not send. Please email us directly.', 'error');
            btn.disabled    = false;
            btn.textContent = '📧 Send Order to Email';
        });
}

// =============================================
// FEEDBACK SYSTEM
// =============================================
let selectedRating = 0;

document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('mouseover', () => highlightStars(parseInt(star.getAttribute('data-value'))));
        star.addEventListener('mouseout',  () => highlightStars(selectedRating));
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.getAttribute('data-value'));
            document.getElementById('ratingValue').value = selectedRating;
            highlightStars(selectedRating);
        });
    });
});

function highlightStars(count) {
    document.querySelectorAll('.star').forEach((star, i) => {
        star.classList.toggle('active', i < count);
    });
}

function submitFeedback() {
    const name   = document.getElementById('feedbackName').value.trim();
    const scent  = document.getElementById('feedbackScent').value;
    const rating = parseInt(document.getElementById('ratingValue').value);
    const text   = document.getElementById('feedbackText').value.trim();

    if (!name || !scent || rating === 0 || !text) {
        showToast('❌ Please fill in all fields and give a star rating.', 'error');
        return;
    }

    const fbBtn = document.querySelector('.feedback-submit-btn');
    fbBtn.disabled    = true;
    fbBtn.textContent = '⏳ Sending...';

    const templateParams = {
        to_email:      'rescentph.official@gmail.com',
        customer_name: name,
        scent:         scent,
        rating:        '★'.repeat(rating) + '☆'.repeat(5 - rating) + ` (${rating}/5)`,
        feedback:      text,
    };

    const finishFeedback = () => {
        renderNewFeedback({ name, scent, rating, text });
        resetFeedbackForm();
        fbBtn.textContent = '✅ Feedback Sent!';
        showToast('💚 Thanks for your review!', 'success');
        setTimeout(() => {
            fbBtn.disabled    = false;
            fbBtn.textContent = '💚 Submit Feedback';
        }, 4000);
    };

    // Fallback: render locally if EmailJS not configured
    if (typeof emailjs === 'undefined' || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        finishFeedback();
        return;
    }

    emailjs.send(EMAILJS_SERVICE_ID, FEEDBACK_TEMPLATE_ID, templateParams)
        .then(finishFeedback)
        .catch((err) => {
            console.error('EmailJS feedback error:', err);
            finishFeedback(); // still show review locally
            showToast('⚠️ Review posted, but email notification failed.', 'error');
        });
}

function resetFeedbackForm() {
    document.getElementById('feedbackName').value  = '';
    document.getElementById('feedbackScent').value = '';
    document.getElementById('ratingValue').value   = '0';
    document.getElementById('feedbackText').value  = '';
    selectedRating = 0;
    highlightStars(0);
}

function renderNewFeedback(entry) {
    const list = document.getElementById('feedbackList');
    const avatarColors = [
        'linear-gradient(135deg,#7CB342,#9CCC65)',
        'linear-gradient(135deg,#FF6B9D,#FFA3C1)',
        'linear-gradient(135deg,#FFB74D,#FFD54F)',
        'linear-gradient(135deg,#42A5F5,#64B5F6)',
        'linear-gradient(135deg,#7B1FA2,#AB47BC)',
    ];
    const colorIndex  = Math.floor(Math.random() * avatarColors.length);
    const starsHtml   = '★'.repeat(entry.rating) + '☆'.repeat(5 - entry.rating);
    const scentEmojis = {
        'Nectar Noir':'🖤','Euphoric Solace':'💖','Ivory Rouge':'✨',
        'Midnight Opulence':'🌙','Perry Winkle':'🌸'
    };
    const emoji = scentEmojis[entry.scent] || '🌿';

    const card = document.createElement('div');
    card.className = 'feedback-card feedback-card-new';
    card.innerHTML = `
        <div class="feedback-header">
            <div class="feedback-avatar" style="background:${avatarColors[colorIndex]};">${entry.name.charAt(0).toUpperCase()}</div>
            <div class="feedback-meta">
                <strong>${entry.name}</strong>
                <span class="feedback-scent">${emoji} ${entry.scent}</span>
            </div>
            <div class="feedback-stars">${starsHtml}</div>
        </div>
        <p class="feedback-text">"${entry.text}"</p>
    `;
    list.insertBefore(card, list.firstChild);
    setTimeout(() => card.classList.add('visible'), 10);
}

// =============================================
// TOAST NOTIFICATIONS
// =============================================
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('toast-visible'), 10);
    setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// =============================================
// SCROLL ANIMATIONS & ACTIVE NAV
// =============================================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
            });
        }
    });
}, { threshold: 0.2, rootMargin: '-50px' });

sections.forEach(section => sectionObserver.observe(section));

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    });
});

document.getElementById('hero').classList.add('visible');
