/**
 * SliderCarousel - A reusable OOP slider class
 * Can be used for any slider element by initializing with the container selector
 */
class movCarousel {
    constructor(options) {
        // Default options
        this.defaults = {
            containerSelector: '.slider-container',
            trackSelector: '.slider-track',
            slideSelector: '.slider-slide',
            nextBtnSelector: '.slider-next',
            prevBtnSelector: '.slider-prev',
            dotsContainerSelector: '.slider-dots',
            slidesToShow: 1,
            breakpoints: {
                768: 2,
                1024: 3
            },
            autoplay: true,
            autoplaySpeed: 5000,
            infinite: true,
            center: true,
            touchEnabled: true,
            dotsColors: {
                active: 'bg-accent',
                inactive: 'bg-white/30',
                hover: 'hover:bg-white/50'
            }
        };

        // Merge provided options with defaults
        this.options = { ...this.defaults, ...options };

        // DOM elements
        this.container = document.querySelector(this.options.containerSelector);
        if (!this.container) {
            console.error(`Slider container ${this.options.containerSelector} not found`);
            return;
        }

        this.track = this.container.querySelector(this.options.trackSelector);
        this.slides = this.container.querySelectorAll(this.options.slideSelector);
        
        // Look for navigation buttons in document first, then in container
        this.nextBtn = document.querySelector(this.options.nextBtnSelector) || 
                      this.container.querySelector(this.options.nextBtnSelector);
        this.prevBtn = document.querySelector(this.options.prevBtnSelector) || 
                      this.container.querySelector(this.options.prevBtnSelector);
        
        this.dotsContainer = document.querySelector(this.options.dotsContainerSelector);

        // Calculate slidesToShow based on current screen width and breakpoints
        this.calculateSlidesToShow();

        // State variables
        this.currentIndex = this.options.infinite ? 1 : 0;
        this.totalSlides = this.slides.length;
        this.slideWidth = 100 / this.options.slidesToShow;
        this.autoplayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;

        // Initialize the slider
        this.init();
    }

    // Calculate slidesToShow based on breakpoints
    calculateSlidesToShow() {
        // Start with the base slidesToShow value
        let currentSlidesToShow = this.options.slidesToShow;
        
        // Check if breakpoints are defined
        if (this.options.breakpoints) {
            // Sort breakpoints in ascending order
            const breakpoints = Object.keys(this.options.breakpoints)
                .map(Number)
                .sort((a, b) => a - b);
            
            // Find the appropriate breakpoint for current window width
            for (const breakpoint of breakpoints) {
                if (window.innerWidth >= breakpoint) {
                    currentSlidesToShow = this.options.breakpoints[breakpoint];
                }
            }
        }
        
        this.options.slidesToShow = currentSlidesToShow;
    }

    init() {
        // Hide the track initially to prevent FOUC (Flash of Unstyled Content)
        this.track.style.opacity = '0';
        
        // Set up infinite slider if enabled
        if (this.options.infinite) {
            this.setupInfiniteSlider();
        }

        // Set initial slide widths
        this.setSlideWidths();

        // Create navigation buttons if they don't exist
        this.createNavigationIfNeeded();

        // Generate pagination dots
        if (this.dotsContainer) {
            this.generateDots();
        }

        // Add event listeners
        this.addEventListeners();

        // Set initial position without transition
        this.updatePosition(false);

        // Show the track after initial setup with a slight delay
        setTimeout(() => {
            this.track.style.opacity = '1';
            this.track.style.transition = 'opacity 0.3s ease-in-out';
        }, 50);

        // Start autoplay if enabled
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }

