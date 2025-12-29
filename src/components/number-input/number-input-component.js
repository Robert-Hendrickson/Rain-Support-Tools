export const numberInputComponent = {
    name: 'number-input-component',
    template: `
    <div class="component-container">
        <label
        v-if="label && id"
        :for="id"
        :title="title"
        :class="{'note-wrapper': title}"
        >{{ label }}<span v-if="title" class="fa-solid fa-question" /></label>
        <input
        :id="id"
        :placeholder="placeholder"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :value="value"
        :tabindex="tabindex"
        @change="handleInput"
        type="number" />
    </div>
    `,
    props: {
        placeholder: {
            type: String,
            required: false,
        },
        value: {
            type: Number,
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
        min: {
            type: Number,
            required: false,
        },
        max: {
            type: Number,
            required: false,
        },
        tabindex: {
            type: String,
            required: false,
        },
        step: {
            type: Number,
            required: false,
            default: 1,
        },
    },
    methods: {
        handleInput(event) {
            this.$emit('updateValue', event.target.value);
        },
    }
}
