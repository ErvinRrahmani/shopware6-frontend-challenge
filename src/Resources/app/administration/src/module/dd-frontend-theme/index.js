import './page/dd-frontend-theme-list';
import './page/dd-frontend-theme-detail';
import './component/dd-banner-slider-config';
import './component/dd-banner-slider-element';
import './component/dd-category-grid-config';
import './component/dd-filter-offcanvas-config';

Shopware.Module.register('dd-frontend-theme', {
    type: 'plugin',
    name: 'DdFrontendTheme',
    title: 'Dutchdrops Frontend Theme',
    description: 'Custom frontend theme with advanced features',
    version: '1.0.0',
    targetVersion: '6.7.0',
    color: '#0b6cfb',
    icon: 'regular-cog',
    
    snippets: {
        'de-DE': './snippet/de-DE.json',
        'en-GB': './snippet/en-GB.json'
    }
});
