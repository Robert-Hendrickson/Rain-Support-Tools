import addRecords from './add-records.js';
import correctRecords from './correct-records.js';
import removeRecords from './remove-records.js';
export default {
    name: 'step-2',
    components: {
        addRecords,
        correctRecords,
        removeRecords
    },
    props: {
        step: {
            type: Number,
            required: true
        },
        actions: {
            type: Object,
            required: true
        },
        domain: {
            type: String,
            required: true
        }
    },
    template: `
    <div data="2" :class="{'active': step === 2, 'in-active': step < 2, 'complete': step > 2}">
        <add-records 
        ref="addRecords" 
        :actions="actions.add_record" 
        :domain="domain"
        ></add-records>
        <correct-records 
        ref="correctRecords" 
        :actions="actions.correct_record" 
        :domain="domain"
        ></correct-records>
        <remove-records 
        ref="removeRecords" 
        :actions="actions.remove_record" 
        :domain="domain"
        ></remove-records>
    </div>`,
    data() {
        return {
            add_record: [],
            correct_record: [],
            remove_record: []
        }
    },
    methods: {
        getData(resolve) {
            this.add_record = [...this.$refs.addRecords.add_record];
            this.correct_record = [...this.$refs.correctRecords.correct_record];
            this.remove_record = [...this.$refs.removeRecords.remove_record];
            resolve({
                success: true,
                data: {
                    add_record: [...this.add_record],
                    correct_record: [...this.correct_record],
                    remove_record: [...this.remove_record]
                }
            });
        },
        checkActions(){
            console.log(this.actions);
        }
    }
}