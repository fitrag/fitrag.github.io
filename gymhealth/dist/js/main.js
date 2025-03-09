// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileCloseBtn = document.querySelector('.mobile-close-btn');
const menuItems = document.querySelectorAll('.menu-item');

// Function to open mobile menu with staggered animations
function openMobileMenu() {
    mobileMenu.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('opacity-100', 'scale-100');

    // Staggered animation for menu items
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.remove('translate-y-8', 'opacity-0');
            item.classList.add('translate-y-0', 'opacity-100');
        }, 100 + (index * 100)); // Stagger the animations
    });

    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
}

// Function to close mobile menu
function closeMobileMenu() {
    menuItems.forEach((item) => {
        item.classList.remove('translate-y-0', 'opacity-100');
        item.classList.add('translate-y-8', 'opacity-0');
    });

    setTimeout(() => {
        mobileMenu.classList.remove('opacity-100', 'scale-100');
        mobileMenu.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
        document.body.style.overflow = ''; // Re-enable scrolling
    }, 300);
}

// Event listeners
mobileMenuButton.addEventListener('click', openMobileMenu);
mobileCloseBtn.addEventListener('click', closeMobileMenu);

// Close menu when clicking on a link
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Back to top button
const backToTopBtn = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.remove('hidden');
    } else {
        backToTopBtn.classList.add('hidden');
    }
});

backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('DOMContentLoaded', function () {
    const backToTopButton = document.querySelector('.back-to-top');
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollPercentage = document.querySelector('.scroll-percentage');
    const scrollIcon = document.querySelector('.scroll-icon');
    const scrollIconRocket = document.querySelector('.scroll-icon-rocket');
    const scrollProgressBorder = document.querySelector('.scroll-progress-border');

    // Function to calculate scroll percentage
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight * 100;
        const roundedPercent = Math.round(scrollPercent);

        // Update the progress bar width
        scrollProgress.style.height = `${scrollPercent}%`;

        // Update the border with conic gradient - fixed direction and color
        // scrollProgressBorder.style.background = `conic-gradient(var(--color-primary) 0deg, var(--color-primary) ${scrollPercent * 3.6}deg, transparent ${scrollPercent * 3.6}deg, transparent 360deg)`;

        // Update the percentage text
        scrollPercentage.textContent = `${roundedPercent}%`;

        // Show/hide the back to top button
        if (scrollTop > 100) {
            backToTopButton.classList.remove('hidden');
        } else {
            backToTopButton.classList.add('hidden');
        }

        // Change icon to rocket when reaching 100%
        if (roundedPercent >= 98) {
            // scrollIconRocket.classList.add('hidden');
            scrollPercentage.classList.add('hidden');
            scrollIconRocket.classList.remove('hidden');
            scrollIconRocket.style.display = 'inline-block';
            scrollIcon.style.display = 'inline-block';
        } else {
            scrollIcon.style.display = 'none';
            scrollIconRocket.style.display = 'none';
            scrollIconRocket.classList.add('hidden');
            scrollPercentage.classList.remove('hidden');
        }
    }

    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Update scroll progress on scroll
    window.addEventListener('scroll', updateScrollProgress);

    // Initial update
    updateScrollProgress();

    const pricingToggle = document.getElementById('pricing-toggle');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const yearlyPrices = document.querySelectorAll('.yearly-price');
    const billingPeriods = document.querySelectorAll('.billing-period');

    pricingToggle.addEventListener('change', function () {
        if (this.checked) {
            // Yearly pricing
            monthlyPrices.forEach(el => el.classList.add('hidden'));
            yearlyPrices.forEach(el => el.classList.remove('hidden'));
            billingPeriods.forEach(el => el.textContent = '/yearly');
        } else {
            // Monthly pricing
            monthlyPrices.forEach(el => el.classList.remove('hidden'));
            yearlyPrices.forEach(el => el.classList.add('hidden'));
            billingPeriods.forEach(el => el.textContent = '/monthly');
        }
    });



    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Function to animate counter
    function animateCounter(element, target) {
        let current = 0;
        const increment = target > 100 ? Math.ceil(target / 100) : 1;
        const duration = 2000; // 2 seconds
        const steps = 60;
        const stepTime = duration / steps;

        // Handle special formatting for numbers with M or k
        let suffix = '';
        let targetNum = target;

        if (element.textContent.includes('M')) {
            suffix = 'M';
            targetNum = parseInt(target);
        } else if (element.textContent.includes('k')) {
            suffix = 'k';
            targetNum = parseInt(target);
        }

        const timer = setInterval(() => {
            current += increment;

            if (current >= targetNum) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = current + suffix;
            }
        }, stepTime);
    }

    // Get all stat counters
    const counters = document.querySelectorAll('.stats-counter');

    // Set initial data attribute with the target number
    counters.forEach(counter => {
        const target = counter.textContent;
        counter.setAttribute('data-target', target);
        counter.textContent = '0';
    });

    // Function to start animation when scrolled into view
    function handleScroll() {
        counters.forEach(counter => {
            if (isInViewport(counter) && counter.textContent === '0') {
                const target = counter.getAttribute('data-target');
                animateCounter(counter, target);
            }
        });
    }

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);

    // Check on initial load
    handleScroll();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            if (this.getAttribute('href') === '#') return;

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
});

// Lazy Loading Images
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Set the src attribute if it's not already loaded
                    if (img.getAttribute('data-loaded') !== 'true') {
                        // Store original src temporarily if needed
                        const originalSrc = img.getAttribute('src');
                        
                        // Apply loading animation or placeholder if needed
                        img.classList.add('loading');
                        
                        // Create a new image to preload
                        const tempImg = new Image();
                        tempImg.onload = function() {
                            // Once loaded, update the visible image
                            img.src = originalSrc;
                            img.classList.remove('loading');
                            img.classList.add('loaded');
                            img.setAttribute('data-loaded', 'true');
                        };
                        
                        // Start loading
                        tempImg.src = originalSrc;
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.01
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        let lazyLoadThrottleTimeout;
        
        function lazyLoadFallback() {
            if (lazyLoadThrottleTimeout) {
                clearTimeout(lazyLoadThrottleTimeout);
            }
            
            lazyLoadThrottleTimeout = setTimeout(() => {
                const scrollTop = window.pageYOffset;
                
                lazyImages.forEach(img => {
                    if (img.getBoundingClientRect().top < window.innerHeight + scrollTop + 100 && 
                        img.getAttribute('data-loaded') !== 'true') {
                        
                        img.classList.add('loaded');
                        img.setAttribute('data-loaded', 'true');
                    }
                });
                
                if (lazyImages.length === 0) {
                    document.removeEventListener('scroll', lazyLoadFallback);
                    window.removeEventListener('resize', lazyLoadFallback);
                    window.removeEventListener('orientationChange', lazyLoadFallback);
                }
            }, 20);
        }
        
        document.addEventListener('scroll', lazyLoadFallback);
        window.addEventListener('resize', lazyLoadFallback);
        window.addEventListener('orientationChange', lazyLoadFallback);
        lazyLoadFallback();
    }
}

// Initialize lazy loading when DOM is loaded
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Reinitialize lazy loading after slider updates
function reinitializeLazyLoading() {
    // Small delay to ensure DOM is updated
    setTimeout(lazyLoadImages, 100);
}