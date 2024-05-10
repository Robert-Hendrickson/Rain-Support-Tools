const app = Vue.createApp({
    data() {
        return {nav_list : [
            {name:'Bug Ticket Form', url: 'Bug_ticket_form.html'},
            //{name: 'Bug Ticket v2', url: 'bug-ticket-v2.html'},
            {name:'Site Fix Ticket', url: 'site-fix.html'},
            {name:'Transaction Calculator', url: 'Javascript_calculator.html'},
            {name:'Transaction Calculator (Tax Inclusive: Australia)', url: 'Tax-Inclusive-Calculator.html'},
            {name:'Washington Tax Rate', url: 'wa_tax_rates.html'},
            {name:'Fee Difference Calculator', url: 'fee-difference-calculator.html'},
            {name:'QB Payment Split', url: 'QB_Mixed_Split.html'},
            {name:'Inventory Check', url: 'Inventory-check.html'},
            {name:'CSS Sandbox', url: 'css-tester.html'},
            {name:'Email List Checker', url: 'email-list-checker.html'},
            {name:"Riley's Secret", url: 'riley/riley.html', target:'blank'}
        ]};
    }
});
app.mount('.toolButtonsList');