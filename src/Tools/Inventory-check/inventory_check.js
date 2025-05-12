import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
const inventory_check = createApp({
    //set variable to hold totals
    data(){
        return {
            instock: 0,
            reserved: 0
        }
    },
    methods: {
        updateTotals(){
            try {
                let inventory_change = this.getInventoryChange();
                let reserved_change = this.getReservedChange();
                if(isNaN(inventory_change) || isNaN(reserved_change)){
                    throw new Error('Inventory change or reserved change is not a number');
                }
                this.instock += inventory_change;
                this.reserved += reserved_change;
                if(inventory_change != 0 || reserved_change != 0){
                    this.recordChange(inventory_change,reserved_change);
                }
                document.getElementById('inventory-change').value = '';
                document.getElementById('reserved-change').value = '';
            } catch (error) {
                alert(error.message);
                return; // Stop execution
            }
        },
        getInventoryChange(){
            //if the inventory change is empty return 0, else return the value
            if(document.getElementById('inventory-change').value === ''){
                return 0;
            }
            return parseFloat(document.getElementById('inventory-change').value);
        },
        getReservedChange(){
            //if the reserved change is empty return 0, else return the value
            if(document.getElementById('reserved-change').value === ''){
                return 0;
            }
            return parseFloat(document.getElementById('reserved-change').value);
        },
        recordChange(inventory_change,reserved_change){
            let inventory_symbol = inventory_change < 0 ? '' : '+';
            let reserved_symbol = reserved_change < 0 ? '' : '+';
            let html_row_string = `<tr><td>${inventory_symbol}${inventory_change}</td><td>${reserved_symbol}${reserved_change}</td><td>${this.instock}</td><td>${this.reserved}</td></tr>`;
            document.querySelector('.history-changes > tbody').insertAdjacentHTML('afterbegin',html_row_string);
        },
        reset(){
            this.instock = 0;
            this.reserved = 0;
            document.querySelector('.history-changes > tbody').innerHTML = '';
        }
    },
    computed: {
        onhand(){
            return this.instock - this.reserved;
        }
    }
});
inventory_check.mount('#inventory-check');