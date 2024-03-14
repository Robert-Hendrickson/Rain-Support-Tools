let navigation = document.querySelector('.toolButtonsList');
const nav_list ={
'Bug Ticket Form': 'Bug_ticket_form.html',
'Site Fix Ticket': 'site-fix.html',
'Transaction Calculator': 'Javascript_calculator.html',
'Transaction Calculator<br />(Tax Inclusive: Australia)': 'Tax-Inclusive-Calculator.html',
'Washington Tax Rate': 'wa_tax_rates.html',
'Fee Difference Calculator': 'fee-difference-calculator.html',
'QB Payment Split': 'QB_Mixed_Split.html',
'Inventory Check': 'Inventory-check.html',
'CSS Sandbox': 'css-tester.html'
};
let nav_element = '';
for(const page in nav_list){
nav_element += `<div class="toolButton">
<button onclick="location.pathname = '/Rain-Support-Tools/${nav_list[page]}'">${page}</button>
</div>`;
};
document.querySelector('.toolButtonsList').innerHTML = nav_element;