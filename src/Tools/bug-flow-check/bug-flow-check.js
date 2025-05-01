/**
 * @description This builds the app that checks the fields of a sales force case to make sure they are correct.
 */
const app = Vue.createApp({
    template: `<div class="container">
    <div data entry>
            Case Owner<br>
            <input id="owner" type="text" placeholder="Enter Case Owner Name" @keyup="checkOwner" />
            <br>
            Case Status<br>
            <input id="status" type="text" placeholder="Enter Case Status" @keyup="checkStatus" />
            <br>
            Case Reason<br>
            <input id="reason" type="text" placeholder="Enter Case Reason" @keyup="checkReason" />
            <br>
            Case Issue<br>
            <input id="issue" type="text" placeholder="Enter Case Issue" @keyup="checkIssue" />
            <br>
            Case Description<br>
            <textarea id="description" placeholder="Paste Case Description Details" @keyup="checkDescription"></textarea>
            <br>
    </div>
    <div data check-list>
        <div id="owner" :class="owner ? 'good' : 'bad'">Case Owner: <span :class="owner ? 'fa-regular fa-circle-check' : 'fa-regular fa-circle-xmark'"></span></div>
        <div id="status" :class="status ? 'good' : 'bad'">Status: <span :class="status ? 'fa-regular fa-circle-check' : 'fa-regular fa-circle-xmark'"></span></div>
        <div id="reason" :class="reason ? 'good' : 'bad'">Case Reason: <span :class="reason ? 'fa-regular fa-circle-check' : 'fa-regular fa-circle-xmark'"></span></div>
        <div id="issue" :class="issue ? 'good' : 'bad'">Issue: <span :class="issue ? 'fa-regular fa-circle-check' : 'fa-regular fa-circle-xmark'"></span></div>
        <div id="description" :class="description ? 'good' : 'bad'">Description: <span :class="description ? 'fa-regular fa-circle-check' : 'fa-regular fa-circle-xmark'"></span></div>
    </div>
</div>`,
    data() {
        return {
            owner: false,
            status: false,
            reason: false,
            issue: false,
            description: false
        }
    },
    methods: {
        checkOwner() {
            let value = document.getElementById('owner').value;
            console.log(value);
            if ((/^[\s]?New[\s\_\-]Unsolved[\s\_\-]Bugs/i).test(value)) {
                this.owner = true;
            } else {
                this.owner = false;
            }
        },
        checkStatus() {
            let value = document.getElementById('status').value;
            if ((/^[\s]?open/i).test(value)) {
                this.status = true;
            } else {
                this.status = false;
            }
        },
        checkReason() {
            let value = document.getElementById('reason').value;
            if ((/^[\s]?software/i).test(value)) {
                this.reason = true;
            } else {
                this.reason = false;
            }
        },
        checkIssue() {
            let value = document.getElementById('issue').value;
            if ((/^[\s]?bug[ ]?\-[ ]?parent/i).test(value)) {
                this.issue = true;
            } else {
                this.issue = false;
            }
        },
        checkDescription() {
            let value = document.getElementById('description').value;
            if ((/\*\*LOCATION\:\*\*/g).test(value)) {
                this.description = true;
            } else {
                this.description = false;
            }
        }
    }
});

app.mount('#app');