import template from './dd-banner-slider-element.html.twig';

Shopware.Component.register('dd-banner-slider-element', {
    template,
    
    props: {
        element: {
            type: Object,
            required: true
        }
    },
    
    computed: {
        slides() {
            return this.element.config?.slides?.value || [];
        }
    }
});
