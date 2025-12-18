export const optionPickerComponent = {
    name: 'option-picker-component',
    template: `
    <div class="component-container">
        <label
            v-if="label && id"
            :for="id"
            :title="title"
            :class="{'note-wrapper': title}"
        >{{ label }}<span v-if="title" class="fa-solid fa-question" /></label>
        <div class="choice-selector">
            <div v-for="option in options" :key="option" :class="{'selected': selectedOptions.includes(option)}" @click="handleOptionClick(option)">{{ option }}</div>
        </div>
    </div>
    `,
    props: {
        options: {
            type: Array,
            required: true,
        },
        value: {
            type: String,
            required: false,
            default: '',
        },
        multiSelect: {
            type: Boolean,
            required: false,
            default: false,
        },
        id: {
            type: String,
            required: false,
        },
        label: {
            type: String,
            required: false,
        },
        title: {
            type: String,
        },
    },
    data() {
        return {
            selectedOptions: [],
        }
    },
    methods: {
        handleOptionClick(option) {
            if (this.multiSelect) {
                this.multiSelectHandler(option);
            } else {

                this.selectedOptions = [option];
                this.updateSelectedValues();
            }
        },
        multiSelectHandler(option) {
            if (this.selectedOptions.includes(option)) {
                this.selectedOptions = this.selectedOptions.filter(item => item !== option);
            } else {
                this.selectedOptions.push(option);
            }
            this.updateSelectedValues();
        },
        updateSelectedValues() {
            this.$emit('updateValue', this.selectedOptions);
        }
    }
}
