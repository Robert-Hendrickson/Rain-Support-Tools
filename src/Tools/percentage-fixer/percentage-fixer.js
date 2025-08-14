import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
import { GrowlCtrl } from '/Rain-Support-Tools/src/modules/growl-ctrl/growl-ctrl.js';
const PercentageFixerApp = createApp({
    data() {
        return {
            inputValues: '',
            outputValues: '',
            actions: [],
            showHelp: false
        }
    },
    components: {
        GrowlCtrl
    },
    methods: {
        addAction() {
            this.actions.push({
                increase: false,
                decrease: false,
                percentage: false,
                dollar: false,
                value: 0
            });
        },
        handleIncreaseChange(index) {
            if (this.actions[index].decrease) {
                this.actions[index].decrease = false;
            }
        },
        handleDecreaseChange(index) {
            if (this.actions[index].increase) {
                this.actions[index].increase = false;
            }
        },
        handlePercentageChange(index) {
            if (this.actions[index].dollar) {
                this.actions[index].dollar = false;
            }
        },
        handleDollarChange(index) {
            if (this.actions[index].percentage) {
                this.actions[index].percentage = false;
            }
        },
        processOutputValues() {
            // Process the output values and update input values
            if (!this.inputValues.trim()) {
                this.outputValues = '';
                return;
            }
            // For now, just copy the output to input
            // You can add your percentage fixing logic here
            let outputString = '';
            let values = this.inputValues.split('\n');
            for (let i = 0; i < values.length; i++) {
                if (isNaN(parseFloat(values[i].trim()))) {
                    outputString += values[i].trim() + '\n';
                    continue;
                }
                let value = parseFloat(values[i].trim()); 
                outputString += this.updateValue(value) + '\n';
            }
            this.outputValues = outputString;
        },
        updateValue(number) {
            let newNumber = number;
            for (let i = this.actions.length - 1; i >= 0; i--) {
                if (this.actions[i].percentage) {
                    if (this.actions[i].increase) {
                        newNumber += newNumber * (this.actions[i].value / 100);
                    } else {
                        newNumber -= newNumber * (this.actions[i].value / 100);
                    }
                } else {
                    if (this.actions[i].increase) {
                        newNumber += this.actions[i].value;
                    } else {
                        newNumber -= this.actions[i].value;
                    }
                }
            }
            return Math.round(newNumber * 100) / 100;
        },
        confirmActions() {
            if(!this.actions.length) return;
            this.actions.forEach(action => {
                if (
                    (!action.increase && !action.decrease) ||
                    (!action.percentage && !action.dollar)
                ) {
                    this.$refs.growlCtrl.updateGrowl({
                        message: 'Missing Action or Type Selection(s)',
                        type: 'error'
                    });
                    return;
                }
            });
            this.processOutputValues();
        },
        copyOutputValues() {
            navigator.clipboard.writeText(this.outputValues);
            this.$refs.growlCtrl.updateGrowl({
                message: 'Output values copied to clipboard',
                type: 'success'
            });
        },
        removeAction(index) {
            this.actions.splice(index, 1);
        },
        clearData() {
            this.actions = [];
            this.inputValues = '';
            this.outputValues = '';
            this.$refs.growlCtrl.updateGrowl({
                message: 'Data cleared',
                type: 'success'
            });
        }
    }
})
PercentageFixerApp.mount('#percentage-fixer');