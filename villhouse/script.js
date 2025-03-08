

// Back to Top Button
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.remove('opacity-0', 'invisible');
        backToTopBtn.classList.add('opacity-100', 'visible');
    } else {
        backToTopBtn.classList.add('opacity-0', 'invisible');
        backToTopBtn.classList.remove('opacity-100', 'visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenuDropdown = document.getElementById('mobile-menu-dropdown');

menuToggle.addEventListener('click', () => {
    if (mobileMenuDropdown.classList.contains('hidden')) {
        mobileMenuDropdown.classList.remove('hidden');
        setTimeout(() => {
            mobileMenuDropdown.classList.add('max-h-96');
        }, 10);
    } else {
        mobileMenuDropdown.classList.remove('max-h-96');
        setTimeout(() => {
            mobileMenuDropdown.classList.add('hidden');
        }, 300);
    }
});

// Shrink navbar on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('py-3');
        // navbar.classList.remove('py-4');
    } else {
        // navbar.classList.add('py-4');
        navbar.classList.remove('py-3');
    }
});

// Counter animation
const counters = document.querySelectorAll('.counter');
const speed = 200; // The lower the slower

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'));
            let count = 0;
            const updateCount = () => {
                const increment = target / speed;
                if (count < target) {
                    count += increment;
                    counter.innerText = Math.ceil(count);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
            observer.unobserve(counter);
        }
    });
}, observerOptions);

counters.forEach(counter => {
    observer.observe(counter);
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

// Select all links with hash (#) in href attribute
const scrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Prevent default anchor click behavior
        e.preventDefault();
        
        // Get the target element from the href attribute
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        // If target element exists
        if (targetElement) {
            // Get the target's position relative to the viewport
            const targetPosition = targetElement.getBoundingClientRect().top;
            // Get the current scroll position
            const startPosition = window.pageYOffset;
            // Calculate distance to scroll (with offset for navbar)
            const navbarHeight = document.getElementById('navbar').offsetHeight;
            const offset = targetPosition - navbarHeight;
            
            // Smooth scroll to target
            window.scrollTo({
                top: startPosition + offset,
                behavior: 'smooth'
            });
            
            // If mobile menu is open, close it after clicking
            if (!mobileMenuDropdown.classList.contains('hidden')) {
                mobileMenuDropdown.classList.remove('max-h-96');
                setTimeout(() => {
                    mobileMenuDropdown.classList.add('hidden');
                }, 300);
            }
        }
    });
});
