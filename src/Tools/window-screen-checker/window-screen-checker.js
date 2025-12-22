import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
const windowScreenChecker = createApp({
    template: `<div class="container">
    <h2>Window Screen Checker</h2>
    <div class="explanation-container">
        <p class="explanation-message">This tool is used to check the size of the browser window and the screen. It will compare the height and width of the window to the height and width of the screen.</p>
    </div>
    <div class="comparison-container">
        <table class="comparison-table">
            <thead>
                <tr>
                    <th></th>
                    <th>Height</th>
                    <th>Width</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Screen (Available)</td>
                    <td>{{ screenHeight }}</td>
                    <td>{{ screenWidth }}</td>
                </tr>
                <tr>
                    <td>Window (Browser Window)</td>
                    <td :class="{'error': isHeightError}">{{ windowHeight }}</td>
                    <td :class="{'error': isWidthError}">{{ windowWidth }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="error-container" v-if="isHeightError || isWidthError">
        <p class="error-message" v-if="isHeightError">The window height is greater than the screen height.</p>
        <p class="error-message" v-if="isWidthError">The window width is greater than the screen width.</p>
        <p class="error-message">This could cause issues with the display of the page.</p>
    </div>
</div>`,
        data() {
            return {
                screenHeight: 0,
                screenWidth: 0,
                windowHeight: 0,
                windowWidth: 0,
            }
        },
        computed: {
            isHeightError() {
                return this.windowHeight > this.screenHeight;
            },
            isWidthError() {
                return this.windowWidth > this.screenWidth;
            }
        },
        mounted() {
            window.addEventListener('resize', this.updateData);
            this.updateData();
        },
        methods: {
            updateData() {
                this.screenHeight = window.screen.availHeight;
                this.screenWidth = window.screen.availWidth;
                this.windowHeight = window.outerHeight;
                this.windowWidth = window.outerWidth;
            }
        }
})
windowScreenChecker.mount('window-screen-checker-app')