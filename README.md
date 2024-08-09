# Rain-Support-Tools
A set of tools that I built to help our support team in being able to consolidate information for consistency and use for testing purposes
Riley page was pulled from this link: https://codepen.io/trajektorijus/pen/mdeBYrX


# Common used components
    <!--common css-->
    <link rel="stylesheet" href="/Rain-Support-Tools/common/actions/popup.css" />
    <!--common js scripts-->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="/Rain-Support-Tools/js/test_data.js"></script>
    <script src="/Rain-Support-Tools/common/actions/popup.js"></script>
    <script src="https://kit.fontawesome.com/8e52a98e38.js" crossorigin="anonymous"></script>
    <script src="/Rain-Support-Tools/common/flow-format/flow-ctrl.js"></script>

## cookie control functions
    <script src="\Rain-Support-Tools\common\ctrl\cookie_ctrl.js"></script>

## custom dialog modal script import
    <script src="/Rain-Support-Tools/modules/dialog-ctrl.js"></script>

# flow build containers
## nav html
    <div class="menu-wrapper">
        <div onclick="toggleNav()" id="nav-toggle">
            <span class="fa-solid fa-bars"></span>
        </div>
        <nav-menu></nav-menu>
        <script src="/Rain-Support-Tools/js/nav-builder.js"></script>
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
        <button prev class="btn secondary hide" style="font-size: 12px;" onclick="previousStep()">Previous</button>
        <button class="btn primary hide" finish style="float: right;" onclick="validateData()">Finish</button>
        <button class="btn primary" next style="float: right;" onclick="validateData()">Next</button>
    </div>

## error container and ticket container
### ticket container
    <div id="ticket-container" class="hide">
        <div>
            <textarea></textarea>
            <div ticket-buttons>
                <button style="float: left;" class="btn terciary" onclick="start_new_ticket()">New Case</button>
                <button class="btn secondary" onclick="$('#ticket-container').addClass('hide')">Close</button>
                <button class="btn primary" onclick="copyTicket()">Copy</button>
            </div>
        </div>
    </div>
### error container
    <div id="error_message" class="hide"></div>