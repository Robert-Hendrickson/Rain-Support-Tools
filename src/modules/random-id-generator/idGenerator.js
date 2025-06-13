export default {
    name: 'id-generator',
    methods: {
        generateUniqueId() {
            return Symbol(++this.idCounter).description;
        }
    },
    data() {
        return {
            idCounter: 0
        }
    }
}