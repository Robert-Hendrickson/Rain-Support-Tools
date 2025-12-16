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
            @change="handleInput"
        >
            <option v-if="startOption" :value="">{{ startOption }}</option>
            <option v-for="value in values" :key="value" :value="value">{{ value }}</option>
        </select>
    </div>
    `,
    props: {
        values: {
            type: Array,
            required: true,
        },
        startOption: {
            type: String,
            required: false,
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
    },
    methods: {
        handleInput(event) {
            this.$emit('updateValue', event.target.value);
        },
    }
}
