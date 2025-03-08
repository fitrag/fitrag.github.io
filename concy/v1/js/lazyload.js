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
