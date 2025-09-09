import template from './dd-banner-slider-config.html.twig';

Shopware.Component.register('dd-banner-slider-config', {
    template,
    
    props: {
        element: {
            type: Object,
            required: true
        }
    },
    
    data() {
        return {
            slides: this.element.config?.slides?.value || [
                { image: '', title: '', description: '' },
                { image: '', title: '', description: '' },
                { image: '', title: '', description: '' }
            ]
        };
    },
    
    methods: {
        addSlide() {
            this.slides.push({ image: '', title: '', description: '' });
            this.updateElement();
        },
        
        removeSlide(index) {
            this.slides.splice(index, 1);
            this.updateElement();
        },
        
        updateSlide(index, field, value) {
            this.slides[index][field] = value;
            this.updateElement();
        },
        
        updateElement() {
            this.element.config.slides.value = this.slides;
        }
    }
});
