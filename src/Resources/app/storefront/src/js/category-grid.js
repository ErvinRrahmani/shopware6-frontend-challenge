class DdCategoryGrid {
	constructor(element, options = {}) {
		this.element = element;
		this.options = {
			enableAnimations: true,
			enableHoverEffects: true,
			enableLazyLoading: true,
			...options
		};
		
		this.init();
	}
	
	init() {
		this.setupGridLayout();
		this.setupProductBoxes();
		this.setupPagination();
		this.setupLazyLoading();
		this.setupAnimations();
		
		document.body.classList.add('dd-frontend-theme');
	}
	
	setupGridLayout() {
		const productListing = this.element.querySelector('.product-listing');
		if (!productListing) return;
		
		productListing.classList.add('dd-category-grid');
		
		const firstProduct = productListing.querySelector('.product-box');
		if (firstProduct) {
			firstProduct.classList.add('featured');
		}
	}
	
	setupProductBoxes() {
		const productBoxes = this.element.querySelectorAll('.product-box');
		
		productBoxes.forEach((box, index) => {
			if (this.options.enableAnimations) {
				box.classList.add('card-animate', 'will-animate');
				box.style.animationDelay = `${index * 0.1}s`;
			}
			
			if (this.options.enableHoverEffects) {
				box.classList.add('hover-lift', 'hover-glow');
			}
			
			this.setupProductActions(box);
			
			this.setupImageAnimations(box);
		});
	}
	
	setupProductActions(box) {
		const wishlistBtn = box.querySelector('.wishlist-btn, .btn-wishlist');
		const addToCartBtn = box.querySelector('.add-to-cart-btn, .btn-add-to-cart');
		
		if (wishlistBtn) {
			wishlistBtn.classList.add('btn-animate');
			wishlistBtn.addEventListener('click', (e) => {
				e.preventDefault();
				this.toggleWishlist(wishlistBtn);
			});
		}
		
		if (addToCartBtn) {
			addToCartBtn.classList.add('btn-animate');
			addToCartBtn.addEventListener('click', (e) => {
				e.preventDefault();
				this.addToCart(addToCartBtn);
			});
		}
	}
	
	setupImageAnimations(box) {
		const image = box.querySelector('.product-image img');
		if (image) {
			image.parentElement.classList.add('image-animate');
		}
	}
	
	setupPagination() {
		const pagination = this.element.querySelector('.pagination');
		if (!pagination) return;
		
		const pageLinks = pagination.querySelectorAll('.page-link');
		
		pageLinks.forEach(link => {
			link.classList.add('focus-animate');
			
			link.addEventListener('click', (e) => {
				e.preventDefault();
				this.handlePageChange(link);
			});
		});
	}
	
	setupLazyLoading() {
		if (!this.options.enableLazyLoading) return;
		
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
	
	setupAnimations() {
		if (!this.options.enableAnimations) return;
		
		const productListing = this.element.querySelector('.product-listing');
		if (productListing) {
			productListing.classList.add('stagger-animate');
		}
		
		this.element.classList.add('page-transition');
		
		setTimeout(() => {
			this.element.classList.add('loaded');
		}, 100);
	}
	
	toggleWishlist(button) {
		const isActive = button.classList.contains('active');
		
		if (isActive) {
			button.classList.remove('active');
			button.innerHTML = '<i class="far fa-heart"></i>';
		} else {
			button.classList.add('active');
			button.innerHTML = '<i class="fas fa-heart"></i>';
		}
		
		button.classList.add('animate-bounce');
		setTimeout(() => {
			button.classList.remove('animate-bounce');
		}, 1000);
	}
	
	addToCart(button) {
		const originalText = button.textContent;
		
		button.textContent = 'Adding...';
		button.disabled = true;
		
		setTimeout(() => {
			button.textContent = 'Added!';
			button.classList.add('animate-pulse');
			
			setTimeout(() => {
				button.textContent = originalText;
				button.disabled = false;
				button.classList.remove('animate-pulse');
			}, 2000);
		}, 1000);
	}
	
	handlePageChange(link) {
		const page = link.dataset.page || link.textContent;
		
		this.element.classList.add('loading');
		
		setTimeout(() => {
			this.element.classList.remove('loading');
			
			const activeLink = this.element.querySelector('.page-link.active');
			if (activeLink) {
				activeLink.classList.remove('active');
			}
			link.classList.add('active');
			
			this.element.scrollIntoView({ behavior: 'smooth' });
		}, 500);
	}
	
	refreshGrid() {
		this.setupProductBoxes();
		this.setupAnimations();
	}
	
	updateGridLayout(columns) {
		const productListing = this.element.querySelector('.product-listing');
		if (productListing) {
			productListing.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
		}
	}
	
	showLoadingState() {
		this.element.classList.add('loading');
	}
	
	hideLoadingState() {
		this.element.classList.remove('loading');
	}
	
	destroy() {
		if (this.intersectionObserver) {
			this.intersectionObserver.disconnect();
		}
		
		const productBoxes = this.element.querySelectorAll('.product-box');
		productBoxes.forEach(box => {
			const newBox = box.cloneNode(true);
			box.parentNode.replaceChild(newBox, box);
		});
		
		document.body.classList.remove('dd-frontend-theme');
		
		if (this.animationTimer) {
			clearTimeout(this.animationTimer);
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const grids = document.querySelectorAll('.product-listing, .category-listing');
	grids.forEach(grid => {
		new DdCategoryGrid(grid);
	});
});

if (typeof module !== 'undefined' && module.exports) {
	module.exports = DdCategoryGrid;
}
