import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
//define variable to be used later to hold html to be used
let html;
//if url points to the home page use this html as the builder for the navigation links
if ((/Rain-Support-Tools\/$/).test(location.pathname)) {
    html = await import('./homeNavTemplate.js').then(module => module.homeNavTemplate);
} else {
    html = await import('./toolNavTemplate.js').then(module => module.toolNavTemplate);
}
/*this creates a new vue app that uses the html from above to build the navigation based on the provided navigation links.
Editing links in the object here updates the navigation across the entire website.
*/
//nav list items are built as follows {name: Display text for link, url: file needing to be directed to when link is clicked, icon: fontawesome classes used for applying icons in navigation}
const app = createApp({
    template: html,
    data() {
        return {
            nav_list : {
                ticket: {
                    title: 'Ticket Tools',
                    show: false,
                    link_data: [
                        {name: 'Bug Ticket v2', url: '/Rain-Support-Tools/src/Tools/bug-ticket/bug-ticket-v2.html', icon: 'fa-solid fa-bug'},
                        {name:'Database', url: '/Rain-Support-Tools/src/Tools/database-ticket/database-ticket.html', icon: 'fa-solid fa-database'},
                        {name:'Site Work', url: '/Rain-Support-Tools/src/Tools/site-work/site-work.html', icon: 'fa-solid fa-hammer'},
                        {name: 'DNS Record Tool', url: '/Rain-Support-Tools/src/Tools/dns-help/dns-help.html', icon: 'fa-regular fa-compass'},
                        {name: 'Image Uploader', url: '/Rain-Support-Tools/src/Tools/share-point/upload.html', icon: 'fa-solid fa-upload'}
                    ]
                },
                system: {
                    title: 'System Tools',
                    show: false,
                    link_data: [
                        {name:'Email List Checker', url: '/Rain-Support-Tools/src/Tools/email-list-checker/email-list-checker.html', icon: 'fa-solid fa-envelope'},
                        {name:'Transaction Calculator', url: '/Rain-Support-Tools/src/Tools/Transaction-Calculator/Javascript_calculator.html', icon: 'fa-solid fa-calculator'},
                        {name:'Transaction Calculator V2', url: '/Rain-Support-Tools/src/Tools/Transaction-Calculator/transaction-calculator.html', icon: 'fa-solid fa-calculator'},
                        {name:'Transaction Calculator',subTitle: '(Tax Inclusive: Australia)', url: '/Rain-Support-Tools/src/Tools/Tax-Included-Calculator/Tax-Inclusive-Calculator.html', icon: 'fa-solid fa-calculator'},
                        {name:'Washington Tax Rate', url: '/Rain-Support-Tools/src/Tools/wa-tax-rates/wa_tax_rates.html', icon: 'fa-solid fa-percent'},
                        {name:'RTO Payments Calculator', url: '/Rain-Support-Tools/src/Tools/rto-payments/rto-payments.html', icon: 'fa-solid fa-truck-moving'},
                        {name:'Fee Difference Calculator', url: '/Rain-Support-Tools/src/Tools/fee-difference-calculator/fee-difference-calculator.html', icon: 'fa-solid fa-money-bill'},
                        {name:'QB Payment Split', url: '/Rain-Support-Tools/src/Tools/QB-Mixed-Split/QB_Mixed_Split.html', icon: 'fa-solid fa-dollar-sign'},
                        {name:'Inventory Check', url: '/Rain-Support-Tools/src/Tools/Inventory-check/Inventory-check.html', icon: 'fa-solid fa-box'},
                        {name:'Percentage Fixer', url: '/Rain-Support-Tools/src/Tools/percentage-fixer/percentage-fixer.html', icon: 'fa-solid fa-percent'}
                    ]
                },
                misc: {
                    title: 'Misc Tools',
                    show: false,
                    link_data: [
                        {name:'SF GTG Check', url: '/Rain-Support-Tools/src/Tools/bug-flow-check/bug-flow-check.html', icon: 'fa-solid fa-thumbs-up'},
                        {name:'SF Errors', url: '/Rain-Support-Tools/src/Tools/sf-errors/sf-errors.html', icon: 'fa-solid fa-list'},
                        {name:'Bandwidth Error List', url: '/Rain-Support-Tools/src/Tools/bandwidth-errors/bandwidth-errors.html', icon: 'fa-solid fa-list'},
                        {name:'Scanner Tracker', url: '/Rain-Support-Tools/src/Tools/scanner-tracker/scanner-tracker.html', icon: 'fa-solid fa-barcode', target:'blank'},
                        {name:'CSS Sandbox', url: '/Rain-Support-Tools/src/Tools/css-tester/css-tester.html', icon: 'fa-solid fa-wand-magic-sparkles'}
                    ]
                }
            },
            showNav: false
        }
    },
    methods: {
        toggleNav(nav_item){
            nav_item.show = !nav_item.show;
        },
        updateNavButtons(eventTarget){
            //change the active selection for list type
            document.querySelector('div#menu_tabs > div.active')?.classList.remove('active');
            eventTarget.classList.add('active');
            
            //change visible list of links
            const title = eventTarget.textContent.trim();
            document.querySelectorAll('.toolButtonsList > div').forEach(div => {
                div.classList.remove('active');
            });
            document.querySelector(`div.toolButtonsList > #${title.replace(' ', '-')}`)?.classList.add('active');
        },
        is404() {
            return location.search === '?404';
        }
    },
    mounted() {
        //this finds the link in the navigation for the page the user is currently looking at and highlights it to indicate current location
        if((/Rain-Support-Tools\/.+/).test(location.pathname)){
            //find current page and apply current-page class to nav
            let current_page = location.pathname.substring(20);
            document.querySelectorAll('.toolButton > a').forEach(function(element){
                if(new RegExp(current_page).test(element.href)){
                    element.classList.add('current-page');
                    element.parentElement.parentElement.parentElement.querySelector('.nav-header').click();
                }
            });
        }
    }
});
//now that app is built, accessing it and apply it to the html element on the page <nav-menu></nav-menu>
window.app = app.mount('nav-menu');