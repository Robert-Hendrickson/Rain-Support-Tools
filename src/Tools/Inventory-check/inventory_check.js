import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
import { numberInputComponent } from '/Rain-Support-Tools/src/components/number-input/number-input-component.js';
import errorCtrl from '/Rain-Support-Tools/src/modules/error-popup/errorCtrl.js';
import ImportHistory from './components/importHistory.js';

const inventory_check = createApp({
    components: {
        numberInputComponent,
        errorCtrl,
        ImportHistory,
    },
    data(){
        return {
            inventoryChange: '',
            reservedChange: '',
            changes: [],
            nextChangeId: 1,
            editingId: null,
            editInventory: '',
            editReserved: '',
            showImport: false,
        }
    },
    computed: {
        instock(){
            return this.changes.reduce((total, change) => total + change.inventory, 0);
        },
        reserved(){
            return this.changes.reduce((total, change) => total + change.reserved, 0);
        },
        onhand(){
            return this.instock - this.reserved;
        },
        //newest change first so the table mirrors the order shown in Rain
        historyRows(){
            let instock = 0;
            let reserved = 0;
            return this.changes.map(change => {
                instock += change.inventory;
                reserved += change.reserved;
                const difference = change.totalQty === null ? null : Math.round((change.totalQty - instock) * 1e6) / 1e6;
                return { ...change, instockAfter: instock, reservedAfter: reserved, totalDifference: difference };
            }).reverse();
        },
        hasImportedTotals(){
            return this.changes.some(change => change.totalQty !== null);
        },
        hasImportedDates(){
            return this.changes.some(change => change.date !== null);
        },
        hasImportedEvents(){
            return this.changes.some(change => change.event !== null);
        },
        historyColumnCount(){
            return 5 + [this.hasImportedTotals, this.hasImportedDates, this.hasImportedEvents].filter(Boolean).length;
        },
    },
    methods: {
        updateTotals(){
            const inventory = this.parseChange(this.inventoryChange);
            const reserved = this.parseChange(this.reservedChange);
            if(inventory !== 0 || reserved !== 0){
                this.changes.push({ id: this.nextChangeId++, inventory, reserved, totalQty: null, date: null, event: null });
            }
            this.inventoryChange = '';
            this.reservedChange = '';
            this.focusInventoryInput();
        },
        parseChange(value){
            if(value === '' || value === null || value === undefined){
                return 0;
            }
            return parseFloat(value);
        },
        focusInventoryInput(){
            document.getElementById('inventory-change')?.focus();
        },
        startEdit(row){
            this.editingId = row.id;
            this.editInventory = row.inventory;
            this.editReserved = row.reserved;
            this.$nextTick(() => document.getElementById('edit-inventory-change')?.focus());
        },
        saveEdit(){
            const change = this.changes.find(c => c.id === this.editingId);
            if(change){
                change.inventory = this.parseChange(this.editInventory);
                change.reserved = this.parseChange(this.editReserved);
            }
            this.cancelEdit();
        },
        cancelEdit(){
            this.editingId = null;
            this.editInventory = '';
            this.editReserved = '';
        },
        //changes arrive oldest first, matching the order they are stored in
        importHistoryData(changes){
            this.cancelEdit();
            this.changes = changes.map(change => ({ id: this.nextChangeId++, ...change }));
            this.inventoryChange = '';
            this.reservedChange = '';
        },
        toggleImportDialog(){
            this.showImport = !this.showImport;
            if(!this.showImport){
                this.$refs.errorCtrl.closeErrorDisplay();
                this.$nextTick(() => this.focusInventoryInput());
            }
        },
        displayErrorMessage(message){
            this.$refs.errorCtrl.updateErrorObject(message);
        },
        importedTotalClass(row){
            if(row.totalDifference === null){
                return '';
            }
            return row.totalDifference === 0 ? 'match' : 'mismatch';
        },
        importedTotalTitle(row){
            if(row.totalDifference === null){
                return '';
            }
            if(row.totalDifference === 0){
                return 'Matches the calculated total';
            }
            return `Imported total is ${this.formatChange(row.totalDifference)} compared to the calculated total`;
        },
        formatChange(value){
            return value < 0 ? `${value}` : `+${value}`;
        },
        reset(){
            this.changes = [];
            this.cancelEdit();
            this.inventoryChange = '';
            this.reservedChange = '';
            this.focusInventoryInput();
        },
    },
    mounted(){
        document.addEventListener('keydown', (event) => {
            if(event.ctrlKey && event.key.toLowerCase() === 'i'){
                event.preventDefault();
                this.toggleImportDialog();
            }
        });
    },
});
inventory_check.mount('#inventory-check');
