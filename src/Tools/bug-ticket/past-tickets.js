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
            <div v-for="(ticket, date) in pastTickets" :key="date" class="past-ticket-wrapper">
                <div class="past-ticket-item" @click="openPastTicket(ticket)">
                    {{ dateFormatter(date) }}<br>CRM: {{ ticket.crm ? ticket.crm : ticket.step1.store_id }}<br>Description: {{ ticket.description ? ticket.description : ticket.step3 }}
                </div>
                 <div class="past-ticket-delete">
                    <button class="btn tertiary fa fa-trash" @click="deletePastTicket(date)"></button>
                 </div>
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
        },
        saveTicket(data){
            let now = Date.now();
            cookieCtrl.setCookie(`bug_${now}`,JSON.stringify(data));
            this.pastTickets[now] = data;
            this.pastTicketsLength++;
        },
        openPastTicket(data){
            let ticket = this.processPastTicket(data);
            this.$emit('open-past-ticket', ticket);
        },
        updateSteps(data){
            let step2_data = '';
            for(let step in data.steps) {
                step2_data += `Step ${step.split('_')[1]}. ${data.steps[step]}\n`;
            }
            return step2_data;
        },
        updateImages(data){
            let image_data = '';
            for(let image in data.images) {
                image_data += `[Screenshot_${image.split('_')[1]}](${data.images[image]})\n\n`;
            }
            return image_data;
        },
        updateVideos(data){
            let video_data = '';
            for(let video in data.videos) {
                video_data += `[Video_${video.split('_')[1]}](${data.videos[video]})\n\n`;
            }
            return video_data;
        },
        processPastTicket(data){
            if(Object.keys(data).includes('step1')){
                return data;
            } else {
                let updated_data = {
                    step1: {
                        tech: data.supportRep,
                        store: data.storeName,
                        store_id: data.crm,
                        area: data.area,
                        replicable: data.replicable,
                        where: data.where.split('\n')[1].split(' and ')
                    },
                    step2: this.updateSteps(data),
                    step3: data.description,
                    step4: {
                        images: this.updateImages(data),
                        videos: this.updateVideos(data)
                    },
                    step5: {
                        examples: data.examples,
                        errors: data.errors
                    }
                }
                return updated_data;
            }
        }
    }
}