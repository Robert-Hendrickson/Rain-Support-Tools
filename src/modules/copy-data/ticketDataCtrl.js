/**
 * @module copy-data/ticketDataCtrl
 * @description This module is used to copy the ticket data to the clipboard.
 */
import customDialogue from '/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.js';
import {GrowlCtrl} from '/Rain-Support-Tools/src/modules/growl-ctrl/growl-ctrl.js';

export default {
    name: 'ticketDataCtrl',
    components: {
        GrowlCtrl
    },
    template: `
        <div id="ticket-container" v-show="showTicketContainer">
            <div id="ticket-data-container">
                <textarea ref="ticketData" v-model="this.$props.ticketData" autofocus></textarea>
                <div ticket-buttons>
                    <button style="float: left;" class="btn tertiary" @click="resetTicket">New Case</button>
                    <button class="btn secondary" @click="this.showTicketContainer = false">Close</button>
                    <button class="btn primary copy-btn" @click="copyTicket">Copy</button>
                </div>
            </div>
            <growl-ctrl ref="growlCtrl"></growl-ctrl>
        </div>`,
    props: {
        ticketData: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            showTicketContainer: false
        }
    },
    methods: {
        copyTicket() {
            try {
                // Get the text field
                const copyText = this.$refs.ticketData;
            
                // Select the text field
                copyText.select();
                copyText.setSelectionRange(0, 99999); // For mobile devices
            
                // Copy the text inside the text field
                navigator.clipboard.writeText(copyText.value);
                this.$refs.growlCtrl.updateGrowl({
                    message: 'Ticket data copied to clipboard',
                    type: 'success'
                });
            } catch (err) {
                console.error('Failed to copy ticket data', err);
                this.$refs.growlCtrl.updateGrowl({
                    message: 'Failed to copy ticket data. Please try again.',
                    type: 'error'
                });
            }
        },
        async resetTicket() {
            if (await customDialogue('Are you sure you want to reset the ticket? This action is not reversible.', "Reset", "Cancel")) {
                this.$emit('reset-ticket');
            }
        }
    }
}