    setupInfiniteSlider() {
        // Clone multiple slides for smoother infinite scrolling
        const slidesToClone = Math.min(this.totalSlides, 2);
        
        // Clone first slides and add to end
        for (let i = 0; i < slidesToClone; i++) {
            const clone = this.slides[i].cloneNode(true);
            clone.classList.add('clone', 'clone-end');
            this.track.appendChild(clone);
        }
        
        // Clone last slides and add to beginning
        for (let i = this.totalSlides - 1; i >= Math.max(0, this.totalSlides - slidesToClone); i--) {
            const clone = this.slides[i].cloneNode(true);
            clone.classList.add('clone', 'clone-start');
            this.track.insertBefore(clone, this.track.firstChild);
        }
        
        // Update slides collection after adding clones
        this.slides = this.container.querySelectorAll(this.options.slideSelector);
        
        // Update total slides count including clones
        this.totalSlidesWithClones = this.slides.length;
        this.cloneOffset = slidesToClone;
    }

    createNavigationIfNeeded() {
        // Check if next button exists
        if (!this.nextBtn) {
            // Create next button
            this.nextBtn = document.createElement('button');
            this.nextBtn.className = 'slider-auto-next absolute top-1/2 -right-10 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-accent transition-all duration-300 focus:outline-none';
            this.nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            
            // Position the button relative to the container
            this.container.style.position = this.container.style.position || 'relative';
            
            // Append to parent of container to ensure proper positioning
            this.container.parentNode.appendChild(this.nextBtn);
        }
        
        // Check if prev button exists
        if (!this.prevBtn) {
            // Create prev button
            this.prevBtn = document.createElement('button');
            this.prevBtn.className = 'slider-auto-prev absolute top-1/2 -left-10 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-accent transition-all duration-300 focus:outline-none';
            this.prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            
            // Position the button relative to the container
            this.container.style.position = this.container.style.position || 'relative';
            
            // Append to parent of container to ensure proper positioning
            this.container.parentNode.appendChild(this.prevBtn);
        }
    }

    setSlideWidths() {
        this.slides.forEach(slide => {
            slide.style.width = `${this.slideWidth}%`;
        });
    }

