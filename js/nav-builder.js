let html;
if((/Rain-Support-Tools\/$/).test(location.pathname)) {
    html = `<div class="toolButtonsList">
    <div id="support">
        <div v-for="nav_item in nav_list.support" class="toolButton">
            <a v-bind:href="nav_item.url" v-bind:target="nav_item.target">
                <button>{{nav_item.name}} {{nav_item.subTitle}}</button>
            </a>
        </div>
    </div>
    <div id="system" style="display: none;">
        <div v-for="nav_item in nav_list.system" class="toolButton">
            <a v-bind:href="nav_item.url" v-bind:target="nav_item.target">
                <button>{{nav_item.name}} {{nav_item.subTitle}}</button>
            </a>
        </div>
    </div>
    <div id="misc" style="display: none;">
        <div v-for="nav_item in nav_list.misc" class="toolButton">
            <a v-bind:href="nav_item.url" v-bind:target="nav_item.target">
                <button>{{nav_item.name}} {{nav_item.subTitle}}</button>
            </a>
        </div>
    </div>
</div>`;
} else {
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

const app = Vue.createApp({
    template: html,
    data() {
        return {nav_list : {
                home: [
                    {name: 'Home', url: '/Rain-Support-Tools/', icon: 'fa-solid fa-house'}
                ],
                support: [
                    //{name:'Bug Ticket Form', url: 'Bug_ticket_form.html'},
                    {name: 'Bug Ticket v2', url: 'bug-ticket-v2.html', icon: 'fa-solid fa-bug'},
                    //{name:'Site Fix Ticket', url: 'site-fix.html', icon: 'fa-solid fa-hammer'},
                    {name:'Site Work', url: 'site-work.html', icon: 'fa-solid fa-hammer'},
                    {name: 'DNS Record Tool', url: 'dns-help.html', icon: 'fa-regular fa-compass'}
                ],
                system: [
                    {name:'Email List Checker', url: 'email-list-checker.html', icon: 'fa-solid fa-envelope'},
                    {name:'Transaction Calculator', url: 'Javascript_calculator.html', icon: 'fa-solid fa-calculator'},
                    {name:'Transaction Calculator',subTitle: '(Tax Inclusive: Australia)', url: 'Tax-Inclusive-Calculator.html', icon: 'fa-solid fa-calculator'},
                    {name:'Washington Tax Rate', url: 'wa_tax_rates.html', icon: 'fa-solid fa-percent'},
                    {name:'Fee Difference Calculator', url: 'fee-difference-calculator.html', icon: 'fa-solid fa-money-bill'},
                    {name:'QB Payment Split', url: 'QB_Mixed_Split.html', icon: 'fa-solid fa-dollar-sign'},
                    {name:'Inventory Check', url: 'Inventory-check.html', icon: 'fa-solid fa-box'}
                ],
                misc: [
                    {name:'CSS Sandbox', url: 'css-tester.html', icon: 'fa-solid fa-wand-magic-sparkles'},
                    {name:"Riley's Secret", url: 'riley/riley.html', target:'blank', icon: 'fa-solid fa-paper-plane'}
                ]
            }};
    }
});
app.mount('nav-menu');

function toggleNav(){
    if($('.secondary_menu_links')[0].classList.value.match(/active/) != null){
        $('.secondary_menu_links').removeClass('active');
    } else {
        $('.secondary_menu_links').addClass('active');
    }
}

if((/Rain-Support-Tools\/.+/).test(location.pathname)){
    //find current page and apply current-page class to nav
    let current_page = location.pathname.substring(20);
    $('.toolButton > a').each(function(){
        if(new RegExp(current_page).test(this.href)){
            $(this).addClass('current-page');
        }
    });
}