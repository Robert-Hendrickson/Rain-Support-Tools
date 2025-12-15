/**
 * @module brand-selector
 * @description This module is used to select a brand from a dropdown menu.
 */

import cookieCtrl from '/Rain-Support-Tools/src/common/ctrl/cookie_ctrl.js';

export default {
    name: 'brandSelector',
    props: {
        brand: String
    },
    template: `
        <button class="btn secondary" @click="showBrandSelector = !showBrandSelector">Change Brand</button>
        <div id="brand-selector" v-show="showBrandSelector">
            <h2>Select a Brand</h2>
            <div id="brand-selector-list">
                <div v-for="brand in brandList" 
                     :key="brand" 
                     class="brand-selector-item" 
                     :class="{ selected: selectedBrand === brand.toLowerCase() }"
                     @click="handleBrandSelection(brand)">
                    {{ brand }}
                </div>
            </div>
            <div class="brand-selector-buttons">
                <button class="btn secondary" @click="closeBrandSelector" v-if="this.$props.brand">Cancel</button>
                <button class="btn primary" @click="updateBrand">
                    Select
                </button>
            </div>
        </div>
    `,
    data() {
        return {
            showBrandSelector: false,
            brandList: ['Rain', 'FrameReady', 'Tri-Tech', 'Dive360', 'Etailpet', 'Rezo'],
            selectedBrand: null
        }
    },
    methods: {
        closeBrandSelector(){
            this.showBrandSelector = false;
            this.selectedBrand = this.$props.brand;
        },
        updateBrand(){
            if (!this.selectedBrand) return;
            let brand = this.selectedBrand.toLowerCase();
            this.$emit('brand-selected', brand);
            cookieCtrl.setCookie('brand', brand, 7);
            this.showBrandSelector = false;
            console.log('brand updated to: ', brand);
        },
        handleBrandSelection(brand){
            this.selectedBrand = brand.toLowerCase();
        }
    },
    mounted(){
        if(cookieCtrl.getCookie('brand')){
            let brand = cookieCtrl.getCookie('brand');
            this.selectedBrand = brand;
            cookieCtrl.setCookie('brand', brand, 7);
            this.$emit('brand-selected', brand);
        } else {
            this.showBrandSelector = true;
        }
    }
}