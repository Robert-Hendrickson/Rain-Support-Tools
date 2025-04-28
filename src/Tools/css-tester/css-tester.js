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
<div v-if="edit_content" class="edit-container">
    <div class="edit-content-container">
        <div class="edit-header">
            <div class="active">HTML</div>
            <div>CSS</div>
        </div>
        <div class="edit-content">
            <div class="edit-html active">
                <textarea id="html-text"></textarea>
            </div>
            <div class="edit-css">
                <textarea id="css-text"></textarea>
            </div>
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
        }
    },
    methods: {
        handleEdit(id){
            this.edit_content = !this.edit_content;
            this.edit_content_key = id;
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