    generateDots() {
        // Clear existing dots
        this.dotsContainer.innerHTML = '';
        
        // Calculate how many dots we need
        const dotsCount = this.options.infinite ? this.totalSlides : this.totalSlides - this.options.slidesToShow + 1;
        
        // Create dots
        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('button');
            dot.classList.add('w-3', 'h-3', 'rounded-full', 'transition-colors', 'duration-300');
            
            // Set active state for first dot using custom colors
            if (i === 0) {
                dot.classList.add(this.options.dotsColors.active);
            } else {
                dot.classList.add(this.options.dotsColors.inactive);
                if (this.options.dotsColors.hover) {
                    dot.classList.add(this.options.dotsColors.hover);
                }
            }
            
            dot.setAttribute('data-index', i);
            dot.addEventListener('click', () => {
                this.goToSlide(this.options.infinite ? i + 1 : i);
            });
            
            this.dotsContainer.appendChild(dot);
        }
    }

    addEventListeners() {
        // Navigation buttons
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Handle transition end for infinite effect
        if (this.options.infinite) {
            this.track.addEventListener('transitionend', () => this.handleTransitionEnd());
        }
        
        // Add touch support
        if (this.options.touchEnabled) {
            this.track.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
                if (this.options.autoplay) this.stopAutoplay();
            }, { passive: true });
            
            this.track.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
                if (this.options.autoplay) this.startAutoplay();
            }, { passive: true });
        }
        
        // Pause autoplay on hover
        if (this.options.autoplay) {
            this.container.addEventListener('mouseenter', () => this.stopAutoplay());
            this.container.addEventListener('mouseleave', () => this.startAutoplay());
        }
    }

    updatePosition(withTransition = true) {
        if (withTransition) {
            this.track.style.transition = 'transform 0.5s ease-in-out';
        } else {
            this.track.style.transition = 'none';
        }
        
        const offset = -this.currentIndex * this.slideWidth;
        this.track.style.transform = `translateX(${offset}%)`;
        
        // Update active dot with custom colors
        if (this.dotsContainer) {
            // Calculate the actual slide index (accounting for clones)
            let actualIndex = this.currentIndex;
            if (this.options.infinite) {
                actualIndex = (this.currentIndex - this.cloneOffset + this.totalSlides) % this.totalSlides;
            }
                
            const dots = this.dotsContainer.querySelectorAll('button');
            dots.forEach((dot, index) => {
                if (index === actualIndex) {
                    dot.classList.add(this.options.dotsColors.active);
                    dot.classList.remove(this.options.dotsColors.inactive);
                    if (this.options.dotsColors.hover) {
                        dot.classList.remove(this.options.dotsColors.hover);
                    }
                } else {
                    dot.classList.remove(this.options.dotsColors.active);
                    dot.classList.add(this.options.dotsColors.inactive);
                    if (this.options.dotsColors.hover) {
                        dot.classList.add(this.options.dotsColors.hover);
                    }
                }
            });
        }
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updatePosition();
    }

    nextSlide() {
        if (this.options.infinite) {
            this.currentIndex++;
        } else {
            this.currentIndex = Math.min(this.currentIndex + 1, this.totalSlides - this.options.slidesToShow);
        }
        this.updatePosition();
    }

    prevSlide() {
        if (this.options.infinite) {
            this.currentIndex--;
        } else {
            this.currentIndex = Math.max(this.currentIndex - 1, 0);
        }
        this.updatePosition();
    }

    handleTransitionEnd() {
        // If we've moved past the end, jump to the beginning (clone)
        if (this.currentIndex >= this.totalSlides + this.cloneOffset) {
            this.currentIndex = this.cloneOffset;
            this.updatePosition(false);
        }
        // If we've moved before the beginning, jump to the end (clone)
        else if (this.currentIndex < this.cloneOffset) {
            this.currentIndex = this.totalSlides + this.cloneOffset - 1;
            this.updatePosition(false);
        }
    }

    handleResize() {
        // Store previous slidesToShow value
        const previousSlidesToShow = this.options.slidesToShow;
        
        // Recalculate slidesToShow based on new window width
        this.calculateSlidesToShow();
        
        // Only update if slidesToShow has changed
        if (previousSlidesToShow !== this.options.slidesToShow) {
            // Recalculate slideWidth
            this.slideWidth = 100 / this.options.slidesToShow;
            
            // Update slide widths
            this.setSlideWidths();
            
            // Ensure currentIndex is valid with new slidesToShow
            if (!this.options.infinite) {
                this.currentIndex = Math.min(this.currentIndex, this.totalSlides - this.options.slidesToShow);
            }
            
            // Update slider position
            this.updatePosition(false);
        }
    }

    handleSwipe() {
        const swipeThreshold = 50;
        if (this.touchEndX < this.touchStartX - swipeThreshold) {
            // Swipe left - next slide
            this.nextSlide();
        } else if (this.touchEndX > this.touchStartX + swipeThreshold) {
            // Swipe right - previous slide
            this.prevSlide();
        }
    }

    startAutoplay() {
        this.stopAutoplay(); // Clear any existing interval
        this.autoplayInterval = setInterval(() => this.nextSlide(), this.options.autoplaySpeed);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }

    // Public method to destroy the slider
    destroy() {
        // Stop autoplay
        this.stopAutoplay();
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        
        // Remove auto-created buttons if they exist
        if (this.nextBtn && this.nextBtn.classList.contains('slider-auto-next')) {
            this.nextBtn.remove();
        }
        
        if (this.prevBtn && this.prevBtn.classList.contains('slider-auto-prev')) {
            this.prevBtn.remove();
        }
        
        // Remove clones if infinite
        if (this.options.infinite) {
            const clones = this.container.querySelectorAll('.clone');
            clones.forEach(clone => clone.remove());
        }
        
        // Reset styles
        this.track.style.transform = '';
        this.track.style.transition = '';
        this.track.style.opacity = '';
        this.slides.forEach(slide => {
            slide.style.width = '';
        });
    }
}