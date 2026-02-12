// Carousel functionality
let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-image');
const dots = document.querySelectorAll('.dot');
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

// Create burst particles effect
function createBurstParticles() {
    const colors = ['#7CB342', '#9CCC65', '#FF6B9D', '#FFB74D', '#42A5F5', '#FFA3C1', '#FFD54F', '#558B2F'];
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const angle = (i / particleCount) * Math.PI * 2;
        const tx = Math.cos(angle) * 80;
        const ty = Math.sin(angle) * 80;
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: 50%;
            top: 50%;
            --tx: ${tx}px;
            pointer-events: none;
        `;

        floatingProduct.appendChild(particle);
        particle.classList.add('burst-particle');

        setTimeout(() => particle.remove(), 2000);
    }
}

// Auto-rotate carousel every 5 seconds
setInterval(nextSlide, 5000);

// Order system functionality
let quantity = 1;
let unitPrice = 0;

function selectProduct(productName, price) {
    document.querySelectorAll('input[name="scent"]').forEach(input => {
        input.checked = false;
    });

    document.getElementById('selectedScent').textContent = productName;
    unitPrice = price;
    quantity = 1;
    document.getElementById('quantity').textContent = quantity;
    updateOrderSummary();

    const radios = document.querySelectorAll('input[name="scent"]');
    for (let radio of radios) {
        if (radio.value === productName) {
            radio.checked = true;
            break;
        }
    }

    setTimeout(() => {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function handleScent(input) {
    if (input.checked) {
        document.getElementById('selectedScent').textContent = input.value;
        unitPrice = parseInt(input.getAttribute('data-price'));
        quantity = 1;
        document.getElementById('quantity').textContent = quantity;
        updateOrderSummary();
    }
}

function updateOrderSummary() {
    if (unitPrice === 0) {
        document.getElementById('itemPrice').textContent = '—';
        document.getElementById('subtotal').textContent = '—';
        document.getElementById('total').textContent = '—';
        return;
    }

    const subtotal = unitPrice * quantity;
    const total = subtotal;

    document.getElementById('itemPrice').textContent = '₱' + unitPrice.toLocaleString();
    document.getElementById('subtotal').textContent = '₱' + subtotal.toLocaleString();
    document.getElementById('total').textContent = '₱' + total.toLocaleString();
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

function sendOrderEmail() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const scentInput = document.querySelector('input[name="scent"]:checked');
    const instructions = document.getElementById('instructions').value;

    if (!fullName || !email || !phone || !address || !scentInput) {
        alert('Please fill in all required fields and select a scent.');
        return;
    }

    if (unitPrice === 0) {
        alert('Please select a scent to proceed.');
        return;
    }

    const subtotal = unitPrice * quantity;
    const total = subtotal;

    const emailBody = `
ORDER SUMMARY
===========================================

CUSTOMER INFORMATION:
Name: ${fullName}
Email: ${email}
Phone: ${phone}
Delivery Address: ${address}

ORDER DETAILS:
Product: ${scentInput.value}
Quantity: ${quantity}
Unit Price: ₱${unitPrice}
Subtotal: ₱${subtotal.toLocaleString()}

SHIPPING:
FREE to Luzon, Visayas, Mindanao: ₱0

TOTAL: ₱${total.toLocaleString()}

SPECIAL INSTRUCTIONS:
${instructions || 'None'}

===========================================

Thank you for choosing Re:Scent!
We are committed to sustainable luxury fragrance.

This order will be processed shortly.
You will receive a confirmation email with delivery details.
`;

    const mailtoLink = `mailto:rescentph.official@gmail.com?subject=New Order from ${fullName}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
}

// Scroll animations
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
    threshold: 0.2,
    rootMargin: '-50px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Smooth scroll
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        window.scrollTo({
            top: targetSection.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

// Initialize hero
document.getElementById('hero').classList.add('visible');