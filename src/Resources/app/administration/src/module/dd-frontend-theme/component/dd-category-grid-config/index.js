import template from './dd-category-grid-config.html.twig';

Shopware.Component.register('dd-category-grid-config', {
    template,
    
    props: {
        element: {
            type: Object,
            required: true
        }
    }
});
