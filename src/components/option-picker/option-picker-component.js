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
            <div v-for="option in options" :key="option" :class="{'selected': value.includes(option)}" @click="handleOptionClick(option)">{{ option }}</div>
        </div>
    </div>
    `,
    props: {
        options: {
            type: Array,
            required: true,
        },
        value: {
            type: Array,
            required: false,
            default: [],
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
    methods: {
        handleOptionClick(option) {
            if (this.multiSelect) {
                this.multiSelectHandler(option);
            } else {
                this.updateSelectedValues([option]);
            }
        },
        multiSelectHandler(option) {
            let newValue;
            if (this.value.includes(option)) {
                newValue = this.value.filter(item => item !== option);
            } else {
                newValue = [...this.value, option];
            }
            this.updateSelectedValues(newValue);
        },
        updateSelectedValues(newValue) {
            this.$emit('updateValue', newValue);
        }
    }
}
