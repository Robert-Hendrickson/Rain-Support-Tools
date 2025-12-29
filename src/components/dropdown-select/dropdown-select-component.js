export const dropdownSelectComponent = {
    name: 'dropdown-select-component',
    template: `
    <div class="component-container">
        <label
        v-if="label && id"
            :for="id"
            :title="title"
            :class="{'note-wrapper': title}"
        >{{ label }}<span v-if="title" class="fa-solid fa-question" /></label>
        <select
            :id="id"
            :disabled="disabled"
            :tabindex="tabindex"
            @change="handleInput"
        >
            <option v-if="emptyOption" value="" disabled :selected="passedValueIsUsable">{{ emptyOption }}</option>
            <option v-for="option in options" :key="option" :value="option" :selected="value === option">{{ option }}</option>
        </select>
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
        emptyOption: {
            type: String,
            required: false,
            default: '',
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
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
        tabindex: {
            type: String,
            required: false,
        }
    },
    computed: {
        passedValueIsUsable() {
            return !this.options.includes(this.value) || this.value === '';
        },
    },
    methods: {
        handleInput(event) {
            this.$emit('updateValue', event.target.value);
        },
    }
}
