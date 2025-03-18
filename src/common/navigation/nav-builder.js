//define variable to be used later to hold html to be used
let html;
//if url points to the home page use this html as the builder for the navigation links
if ((/Rain-Support-Tools\/$/).test(location.pathname)) {
    html = `<div class="toolButtonsList">
    <div id="support">
        <div v-for="nav_item in nav_list.support" class="toolButton">
            <a v-bind:href="nav_item.url" v-bind:target="nav_item.target">
                <button>
                <span v-bind:class="nav_item.icon + ' fa-3x'"></span><div>{{nav_item.name}} {{nav_item.subTitle}}</div></button>
            </a>
        </div>
    </div>
    <div id="system" style="display: none;">
        <div v-for="nav_item in nav_list.system" class="toolButton">
            <a v-bind:href="nav_item.url" v-bind:target="nav_item.target">
                <button>
                <span v-bind:class="nav_item.icon + ' fa-3x'"></span><div>{{nav_item.name}} {{nav_item.subTitle}}</div></button>
            </a>
        </div>
    </div>
    <div id="misc" style="display: none;">
        <div v-for="nav_item in nav_list.misc" class="toolButton">
            <a v-bind:href="nav_item.url" v-bind:target="nav_item.target">
                <button>
                <span v-bind:class="nav_item.icon + ' fa-3x'"></span><div>{{nav_item.name}} {{nav_item.subTitle}}</div></button>
            </a>
        </div>
    </div>
</div>`;
} else {
//use this as the html for the navigation links for any page that isn't the home page
    html = `<div class="secondary_menu_links">
    <div class="toolButtonsList">
        <ul>
            <li v-for="nav_item in nav_list.home" class="toolButton">
                <a v-bind:href="nav_item.url" v-bind:target="nav_item.target">
                    <div>
                        <span v-bind:class="nav_item.icon"></span>{{nav_item.name}}<span class="sub-title">{{nav_item.subTitle}}</span>
                    </div>
                </a>
            </li>
        </ul>
        <div class="nav-header">Support Tools</div>
        <ul>
            <li v-for="nav_item in nav_list.support" class="toolButton">
                <a v-bind:href="nav_item.url" v-bind:target="nav_item.target">
                    <div>
                        <span v-bind:class="nav_item.icon"></span>{{nav_item.name}}<span class="sub-title">{{nav_item.subTitle}}</span>
                    </div>
                </a>
            </li>
        </ul>
        <div class="nav-header">System Tools</div>
        <ul>
            <li v-for="nav_item in nav_list.system" class="toolButton">
                <a v-bind:href="nav_item.url" v-bind:target="nav_item.target">
                    <div>
                        <span v-bind:class="nav_item.icon"></span>{{nav_item.name}}<span class="sub-title">{{nav_item.subTitle}}</span>
                    </div>
                </a>
            </li>
        </ul>
        <div class="nav-header">Misc Tools</div>
        <ul>
            <li v-for="nav_item in nav_list.misc" class="toolButton">
                <a v-bind:href="nav_item.url" v-bind:target="nav_item.target">
                    <div>
                        <span v-bind:class="nav_item.icon"></span>{{nav_item.name}}<span class="sub-title">{{nav_item.subTitle}}</span>
                    </div>
                </a>
            </li>
        </ul>
    </div>
</div>`
}
/*this creates a new vue app that uses the html from above to build the navigation based on the provided navigation links.
Editing links in the object here updates the navigation accross the entire website.
*/
//nav list items are built as follows {name: Display text for link, url: file needing to be directed to when link is clicked, icon: fontawesome classes used for applying icons in navigation}
const app = Vue.createApp({
    template: html,
    data() {
        return {nav_list : {
                home: [
                    {name: 'Home', url: '/Rain-Support-Tools/', icon: 'fa-solid fa-house'},
                    {name: 'System Updates', url: 'https://github.com/Robert-Hendrickson/Rain-Support-Tools/pulls?q=is%3Amerged', target:'blank', icon: 'fa-solid fa-wrench'}
                ],
                support: [
                    {name: 'Bug Ticket v2', url: '/Rain-Support-Tools/src/Tools/bug-ticket/bug-ticket-v2.html', icon: 'fa-solid fa-bug'},
                    {name:'Database', url: '/Rain-Support-Tools/src/Tools/database-ticket/database-ticket.html', icon: 'fa-solid fa-database'},
                    {name:'Site Work', url: '/Rain-Support-Tools/src/Tools/site-work/site-work.html', icon: 'fa-solid fa-hammer'},
                    {name: 'DNS Record Tool', url: '/Rain-Support-Tools/src/Tools/dns-help/dns-help.html', icon: 'fa-regular fa-compass'}
                ],
                system: [
                    {name:'Email List Checker', url: '/Rain-Support-Tools/src/Tools/email-list-checker/email-list-checker.html', icon: 'fa-solid fa-envelope'},
                    {name:'Transaction Calculator', url: '/Rain-Support-Tools/src/Tools/Transaction-Calculator/Javascript_calculator.html', icon: 'fa-solid fa-calculator'},
                    {name:'Transaction Calculator',subTitle: '(Tax Inclusive: Australia)', url: '/Rain-Support-Tools/src/Tools/Tax-Included-Calculator/Tax-Inclusive-Calculator.html', icon: 'fa-solid fa-calculator'},
                    {name:'Washington Tax Rate', url: '/Rain-Support-Tools/src/Tools/wa-tax-rates/wa_tax_rates.html', icon: 'fa-solid fa-percent'},
                    {name:'RTO Payments Calculator', url: '/Rain-Support-Tools/src/Tools/rto-payments/rto-payments.html', icon: 'fa-solid fa-truck-moving'},
                    {name:'Fee Difference Calculator', url: '/Rain-Support-Tools/src/Tools/fee-difference-calculator/fee-difference-calculator.html', icon: 'fa-solid fa-money-bill'},
                    {name:'QB Payment Split', url: '/Rain-Support-Tools/src/Tools/QB-Mixed-Split/QB_Mixed_Split.html', icon: 'fa-solid fa-dollar-sign'},
                    {name:'Inventory Check', url: '/Rain-Support-Tools/src/Tools/Inventory-check/Inventory-check.html', icon: 'fa-solid fa-box'}
                ],
                misc: [
                    {name:'SF GTG Check', url: '/Rain-Support-Tools/src/Tools/bug-flow-check/bug-flow-check.html', icon: 'fa-solid fa-thumbs-up'},
                    {name:'SF Errors', url: '/Rain-Support-Tools/src/Tools/sf-errors/sf-errors.html', icon: 'fa-solid fa-list'},
                    {name:'Bandwidth Error List', url: '/Rain-Support-Tools/src/Tools/bandwidth-errors/bandwidth-errors.html', icon: 'fa-solid fa-list'},
                    {name:'CSS Sandbox', url: '/Rain-Support-Tools/src/Tools/css-tester/css-tester.html', icon: 'fa-solid fa-wand-magic-sparkles'},
                    {name:"Riley's Secret", url: '/Rain-Support-Tools/src/riley/riley.html', target:'blank', icon: 'fa-solid fa-paper-plane'}
                ]
            }};
    }
});
//now that app is built, accessing it and apply it to the html element on the page <nav-menu></nav-menu>
app.mount('nav-menu');
/*function controls toggling the navigation menu as visible and not visible*/
function toggleNav(){
    if(document.querySelector('.secondary_menu_links').classList.value.match(/active/) != null){
        document.querySelector('.secondary_menu_links').classList.remove('active');
    } else {
        document.querySelector('.secondary_menu_links').classList.add('active');
    }
}
//this finds the link in the navigation for the page the user is currently looking at and highlights it to indicate current location
if((/Rain-Support-Tools\/.+/).test(location.pathname)){
    //find current page and apply current-page class to nav
    let current_page = location.pathname.substring(20);
    document.querySelectorAll('.toolButton > a').forEach(function(element){
        if(new RegExp(current_page).test(element.href)){
            element.classList.add('current-page');
        }
    });
}