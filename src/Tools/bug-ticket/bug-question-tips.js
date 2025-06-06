/**
 * @module bug-question-tips
 * @description This module contains the tips for the bug ticket questions.
 */

export default {
    name: 'bug-question-tips',
    template: `
        <div style="margin: 10px auto; width: 217px;">
            <button class="btn secondary sf-tips" @click="handleShowTips">
                Salesforce Bug Calculator Tips
            </button>
        </div>
        <div id="salesforce-bug-calc-tips" v-if="showTips">
            <span class="close" @click="handleShowTips">X</span>
            <h3 style="color: #f00;">These are just helpful suggestions to consider and not exact points. If you have concerns of a bug please consult with Support Leadership about how things should be answered.</h3>
            <div class="question-wrapper">
                <div class="question-title" @click="handleTipToggle">
                    Shoppers Affected?
                </div>
                <div class="question-suggestion">
                    This question refers to when the issue that is happening is affecting the ability for a stores customers to accomplish tasks that are designed for their interaction.
                    <ul>
                        <div>Example Scenarios</div>
                        <li>Links not going where they should</li>
                        <li>Add to Cart Buttons not working</li>
                        <li>Incorrect funds getting charged</li>
                    </ul>
                </div>
            </div>
            <div class="question-wrapper">
                <div class="question-title" @click="handleTipToggle">
                    Incorrect Data?
                </div>
                <div class="question-suggestion">
                    This question refers to seeing issues where either data doesn't match or isn't displaying/acting as expected.
                    <ul>
                        <div>Example Scenarios</div>
                        <li>Reports not displaying data correctly (missing transactions or not totalling values)</li>
                        <li>Saved Values are not displaying in area's where they are expected</li>
                    </ul>
                </div>
            </div>
            <div class="question-wrapper">
                <div class="question-title" @click="handleTipToggle">
                    Currently in Beta?
                </div>
                <div class="question-suggestion">
                    This question refers to if the area being reported is a new part of the system that is still in beta.
                    <ul>
                        <div>Example Scenarios</div>
                        <li>A new module is developed and there is an issue saving data in it</li>
                        <li>A new report isn't displaying data correctly</li>
                    </ul>
                </div>
            </div>
            <div class="question-wrapper">
                <div class="question-title" @click="handleTipToggle">
                    Is Inventory Affected?
                </div>
                <div class="question-suggestion">
                    This question refers to if the issue is affecting the way the system handles/handled inventory.
                    <ul>
                        <div>Example Scenarios</div>
                        <li>A transaction that was completed didn't remove inventory</li>
                        <li>Adding a serial number duplicated it in the system</li>
                        <li>The issue incorrectly recorded the amount of inventory adjusted</li>
                    </ul>
                </div>
            </div>
            <div class="question-wrapper">
                <div class="question-title" @click="handleTipToggle">
                    Money: Collecting Incorrect Amounts?
                </div>
                <div class="question-suggestion">
                    This question refers to the system not collecting funds in the amounts it should.
                    <ul>
                        <div>Example Scenarios</div>
                        <li>A completed transaction says it was for $15, but processing shows it captured lower or higher than the amount it should</li>
                        <li>An Authorized web order shows a different authorized amount than what it is attempting to capture before the customer has made changes to the order.</li>
                    </ul>
                </div>
            </div>
            <div class="question-wrapper">
                <div class="question-title" @click="handleTipToggle">
                    Prevention of Saving in Key Areas?
                </div>
                <div class="question-suggestion">
                    This question refers to the system having issues saving data. Key area's are area's that a user of the system either manually makes a change or would expect to see a change based on input from the user.
                    <ul>
                        <div>Example Scenarios</div>
                        <li>Saving a product but the title doesn't update even after a successful save</li>
                        <li>Clicking the save button on the settings page gets an error</li>
                        <li>Saved data in a product looks correct on the product page, but isn't reflected on the website</li>
                    </ul>
                </div>
            </div>
            <div class="question-wrapper">
                <div class="question-title" @click="handleTipToggle">
                    Suitable workaround Available?
                </div>
                <div class="question-suggestion">
                    This question refers to whether or not there is another way for the customer to accomplish what the issue is preventing them from doing that doesn't go outside of the bounds of the system.
                </div>
            </div>
            <div class="question-wrapper">
                <div class="question-title" @click="handleTipToggle">
                    Is reproducible?
                </div>
                <div class="question-suggestion">
                    This question refers to if you can consistently reproduce the issue happening.
                    <ul>
                        <div>Example Scenarios</div>
                        <li>Every time a specific character is saved in a field an error message appears</li>
                        <li>Loading a specific day in the report shows incorrect data</li>
                    </ul>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            tips: [],
            showTips: false
        }
    },
    methods: {
        handleShowTips() {
            this.showTips = !this.showTips;
        },
        handleTipToggle(event) {
            if(event.target.nextElementSibling.classList.contains('show')){
                event.target.nextElementSibling.classList.remove('show');
            } else {
                document.querySelector('.question-suggestion.show')?.classList.remove('show');
                event.target.nextElementSibling.classList.add('show');
            }
        }
    }
}