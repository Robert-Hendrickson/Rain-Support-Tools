import { cssDefaults } from './css-defaults.js';

const css_tester_app = Vue.createApp({
    template: `<div v-for="(value, key) in css_defaults" class="container">
    <content-header>
        <h1>{{ value.html.header }}</h1>
        <span id="page-css" class="fa-solid fa-pencil edit-button" @click="handleEdit(key)"></span>
    </content-header>
    <html-content v-if="value.html.content" v-html="value.html.content" :class="key">
    </html-content>
</div>
<div v-show="edit_content" class="edit-container">
    <div class="edit-content-container">
        <div class="edit-header">
            <div :class="{'active': edit_content_type == 'html'}" v-if="edit_content_key != 'page'" @click="edit_content_type = 'html'">HTML</div>
            <div :class="{'active': edit_content_type == 'css'}" @click="edit_content_type = 'css'">CSS</div>
        </div>
        <div class="edit-content">
            <div v-if="edit_content_key != 'page'" class="edit-html" :class="{'active': edit_content_type == 'html'}">
                <textarea id="html-text"></textarea>
            </div>
            <div class="edit-css" :class="{'active': edit_content_type == 'css'}">
                <textarea id="css-text"></textarea>
            </div>
        </div>
        <div class="edit-footer">
            <button class="btn primary" @click="handleSave">Save</button>
            <button class="btn secondary" @click="handleCancel">Cancel</button>
        </div>
    </div>
</div>`,
    data(){
        return {
            css_defaults: cssDefaults,
            css_defaults_keys: Object.keys(cssDefaults),
            css_defaults_values: Object.values(cssDefaults),
            edit_content: false,
            edit_content_key: '',
            edit_content_type: 'html',
        }
    },
    methods: {
        handleEdit(id){
            this.edit_content = !this.edit_content;
            if(id == 'page'){
                this.edit_content_type = 'css';
            }else{
                this.edit_content_type = 'html';
            }
            this.edit_content_key = id;
            document.querySelector(`textarea#css-text`).value = document.querySelector(`#${id}-css`).innerHTML;
            if(id != 'page'){
                document.querySelector(`textarea#html-text`).value = document.querySelector(`html-content.${id}`).innerHTML;
            }
        },
        handleSave(){
            this.edit_content = false;
            document.querySelector(`#${this.edit_content_key}-css`).innerHTML = document.getElementById('css-text').value;
            if(this.edit_content_key != 'page'){
                document.querySelector(`html-content.${this.edit_content_key}`).innerHTML = document.getElementById('html-text').value;

                const container = document.querySelector(`html-content.${this.edit_content_key}`);
                container.innerHTML = '';
                const userHTML = document.getElementById('html-text').value;

                // Step 1: Create a temporary container to parse the HTML
                const temp = document.createElement('div');
                temp.innerHTML = userHTML;

                // Step 2: Move non-script elements first
                [...temp.children].forEach(child => {
                if (child.tagName.toLowerCase() !== 'script') {
                    container.appendChild(child);
                }
                });

                // Step 3: Handle <script> separately
                [...temp.querySelectorAll('script')].forEach(script => {
                const newScript = document.createElement('script');
                
                // Inline script
                if (script.textContent) {
                    newScript.textContent = script.textContent;
                }

                // External script
                if (script.src) {
                    newScript.src = script.src;
                }

                container.appendChild(newScript);
            });
            
            }
        },
        handleCancel(){
            this.edit_content = false;
        },
        handleSwitchEditBox(){
            this.edit_content = !this.edit_content;
        },
        setDefaultCSS(){
            document.querySelectorAll('style[id$="-css"]').forEach(style => {
                style.innerHTML = cssDefaults[style.id.substring(0,style.id.length-4)].css;
            });
        }
    },
    computed: {
        getStyleContent() {
            return (item) => {
                console.log('CSS content:', item.css);
                const styleContent = item.css || '';
                return `<style id="page-css" type="text/css">${styleContent}</style>`;
            }
        }
    }
});

window.cssTestApp = css_tester_app.mount('css-tester-app');

function updateCSS(){
    let new_css = document.querySelector('textarea').value.replaceAll('\n','');
    document.getElementById('page-css').innerHTML = new_css;
};

function toggleControl(){
    let current = document.getElementById('userInput').classList[0];
    if(current === 'closed'){
        document.getElementById('userInput').classList = 'open';
        document.querySelector('#panelToggle span').classList.remove('fa-angles-left');
        document.querySelector('#panelToggle span').classList.add('fa-angles-right');
    }else{
        document.getElementById('userInput').classList = 'closed';
        document.querySelector('#panelToggle span').classList.remove('fa-angles-right');
        document.querySelector('#panelToggle span').classList.add('fa-angles-left');
    };
};

//this is for the color getter to display the hex color code easily
function getColor(){
    document.querySelector('.container input[type="text"]').value = document.querySelector('.container input[type="color"]').value;
};

function checkColor(){
    document.querySelector('.container input[type="color"]').value = document.querySelector('.container input[type="text"]').value;
};

document.addEventListener('DOMContentLoaded',() => {
    document.querySelector('.container input[type="color"]').addEventListener('change',getColor);
    document.querySelector('.container input[type="text"]').addEventListener('change',checkColor);
    cssTestApp.setDefaultCSS();
});