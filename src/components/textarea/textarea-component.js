export const textareaComponent = {
    name: 'textarea-component',
    template: `
    <div class="component-container">
        <label
            v-if="label && id"
            :for="id"
            :title="title"
            :class="{'note-wrapper': title}"
        >{{ label }}<span v-if="title" class="fa-solid fa-question" /></label>
        <textarea
            :id="id"
            :placeholder="placeholder"
            :disabled="disabled"
            :style="textareaStyles"
            :maxlength="maxLength"
            :spellcheck="spellcheck"
            :value="value"
            :tabindex="tabindex"
            @change="handleInput"
        ></textarea>
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
            required: false,
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
        height: {
            type: String,
            required: false,
        },
        width: {
            type: String,
            required: false,
        },
        maxLength: {
            type: Number,
            required: false,
        },
        resize: {
            type: String,
            required: false,
            default: 'auto',
        },
        spellcheck: {
            type: Boolean,
            required: false,
            default: true,
        },
        tabindex: {
            type: String,
            required: false,
        },
    },
    computed: {
        textareaStyles() {
            let styles = '';
            if (this.resize) {
                styles += `resize: ${this.resize};`;
            }
            if (this.height) {
                styles += `height: ${this.height};`;
            }
            if (this.width) {
                styles += `width: ${this.width};`;
            }
            return styles;
        },
    },
    methods: {
        handleInput(event) {
            this.$emit('updateValue', event.target.value);
        },
    }
}
