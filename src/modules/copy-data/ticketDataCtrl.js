/**
 * @module copy-data/ticketDataCtrl
 * @description This module is used to copy the ticket data to the clipboard.
 */
import customDialogue from '/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.js';

export default {
    name: 'ticketDataCtrl',
    template: `
        <div id="ticket-container" v-show="showTicketContainer">
            <div>
                <textarea ref="ticketData" v-model="this.$props.ticketData" autofocus></textarea>
                <div ticket-buttons>
                    <button style="float: left;" class="btn tertiary" @click="resetTicket">New Case</button>
                    <button class="btn secondary" @click="this.showTicketContainer = false">Close</button>
                    <button class="btn primary copy-btn" @click="copyTicket">Copy</button>
                </div>
            </div>
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
            // Get the text field
            const copyText = this.$refs.ticketData;
        
            // Select the text field
            copyText.select();
            copyText.setSelectionRange(0, 99999); // For mobile devices
        
            // Copy the text inside the text field
            navigator.clipboard.writeText(copyText.value);
        },
        async resetTicket() {
            if (await customDialogue('Are you sure you want to reset the ticket? This action is not reversible.', "Reset", "Cancel")) {
                this.$emit('reset-ticket');
            }
        }
    }
}