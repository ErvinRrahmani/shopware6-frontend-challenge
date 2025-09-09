import template from './dd-filter-offcanvas-config.html.twig';

Shopware.Component.register('dd-filter-offcanvas-config', {
    template,
    
    props: {
        element: {
            type: Object,
            required: true
        }
    }
});
