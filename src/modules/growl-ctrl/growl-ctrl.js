export const GrowlCtrl = {
    name: 'GrowlCtrl',
    template: `
        <div v-if="this.showGrowl" class="growl-container" :class="this.growl.type" :class="{'fade-out': this.growlFadeOut}" @click="clearGrowl">
            <div class="growl-content">
                <div v-if="this.growl.message" class="growl-content-message">{{this.growl.message}}</div>
                <div v-else class="growl-content-message">Something didn't work</div>
            </div>
            <span class="fa-solid fa-x close-growl" @click="clearGrowl"></span>
        </div>`,
    data() {
        return {
            growl: {
                message: '',
                type: 'info',
            },
            showGrowl: false,
            growlFadeOut: false
        }
    },
    methods: {
        updateGrowl(growl, holdGrowl = false) {
            this.growl = growl;
            this.showGrowl = true;
            if (!holdGrowl) {
                this.setGrowlTimeout();
            } else {
                this.showGrowl = true;
            }
        },
        clearGrowl() {
            clearTimeout(this.growlTimeout);
            this.showGrowl = false;
        },
        setGrowlTimeout(){
            this.growlTimeout = setTimeout(() => {
                this.growlFadeOut = true;
                setTimeout(() => {
                    this.showGrowl = false;
                    this.growlFadeOut = false;
                }, 1500);
            }, 2000);
        }
    },
    mounted() {
        // start load the css file
        let css = document.createElement('link');
        css.href = '/Rain-Support-Tools/src/modules/growl-ctrl/growl.css';
        css.rel = 'stylesheet';
        document.head.appendChild(css);
        // end load the css file
    }
}