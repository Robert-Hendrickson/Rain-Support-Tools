# Rain-Support-Tools
A set of tools that I built to help our support team in being able to consolidate information for consistency and use for testing purposes
Riley page was pulled from this link: https://codepen.io/trajektorijus/pen/mdeBYrX


# Common used components
    <!--common css-->
    <!--common js scripts-->
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="/Rain-Support-Tools/src/common/testing/test_data.js"></script>
    <script src="https://kit.fontawesome.com/8e52a98e38.js" crossorigin="anonymous"></script>
    <script src="/Rain-Support-Tools/src/common/flow-format/flow-ctrl.js"></script>

## cookie control functions
    <script src="\Rain-Support-Tools\src\common\ctrl\cookie_ctrl.js"></script>

    included functions
    setCookie(cookie_name,cookie_value,cookie_life_length = 7)
    //cookie_name = string for name of cookie
    //cookie_value = any value to be saved with the cookie
    //cookie_life_length = number for the length of time in days the cookie should exist, defaults to 7 days
    getCookie(cookie_name)
    deleteCookie(cookie_name)

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
import { validatePattern, addPattern, patterns } from '/Rain-Support-Tools/src/modules/regex-validator/regex-validator.js';
window.validatePattern = validatePattern;
window.patterns = patterns;
# flow build containers
## nav html
    <div class="menu-wrapper">
        <div id="nav-toggle">
            <span class="fa-solid fa-bars"></span>
        </div>
        <nav-menu></nav-menu>
        <script src="/Rain-Support-Tools/src/common/navigation/nav-builder.js"></script>
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
    <div flow-controls>
        <button prev class="btn secondary hide" style="font-size: 12px;">Previous</button>
        <button class="btn primary hide" finish style="float: right;">Finish</button>
        <button class="btn primary" next style="float: right;">Next</button>
    </div>
# the buttons have an onclick event that calls a function set in /src/common/flow-format/flow-ctrl.js file
# next and finish buttons call function validateData()
# previous button calls function previousStep()

## error container and ticket container
### ticket container
    <div id="ticket-container" class="hide">
        <div>
            <textarea></textarea>
            <div ticket-buttons>
                <button style="float: left;" class="btn tertiary">New Case</button>
                <button class="btn secondary">Close</button>
                <button class="btn primary copy-btn">Copy</button>
            </div>
        </div>
    </div>
# copy button has an onclick event that calls a function set in /src/common/copy-data/copy-data.js file
# New case button calls function start_new_ticket() defined in the tools js file
# Close button calls function document.getElementById('#ticket-container').classList.add('hide') defined in the tools js file

### add this into tool js file to import copy function
    document.querySelector('.copy-btn').addEventListener('click', async () =>{
        const copyText =  await import('/Rain-Support-Tools/src/modules/copy-data/copy-data.js');
        copyText.default(document.querySelector({{target element to copy from}}));
    });
### error container
    /src/modules/error-popup/popup.js
    make sure function to display the error message has async and then use these in the beginning for setup.
    //will clear any previous error message
    if(document.getElementById('error_message')) {
        document.getElementById('error_message').remove();
    }
    //will import the error popup module
    let error_popup = await import('../../modules/error-popup/popup.js');
    
    //prep an object for any potential errors
    let bad_object = {
        type: 'generate',
        list: {}
    };
    //list can be hold as many errors as needed
    bad_object.list['unique title'] = 'Make sure to select at least one place where replication happened.';
    //then call the function to display the error message
    error_popup.default(bad_object);