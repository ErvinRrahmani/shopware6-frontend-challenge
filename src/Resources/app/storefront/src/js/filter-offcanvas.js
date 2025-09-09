class DdFilterOffcanvas {
	constructor(element, options = {}) {
		this.element = element;
		this.options = {
			enableAnimations: true,
			enableKeyboardSupport: true,
			enableTouchGestures: true,
			...options
		};
		
		this.isOpen = false;
		this.activeFilters = new Set();
		this.filterValues = {};
		
		this.init();
	}
	
	init() {
		this.createOffcanvasStructure();
		this.setupFilterTrigger();
		this.setupOffcanvasEvents();
		this.setupFilterGroups();
		this.setupKeyboardSupport();
		this.setupTouchGestures();
		
		document.body.classList.add('dd-frontend-theme');
	}
	
	createOffcanvasStructure() {
		const offcanvasHTML = `
			<div class="offcanvas-overlay"></div>
			<div class="offcanvas-panel">
				<div class="offcanvas-header">
					<h3 class="offcanvas-title">Filters</h3>
					<button class="close-btn" aria-label="Close filters">&times;</button>
				</div>
				<div class="offcanvas-body">
					<div class="filter-groups">
						<!-- Filter groups will be populated here -->
					</div>
					<div class="filter-actions">
						<button class="btn apply-filters">Apply Filters</button>
						<button class="btn clear-filters">Clear All</button>
					</div>
				</div>
			</div>
		`;
		
		this.element.insertAdjacentHTML('beforeend', offcanvasHTML);
		
		this.overlay = this.element.querySelector('.offcanvas-overlay');
		this.panel = this.element.querySelector('.offcanvas-panel');
		this.closeBtn = this.element.querySelector('.close-btn');
		this.applyBtn = this.element.querySelector('.apply-filters');
		this.clearBtn = this.element.querySelector('.clear-filters');
		this.filterGroupsContainer = this.element.querySelector('.filter-groups');
	}
	
	setupFilterTrigger() {
		let trigger = this.element.querySelector('.filter-trigger');
		
		if (!trigger) {
			trigger = document.createElement('button');
			trigger.className = 'filter-trigger';
			trigger.innerHTML = `
				<span class="filter-icon">🔍</span>
				<span class="filter-text">Filters</span>
				<span class="filter-count">0</span>
			`;
			this.element.insertBefore(trigger, this.element.firstChild);
		}
		
		trigger.addEventListener('click', () => this.openOffcanvas());
		this.trigger = trigger;
	}
	
	setupOffcanvasEvents() {
		this.closeBtn.addEventListener('click', () => this.closeOffcanvas());
		this.overlay.addEventListener('click', () => this.closeOffcanvas());
		this.applyBtn.addEventListener('click', () => this.applyFilters());
		this.clearBtn.addEventListener('click', () => this.clearAllFilters());
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && this.isOpen) {
				this.closeOffcanvas();
			}
		});
	}
	
	setupFilterGroups() {
		const existingFilters = this.element.querySelectorAll('.filter-group, .filter, [data-filter]');
		
		if (existingFilters.length > 0) {
			existingFilters.forEach(filter => {
				this.moveFilterToOffcanvas(filter);
			});
		} else {
			this.createSampleFilterGroups();
		}
		
		this.updateFilterCount();
	}
	
	moveFilterToOffcanvas(filter) {
		const clonedFilter = filter.cloneNode(true);
		const filterGroup = this.createFilterGroup(clonedFilter);
		
		this.filterGroupsContainer.appendChild(filterGroup);
		filter.style.display = 'none';
		this.setupFilterEvents(clonedFilter);
	}
	
	createFilterGroup(filter) {
		const group = document.createElement('div');
		group.className = 'filter-group';
		
		const title = filter.dataset.title || filter.querySelector('label')?.textContent || 'Filter';
		
		group.innerHTML = `
			<h4 class="filter-group-title">${title}</h4>
			<div class="filter-options">
				${filter.outerHTML}
			</div>
		`;
		
		return group;
	}
	
	createSampleFilterGroups() {
		const sampleFilters = [
			{
				title: 'Category',
				type: 'checkbox',
				options: ['Electronics', 'Clothing', 'Home & Garden', 'Sports']
			},
			{
				title: 'Brand',
				type: 'checkbox',
				options: ['Apple', 'Samsung', 'Nike', 'Adidas']
			},
			{
				title: 'Price Range',
				type: 'range',
				min: 0,
				max: 1000
			},
			{
				title: 'Rating',
				type: 'radio',
				options: ['4+ Stars', '3+ Stars', '2+ Stars', '1+ Star']
			}
		];
		
		sampleFilters.forEach(filterData => {
			const filterGroup = this.createSampleFilterGroup(filterData);
			this.filterGroupsContainer.appendChild(filterGroup);
		});
	}
	
	createSampleFilterGroup(filterData) {
		const group = document.createElement('div');
		group.className = 'filter-group';
		
		let optionsHTML = '';
		
		if (filterData.type === 'range') {
			optionsHTML = `
				<div class="range-slider">
					<div class="range-inputs">
						<div class="range-input">
							<label>Min</label>
							<input type="number" min="${filterData.min}" max="${filterData.max}" value="${filterData.min}">
						</div>
						<div class="range-input">
							<label>Max</label>
							<input type="number" min="${filterData.min}" max="${filterData.max}" value="${filterData.max}">
						</div>
					</div>
					<div class="range-track">
						<div class="range-fill"></div>
						<div class="range-handle"></div>
					</div>
				</div>
			`;
		} else {
			filterData.options.forEach(option => {
				const id = `filter-${Math.random().toString(36).substr(2, 9)}`;
				optionsHTML += `
					<div class="filter-option">
						<input type="${filterData.type}" id="${id}" name="filter-${filterData.title.toLowerCase()}" value="${option}">
						<label for="${id}">${option}</label>
						<span class="option-count">42</span>
					</div>
				`;
			});
		}
		
		group.innerHTML = `
			<h4 class="filter-group-title">${filterData.title}</h4>
			<div class="filter-options">
				${optionsHTML}
			</div>
		`;
		
		return group;
	}
	
	setupFilterEvents(filter) {
		const inputs = filter.querySelectorAll('input[type="checkbox"], input[type="radio"]');
		
		inputs.forEach(input => {
			input.addEventListener('change', () => {
				this.handleFilterChange(input);
			});
		});
	}
	
	handleFilterChange(input) {
		const filterKey = input.name;
		const filterValue = input.value;
		const isChecked = input.checked;
		
		if (isChecked) {
			this.activeFilters.add(filterKey);
			if (!this.filterValues[filterKey]) {
				this.filterValues[filterKey] = [];
			}
			this.filterValues[filterKey].push(filterValue);
		} else {
			this.filterValues[filterKey] = this.filterValues[filterKey]?.filter(v => v !== filterValue) || [];
			if (this.filterValues[filterKey].length === 0) {
				this.activeFilters.delete(filterKey);
			}
		}
		
		this.updateFilterCount();
	}
	
	setupKeyboardSupport() {
		if (!this.options.enableKeyboardSupport) return;
		
		this.panel.addEventListener('keydown', (e) => {
			if (e.key === 'Tab') {
				const focusableElements = this.panel.querySelectorAll(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
				);
				
				const firstElement = focusableElements[0];
				const lastElement = focusableElements[focusableElements.length - 1];
				
				if (e.shiftKey) {
					if (document.activeElement === firstElement) {
						lastElement.focus();
						e.preventDefault();
					}
				} else {
					if (document.activeElement === lastElement) {
						firstElement.focus();
						e.preventDefault();
					}
				}
			}
		});
	}
	
	setupTouchGestures() {
		if (!this.options.enableTouchGestures) return;
		
		let startX = 0;
		let startY = 0;
		let isDragging = false;
		
		this.panel.addEventListener('touchstart', (e) => {
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
			isDragging = true;
		});
		
		this.panel.addEventListener('touchmove', (e) => {
			if (!isDragging) return;
			
			const currentX = e.touches[0].clientX;
			const diffX = startX - currentX;
			

			if (Math.abs(diffX) > 50) {
				e.preventDefault();
			}
		});
		
		this.panel.addEventListener('touchend', (e) => {
			if (!isDragging) return;
			
			const endX = e.changedTouches[0].clientX;
			const diffX = startX - endX;
			const threshold = 100;
			
			if (diffX > threshold) {
				this.closeOffcanvas();
			}
			
			isDragging = false;
		});
	}
	
	openOffcanvas() {
		if (this.isOpen) return;
		
		this.isOpen = true;
		this.overlay.classList.add('active');
		this.panel.classList.add('active');
		
		const firstFocusable = this.panel.querySelector('button, input, select, textarea');
		if (firstFocusable) {
			firstFocusable.focus();
		}
		
		document.body.style.overflow = 'hidden';
		
		if (this.options.enableAnimations) {
			this.panel.classList.add('animate-slide-in-right');
		}
	}
	
	closeOffcanvas() {
		if (!this.isOpen) return;
		
		this.isOpen = false;
		this.overlay.classList.remove('active');
		this.panel.classList.remove('active');
		
		if (this.options.enableAnimations) {
			this.panel.classList.remove('animate-slide-in-right');
		}
		
		document.body.style.overflow = '';
		this.trigger.focus();
	}
	
	applyFilters() {
		console.log('Applying filters:', this.filterValues);
		this.closeOffcanvas();
		
		const event = new CustomEvent('filtersApplied', {
			detail: { filters: this.filterValues }
		});
		this.element.dispatchEvent(event);
	}
	
	clearAllFilters() {
		this.activeFilters.clear();
		this.filterValues = {};
		
		const inputs = this.panel.querySelectorAll('input[type="checkbox"], input[type="radio"]');
		inputs.forEach(input => {
			input.checked = false;
		});
		
		const rangeInputs = this.panel.querySelectorAll('input[type="number"]');
		rangeInputs.forEach((input, index) => {
			if (index === 0) {
				input.value = input.min || 0;
			} else {
				input.value = input.max || 1000;
			}
		});
		
		this.updateFilterCount();
		
		this.clearBtn.classList.add('animate-bounce');
		setTimeout(() => {
			this.clearBtn.classList.remove('animate-bounce');
		}, 1000);
	}
	
	updateFilterCount() {
		const countElement = this.trigger.querySelector('.filter-count');
		if (countElement) {
			countElement.textContent = this.activeFilters.size;
		}
	}
	
	getActiveFilters() {
		return { ...this.filterValues };
	}
	
	setFilterValue(filterKey, value) {
		this.filterValues[filterKey] = [value];
		this.activeFilters.add(filterKey);
		this.updateFilterCount();
	}
	
	destroy() {
		this.closeOffcanvas();
		document.body.style.overflow = '';
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const filterContainers = document.querySelectorAll('.dd-filter-offcanvas, [data-filter-offcanvas]');
	filterContainers.forEach(container => {
		new DdFilterOffcanvas(container);
	});
});

if (typeof module !== 'undefined' && module.exports) {
	module.exports = DdFilterOffcanvas;
}
