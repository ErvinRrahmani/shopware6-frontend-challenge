import template from './dd-frontend-theme-detail.html.twig';

Shopware.Component.register('dd-frontend-theme-detail', {
    template,
    
    data() {
        return {
            theme: null,
            isLoading: false
        };
    }
});
