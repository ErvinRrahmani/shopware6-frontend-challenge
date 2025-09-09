class DdBannerSlider {
	constructor(element, options = {}) {
		this.element = element;
		this.options = {
			autoplay: true,
			autoplaySpeed: 5000,
			showArrows: true,
			showDots: true,
			touchEnabled: true,
			...options
		};
		
		this.currentSlide = 0;
		this.slides = [];
		this.autoplayInterval = null;
		this.isAnimating = false;
		
		this.init();
	}
	
	init() {
		this.setupSlides();
		this.setupNavigation();
		this.setupControls();
		this.setupTouchSupport();
		this.setupLazyLoading();
		this.showSlide(0);
		
		if (this.options.autoplay) {
			this.startAutoplay();
		}
		
		document.body.classList.add('dd-frontend-theme');
	}
	
	setupSlides() {
		this.slides = Array.from(this.element.querySelectorAll('.slide'));
		
		if (this.slides.length === 0) {
			console.warn('No slides found for banner slider');
			return;
		}
		

		this.slides.forEach((slide, index) => {
			slide.dataset.slideIndex = index;
			slide.classList.add('will-animate');
		});
	}
	
	setupNavigation() {
		if (!this.options.showDots) return;
		
		const navContainer = this.element.querySelector('.slider-nav');
		if (!navContainer) return;
		

		navContainer.innerHTML = '';
		

		this.slides.forEach((_, index) => {
			const dot = document.createElement('div');
			dot.className = 'nav-dot';
			dot.dataset.slideIndex = index;
			dot.addEventListener('click', () => this.goToSlide(index));
			navContainer.appendChild(dot);
		});
	}
	
	setupControls() {
		if (!this.options.showArrows) return;
		
		const prevBtn = this.element.querySelector('.prev-btn');
		const nextBtn = this.element.querySelector('.next-btn');
		
		if (prevBtn) {
			prevBtn.addEventListener('click', () => this.previousSlide());
		}
		
		if (nextBtn) {
			nextBtn.addEventListener('click', () => this.nextSlide());
		}
	}
	
	setupTouchSupport() {
		if (!this.options.touchEnabled) return;
		
		let startX = 0;
		let startY = 0;
		let isDragging = false;
		
		this.element.addEventListener('touchstart', (e) => {
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
			isDragging = true;
		});
		
		this.element.addEventListener('touchmove', (e) => {
			if (!isDragging) return;
			
			const currentX = e.touches[0].clientX;
			const currentY = e.touches[0].clientY;
			const diffX = startX - currentX;
			const diffY = startY - currentY;
			
			if (Math.abs(diffX) > Math.abs(diffY)) {
				e.preventDefault();
			}
		});
		
		this.element.addEventListener('touchend', (e) => {
			if (!isDragging) return;
			
			const endX = e.changedTouches[0].clientX;
			const diffX = startX - endX;
			const threshold = 50;
			
			if (Math.abs(diffX) > threshold) {
				if (diffX > 0) {
					this.nextSlide();
				} else {
					this.previousSlide();
				}
			}
			
			isDragging = false;
		});
	}
	
	setupLazyLoading() {
		const images = this.element.querySelectorAll('img[data-src]');
		
		const imageObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const img = entry.target;
					img.src = img.dataset.src;
					img.classList.add('loaded');
					imageObserver.unobserve(img);
				}
			});
		});
		
		images.forEach(img => imageObserver.observe(img));
	}
	
	showSlide(index) {
		if (this.isAnimating || index === this.currentSlide) return;
		
		this.isAnimating = true;
		
		const currentSlide = this.slides[this.currentSlide];
		if (currentSlide) {
			currentSlide.classList.remove('active');
			this.animateSlideOut(currentSlide);
		}
		
		const newSlide = this.slides[index];
		if (newSlide) {
			newSlide.classList.add('active');
			this.animateSlideIn(newSlide);
		}
		
		this.updateNavigation(index);
		
		this.currentSlide = index;
		
		if (this.options.autoplay) {
			this.resetAutoplay();
		}
		
		setTimeout(() => {
			this.isAnimating = false;
		}, 600);
	}
	
	animateSlideIn(slide) {
		const title = slide.querySelector('.slide-title');
		const description = slide.querySelector('.slide-description');
		
		if (title) {
			setTimeout(() => title.classList.add('animate'), 100);
		}
		
		if (description) {
			setTimeout(() => description.classList.add('animate'), 200);
		}
	}
	
	animateSlideOut(slide) {
		const title = slide.querySelector('.slide-title');
		const description = slide.querySelector('.slide-description');
		
		if (title) title.classList.remove('animate');
		if (description) description.classList.remove('animate');
	}
	
	updateNavigation(index) {
		const dots = this.element.querySelectorAll('.nav-dot');
		dots.forEach((dot, i) => {
			dot.classList.toggle('active', i === index);
		});
	}
	
	nextSlide() {
		const nextIndex = (this.currentSlide + 1) % this.slides.length;
		this.showSlide(nextIndex);
	}
	
	previousSlide() {
		const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
		this.showSlide(prevIndex);
	}
	
	goToSlide(index) {
		if (index >= 0 && index < this.slides.length) {
			this.showSlide(index);
		}
	}
	
	startAutoplay() {
		this.autoplayInterval = setInterval(() => {
			this.nextSlide();
		}, this.options.autoplaySpeed);
	}
	
	stopAutoplay() {
		if (this.autoplayInterval) {
			clearInterval(this.autoplayInterval);
			this.autoplayInterval = null;
		}
	}
	
	resetAutoplay() {
		this.stopAutoplay();
		this.startAutoplay();
	}
	
	destroy() {
		this.stopAutoplay();
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const sliders = document.querySelectorAll('.dd-banner-slider');
	sliders.forEach(slider => {
		new DdBannerSlider(slider);
	});
});

if (typeof module !== 'undefined' && module.exports) {
	module.exports = DdBannerSlider;
}
