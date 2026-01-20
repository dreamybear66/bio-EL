/**
 * Treatment Optimizer Landing Page
 * Simple navigation and card interactions
 */

// Smooth scroll for any internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add hover effects to optimizer cards
const optimizerCards = document.querySelectorAll('.optimizer-card');

optimizerCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Log initialization
console.log('Treatment Optimizer Landing Page initialized');
console.log('Available optimizers: Temperature, Waste, Cost');
