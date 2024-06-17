const app = Vue.createApp({
    data() {
        return {nav_list : {
                home: [
                    {name: 'Home', url: '/Rain-Support-Tools/', icon: 'fa-solid fa-house'}
                ],
                support: [
                    //{name:'Bug Ticket Form', url: 'Bug_ticket_form.html'},
                    {name: 'Bug Ticket v2', url: 'bug-ticket-v2.html', icon: 'fa-solid fa-bug'},
                    {name:'Site Fix Ticket', url: 'site-fix.html', icon: 'fa-solid fa-hammer'},
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
app.mount('.toolButtonsList');

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