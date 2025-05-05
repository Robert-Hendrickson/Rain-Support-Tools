/**
 * @description This is the main app for the email list checker tool.
 */
const email_list_checker_app = Vue.createApp({
    data(){
        return {
            email_check: new RegExp(/^[\w\-\_\+\.\&]+@[\w\-]+(?:\.[\w]{2,})+$/gm),
            input_list: [],
            good_list: [],
            bad_list: [],
            show_import: false,
            code_copied: false
        }
    },
    methods: {
        runCheck(){
            //loop through the arrayed list and compare the email address to the check
            this.good_list = [];
            this.bad_list = [];
            for(let i=0; i<this.input_list.length; i++){
                if(this.email_check.test(this.input_list[i])){//if it passes, add it to the good email list
                    this.good_list.push(this.input_list[i]);
                } else {//else add it to the bad email list
                    this.bad_list.push(this.input_list[i]);
                }
            };
        },
        importList(){
            //get string of emails
            let import_string = document.querySelector('.import textarea').value;
            //email string will look like (email_1\\nemail_2\\n...), replace all \\n with \n, this will make a readable list in the text area
            import_string = import_string.replaceAll("'","").replaceAll('\\n','\n');
            //add new string to import box
            this.inputListText = import_string;
            //close import modal
            this.show_import = false;
        },
        async clearData(){
            let custom_dialogue = await import('/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.js');
            if(await custom_dialogue.default("You are about to clear all current data and won't able to reclaim it. Are you sure you want to proceed?","Continue","Cancel")) {
                this.input_list = [];
                this.good_list = [];
                this.bad_list = [];
            };
        },
        copyCode(){
            let code = `let email_list = document.querySelectorAll('table > tbody tr td:first-child');\nlet email_list_string = '';\nfor(i=1;i<email_list.length;i++){\nemail_list_string += email_list[i].innerText + \`\n\`;\n};\nemail_list_string.substring(0, email_list_string.length -1);`;
            navigator.clipboard.writeText(code);
            this.code_copied = true;
            setTimeout(() => {
                this.code_copied = false;
            }, 3000);
        },
        testImport(){
            document.querySelector('.import textarea').value = '13528849392@163.com\\naebarlow@ucdavis\\nbjt@lcc-inc.cim\\nbunsterof3@hotmailcom\\nCathyVan910@icloud.co\\ncrrwebinfo@gmail.co\\ndrosas916@gmailcom\\nGrandmagerry @sncglobal.net\\njeanmail@earthlink.net; JKNIESE@COMCAST.NET\\njholmes@221bbakerstreet\\njlarson67rsss@icloud.om\\njoy@blackcat@amas.com\\nkdeliramich@yahoo.co\\nkleger@csu@chico.edu\\nlauramara@peoplepc.co\\nMickeys54@gmail\\nmmpblack@yahoo .com\\nmomofbnw@yahoo.co\\nmotomxmarissa@gmail.co\\nnrloezburton@ucdavisedu\\nPurtillk@yahoo.cm\\nrbconnelly@frontiernetnet\\nrosemu@sbcglobal.et\\nsandraross6051@sbcglobalnet\\nsensei@pinewood Kante.com\\nsflynn6892@aol.co\\nslfillo77@gmail.co\\nsmccutler@gmail.om\\nsnowbird86@hotmail.co\\nsofiab@sbservices.co\\ntboyd8@yahoo\\nunionhackett@comcast..net\\nwestcoastwool@gmail.co\\nwunderwomen2@hotmail\\nyas2@say@aol.com';
            console.log('Test email list set in import modal');
        },
        array_string(list){
            let temp = '';
            for(let i=0;i<list.length;i++){
                temp += list[i] + '\n';
            }
            return temp.substring(0,temp.length -1);
        }
    },
    computed: {
        isTest(){
            return (location.hostname == 'localhost' || location.search.includes('test'));
        },
        inputListText: {
            get() {
                return this.array_string(this.input_list);
            },
            set(value) {
                this.input_list = value ? value.split('\n') : [];
            }
        }
    }
});
email_list_checker_app.mount('#email-list-checker');