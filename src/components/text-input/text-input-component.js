export const textInputComponent = {
    name: 'text-input-component',
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
            :disabled="disabled"
            :value="value"
            @change="handleInput"
            type="text"
        />
    </div>
    `,
    props: {
        placeholder: {
            type: String,
            required: false,
        },
        value: {
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
    },
    methods: {
        handleInput(event) {
            this.$emit('updateValue', event.target.value);
        },
    }
}
