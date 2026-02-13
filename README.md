# Rain-Support-Tools
A set of tools that I built to help our support team in being able to consolidate information for consistency and use for testing purposes

# Common used components
    <!--common css-->
    <!--common js scripts-->
    <script src="/Rain-Support-Tools/src/common/vue/vue.global.prod.js"></script>
    <script src="/Rain-Support-Tools/src/common/testing/test_data.js"></script>
    <script src="https://kit.fontawesome.com/8e52a98e38.js" crossorigin="anonymous"></script>

## cookie control functions
    import cookieCtrl from '/Rain-Support-Tools/src/common/ctrl/cookie_ctrl.js';
    import sets an object with below methods included functions
    setCookie(cookie_name,cookie_value,cookie_life_length = 7)
    //cookie_name = string for name of cookie
    //cookie_value = any value to be saved with the cookie
    //cookie_life_length = number for the length of time in days the cookie should exist, defaults to 7 days
    getCookie(cookie_name) //returns data for the named cookie
    deleteCookie(cookie_name) //deletes the cookie with the specific name

## custom dialog modal script import
    <link rel="stylesheet" href="/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.css" />
    <script src="/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.js"></script>

    Can be used to request input from the user before moving forward. If being used inside a function the function needs the 'async' keyword added to it. The function returns a promise that is either true or false. Parameters include a text string for display message, text string for the True response with a default of "OK", and a text string for the False response with a default of "Cancel".

    async function(){
        if(thing){
            let custom_dialogue = await import('/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.js');
            if(await custom_dialogue.default(
                text_string_content,
                submit_button = "OK",
                close_button = 'Cancel'
                )
            ){
                //do this
            }
        }
    }

## banner updates
    <script src="/Rain-Support-Tools/src/common/ctrl/banner_updates.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            buildBanner(
        [
            header_title = string,
            banner_text = string,
            banner_id = string
        ],
        start_date_object = '8/10/2024',
        end_date_object = '8/10/2024'
        );
        });
    </script>

## regex checking module
### module has predefined common options, also has a function that can add specific patterns for use
window.regexController = (await import('/Rain-Support-Tools/src/modules/regex-patterns/patterns.js')).regexController;
//add patterns to the patterns object
regexController.addPattern({{string-title}}, {{regexPattern}});
# flow build containers
## nav html
    <div class="menu-wrapper">
        <nav-menu></nav-menu>
        <script src="/Rain-Support-Tools/src/common/navigation/nav-builder.js" type="module"></script>
    </div>

## add steps as needed and give an id that matches the container area
    <div id="info-tabs">
        <div id="basic-tab" step="1" class="active">
            <div class="step-circle">1</div>
            Basic
        </div>
        <div id="steps-tab" step="2">
            <div class="step-circle">2</div>
            Steps
        </div>
        <div id="description-tab" step="3">
            <div class="step-circle">3</div>
            Desc./Exp
        </div>
        <div id="links-tab" step="4">
            <div class="step-circle">4</div>
            Screenshots
        </div>
        <div id="examples-errors-tab" step="5">
            <div class="step-circle">5</div>
            Examples
        </div>
    </div>
## container html that connects to a tab step
    <div class="container content">
        <div id="basic-content" data="1"  class="active">
            {{inner html}}
        </div>
        <div id="steps-content" data="2" class="in-active">
            {{inner html}}
        </div>
    </div>

## flow controls
    <flow-ctrl-app
    ref="flowCtrlApp"
    :max-step="5"
    @step-change-request="{{checkfunction}}"
    @step-changed="handleNextStep"
    @previous-step="handlePreviousStep"
    @finish="handleFinish">
    </flow-ctrl-app>
# the buttons have an onclick event that calls a function set in /src/common/flow-format/flow-ctrl-app.js file
# {{checkfunction}} will have a promise passed as a parameter that will need to be resolved so the steps can move forward (returns an object {Success: boolean})

## error container and ticket container
### ticket container /ticketDataCtrl.js
    <ticket-data-ctrl ref="ticketDataCtrl"
    :ticket-data="ticketData"
    @reset-ticket="handleResetTicket"></ticket-data-ctrl>
# ticketData is a passed in Prop. type string, this opens and displays the ticket modal with the functionality built in
### error container
    /src/modules/error-popup/errorCtrl.js
    used as a component, can access component to use methods and data points to display error info
    data: error_object: {},
    Methods:
        updateErrorObject(error_list),
        closeErrorDisplay()