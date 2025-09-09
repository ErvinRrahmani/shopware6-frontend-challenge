import template from './dd-frontend-theme-list.html.twig';

Shopware.Component.register('dd-frontend-theme-list', {
    template,
    
    data() {
        return {
            isLoading: false
        };
    }
});
