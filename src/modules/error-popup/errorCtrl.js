/**
 * @module errorCtrl
 * @description This module is used to display error messages to the user.
 */

export default {
    name: 'errorCtrl',
    template: `
    <div id="error_message" v-if="displayErrors">
        These are the issues found with the data provided:<span @click="closeErrorDisplay">X</span>
        <ul>
            <li v-for="(error, index) in this.error_object" :key="index">
                {{ error }}
            </li>
        </ul>
    </div>
    `,
    data() {
        return {
            error_object: {},
            displayErrors: false
        }
    },
    mounted() {
        //create a style element
        const style = document.createElement('style');
        //add the styles to the style element
        style.textContent = `
            #error_message {
                word-wrap: break-word;
                position: absolute;
                top: 10%;
                left: 40%;
                z-index: 1000;
                width: 400px;
                box-shadow: 2px 2px #F2DEDE;
                background-color: #F2DEDE;
                border-style: solid;
                border-width: 1px;
                border-color: #000;
                color: #AD4E4C;
                padding: 16px;
            }
            #error_message > span {
                float: right;
                cursor: pointer;
                padding: 0px 5px;
            }
            #error_message > ul {
                list-style: decimal;
                padding-left: 20px;
            }
            #error_message ul {
                margin: unset;
            }
            #error_message ul ul {
                list-style-type: disc;
                padding-left: 15px;
            }
        `;
        document.head.appendChild(style);
    },
    methods: {
        updateErrorObject(error_list){
            this.error_object = error_list;
            this.displayErrors = true;
        },
        closeErrorDisplay(){
            this.displayErrors = false;
            this.error_object = {};
        }
    }
}