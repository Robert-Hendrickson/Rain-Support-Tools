/**
 * @module brand-selector
 * @description This module is used to select a brand from a dropdown menu.
 */

import cookieCtrl from '/Rain-Support-Tools/src/common/ctrl/cookie_ctrl.js';

export default {
    name: 'brandSelector',
    template: `
        <div id="brand-selector" v-if="showBrandSelector">
            <h2>Brand</h2>
            <div id="brand-selector-list">
                <div v-for="brand in brandList" :key="brand" class="brand-selector-item" @click="handleBrandSelection">
                    {{ brand }}
                </div>
            </div>
            <button class="btn primary" @click="updateBrand">
                Select
            </button>
        </div>
    `,
    data() {
        return {
            showBrandSelector: false,
            brandList: ['Rain', 'FrameReady', 'Tri-Tech', 'Dive360', 'Etailpet']
        }
    },
    methods: {
        updateBrand(){
            let brand = document.querySelector('.brand-selector-item.selected').textContent.toLowerCase();
            this.$emit('brand-selected', brand);
            cookieCtrl.setCookie('brand',brand, 7);
            this.showBrandSelector = false;
        },
        handleBrandSelection(element){
            document.querySelector('.brand-selector-item.selected')?.classList.remove('selected');
            element.currentTarget.classList.add('selected');
        }
    },
    mounted(){
        if(cookieCtrl.getCookie('brand')){
            let brand = cookieCtrl.getCookie('brand');
            cookieCtrl.setCookie('brand',brand, 7);
        } else {
            this.showBrandSelector = true;
        }
    }
}