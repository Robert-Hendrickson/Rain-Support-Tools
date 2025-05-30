import cookieCtrl from '/Rain-Support-Tools/src/common/ctrl/cookie_ctrl.js';
import customDialogue from '/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.js';
export default {
    name: 'past-tickets-ctrl',
    template: `
    <div id="past-ticket-container" v-if="pastTicketsLength > 0">
        <div id="list-toggle" @click="showPastTickets = !showPastTickets">
            {{ pastTicketsLength }}
        </div>
        <div class="past-tickets-container" :class="{'active': showPastTickets}">
            <div v-for="(ticket, date) in pastTickets" :key="date">
                <span class="close" @click="deletePastTicket(date)"></span>
                {{ dateFormatter(date) }}<br>CRM: {{ ticket.crm }}<br>Description: {{ ticket.description }}</div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            pastTickets: {},
            pastTicketsLength: 0,
            showPastTickets: false
        }
    },
    mounted() {
        this.getPastTickets();
        this.pastTicketsLength = Object.keys(this.pastTickets).length;
    },
    methods: {
        getPastTickets() {
            let bug_array = document.cookie.split('; ').filter((value) => (/^bug\_\d+/).test(value));
            for(let i = 0; i < bug_array.length; i++){
                let bug_data = bug_array[i].split('=')[1];
                let bug_date = bug_array[i].split('=')[0].split('_')[1];
                this.pastTickets[bug_date] = JSON.parse(bug_data);
            }
            console.log(this.pastTickets);
        },
        dateFormatter(date) {
            return new Date(parseInt(date)).toString().substring(0,24);
        },
        async deletePastTicket(date) {
            if (await customDialogue('Delete this past ticket?')) {
                delete this.pastTickets[date];
                this.pastTicketsLength = Object.keys(this.pastTickets).length;
                cookieCtrl.deleteCookie(`bug_${date}`);
            }
        }
    }
}