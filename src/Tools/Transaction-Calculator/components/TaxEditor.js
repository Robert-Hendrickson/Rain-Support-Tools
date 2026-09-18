export default {
    name: 'TaxEditor',
    props: {
        taxRates: {
            type: Object,
            required: true
        },
        editTaxes: {
            type: Boolean,
            required: true
        },
        taxShipping: {
            type: Boolean,
            required: true
        },
        surcharging: {
            type: Boolean,
            required: true
        },
        surchargeTax: {
            type: Boolean,
            required: true
        },
        taxSurcharge: {
            type: Boolean,
            required: true
        },
        surchargeRate: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            localTaxRates: {
                material: [],
                service: [],
                class: []
            },
            idCounter: 3
        }
    },
    watch: {
        editTaxes: {
            handler() {
                this.localTaxRates = JSON.parse(JSON.stringify(this.taxRates));
            },
            deep: true
        }
    },
    template: `
    <div class="tax-editor-popup" :class="{active: editTaxes}" id="tax-editor-popup">
        <div class="tax-editor-content">
            <div class="tax-editor-header">
                <h3>Tax Jurisdiction Editor</h3>
                <button id="close-tax-editor" class="close-button" @click="closeEditTaxes">&times;</button>
            </div>
            <div class="tax-editor-shipping">
                <h4>Shipping Tax</h4>
                <input type="checkbox" :checked="taxShipping" @click="toggleTaxShipping">
            </div>
            <div class="surcharge-editor">
                <h4>Surcharge</h4>
                <div class="surcharge-options">
                    <div class="surcharge-option">
                        <label for="surcharging-toggle">Enable Surcharging</label>
                        <input id="surcharging-toggle" type="checkbox" :checked="surcharging" @click="toggleFlag('surcharging', surcharging)">
                    </div>
                    <div class="surcharge-option">
                        <label for="surcharge-rate">Surcharge Rate %</label>
                        <input id="surcharge-rate" type="number" class="tax-rate-input" placeholder="Rate %" step="0.01"
                            :disabled="!surcharging" :value="surchargeRate" @input="updateSurchargeRate($event)">
                    </div>
                    <div class="surcharge-option">
                        <label for="surcharge-tax-toggle">Surcharge Tax <span class="surcharge-hint">(include tax in the surcharge base)</span></label>
                        <input id="surcharge-tax-toggle" type="checkbox" :disabled="!surcharging" :checked="surchargeTax" @click="toggleFlag('surchargeTax', surchargeTax)">
                    </div>
                    <div class="surcharge-option">
                        <label for="tax-surcharge-toggle">Tax Surcharge <span class="surcharge-hint">(apply material rates to the surcharge)</span></label>
                        <input id="tax-surcharge-toggle" type="checkbox" :disabled="!surcharging" :checked="taxSurcharge" @click="toggleFlag('taxSurcharge', taxSurcharge)">
                    </div>
                </div>
            </div>
            <div class="tax-jurisdiction-columns">
                <div class="jurisdiction-column">
                    <h4>Material Tax</h4>
                    <div class="tax-rates" id="material-tax-rates">
                        <div class="tax-rate-row" v-for="rate in localTaxRates.material" :key="rate.id">
                            <input v-model="rate.rate" type="number" class="tax-rate-input" placeholder="Rate %" step="0.01">
                            <button class="remove-rate" @click="removeTaxRate('material', rate.id)">&times;</button>
                        </div>
                    </div>
                    <button class="add-rate" @click="addTaxRate('material')">Add Rate</button>
                </div>
                <div class="jurisdiction-column">
                    <h4>Service Tax</h4>
                    <div class="tax-rates" id="service-tax-rates">
                        <div class="tax-rate-row" v-for="rate in localTaxRates.service" :key="rate.id">
                            <input v-model="rate.rate" type="number" class="tax-rate-input" placeholder="Rate %" step="0.01">
                            <button class="remove-rate" @click="removeTaxRate('service', rate.id)">&times;</button>
                        </div>
                    </div>
                    <button class="add-rate" @click="addTaxRate('service')">Add Rate</button>
                </div>
                <div class="jurisdiction-column">
                    <h4>Class Tax</h4>
                    <div class="tax-rates" id="class-tax-rates">
                        <div class="tax-rate-row" v-for="rate in localTaxRates.class" :key="rate.id">
                            <input v-model="rate.rate" type="number" class="tax-rate-input" placeholder="Rate %" step="0.01">
                            <button class="remove-rate" @click="removeTaxRate('class', rate.id)">&times;</button>
                        </div>
                    </div>
                    <button class="add-rate" @click="addTaxRate('class')">Add Rate</button>
                </div>
            </div>
            <div class="tax-editor-footer">
                <button class="btn secondary" @click="closeEditTaxes">Cancel</button>
                <button class="btn primary" @click="saveTaxRates">Save</button>
            </div>
        </div>
    </div>`,
    methods: {
        closeEditTaxes() {
            this.$emit('update:editTaxes', false);
        },
        toggleTaxShipping() {
            this.$emit('update:taxShipping', !this.taxShipping);
        },
        toggleFlag(flag, current) {
            this.$emit(`update:${flag}`, !current);
        },
        updateSurchargeRate(event) {
            this.$emit('update:surchargeRate', Number(event.target.value) || 0);
        },
        addTaxRate(jurisdiction) {
            this.idCounter++;
            this.localTaxRates[jurisdiction].push({id: this.idCounter, rate: 0});
        },
        removeTaxRate(jurisdiction, id) {
            this.localTaxRates[jurisdiction] = this.localTaxRates[jurisdiction].filter(rate => rate.id !== id);
        },
        updateTaxRate(jurisdiction, id, rate) {
            this.localTaxRates[jurisdiction] = this.localTaxRates[jurisdiction].map(rate => rate.id === id ? {...rate, rate} : rate);
        },
        saveTaxRates() {
            this.$emit('update:taxRates', {...this.localTaxRates});
            this.$emit('update:editTaxes', false);
        }
    }
}