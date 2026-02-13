/**
 * @description Main script for bandwidth-errors tool, defines the Vue app and its template.
 */
//import the error list
import { errorList } from './error-list.js';
import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
//create the Vue app
const app = createApp({
    //define the template
    template: `<div v-for="errorType in filteredErrorTypes" class="error-list">
    <h2>{{errorType.name}}</h2>
    <div id="column-headers">
        <div>Code</div>
        <div>Description</div>
        <div>Friendly Description</div>
        <div>Explanation Of Error</div>
    </div>
    <div v-for="error in filteredErrors(errorType.errors)" class="row-wrapper">
        <div>{{error.code}}</div>
        <div>{{error.description}}</div>
        <div>{{error.friendlyDescription}}</div>
        <div>{{error.explanationOfError}}</div>
    </div>
</div>
<div v-if="Object.entries(filteredErrorTypes).length === 0">No errors found</div>`,
    //define the data
        data(){
        return {
            errorList: errorList,
            searchValue: '',
        }
    },
    //define the computed properties
    computed: {
        filteredErrorTypes() {
            return Object.entries(this.errorList)
                .filter(([name, type]) => this.filteredErrors(type.errors).length > 0)
                .reduce((acc, [name, type]) => {
                    acc[name] = type;
                    return acc;
                }, {});
        }
    },
    //define the methods
    methods: {
        updateErrorSearch(value){
            this.searchValue = value;
        },
        filteredErrors(errors) {
            if (!this.searchValue) return errors;

            const regex = new RegExp(this.searchValue.replaceAll(' ','|'), 'i');
            return errors.filter(error =>
                regex.test(error.code) ||
                regex.test(error.description) ||
                regex.test(error.friendlyDescription) ||
                regex.test(error.explanationOfError)
            );
        }
    }
});
document.addEventListener('DOMContentLoaded', function() {
    //mount the app
    window.vm = app.mount('error-list');
    //add the event listener to the searchbar
    document.getElementById('searchbar').addEventListener('change', function(){
        vm.updateErrorSearch(this.value);
    });
});