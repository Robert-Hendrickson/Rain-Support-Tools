/*this file is used in defining values for tools for testing purposes*/
/*function sets test data based on the page being seen*/
function setTestData(){
    //get page name from url pathname
    let path = location.pathname;
    //test values for site-fix page(replaced by site-work page)
    if(path.match(/site-fix/)){
        $('input#crm_input')[0].value = '6085';
        $('input#system_input')[0].value = 'test';
        let steps = $('div#steps-table tbody tr');
        for(i=0;i<steps.length;i++){
            steps[i].querySelector('td:nth-child(2) input').value = '1';
        }
        saveSteps();
        $('div#screenshot-table tbody td:nth-child(2) input')[0].value = 'drive.google.com/view1';
        saveScreenshots();
        $('div#video-table tbody td:nth-child(2) input')[0].value = 'drive.google.com/view2';
        saveVideos();
        $('textarea#example_input')[0].value = 'test';
        $('textarea#expectation_input')[0].value = 'test';
        $('textarea#console_input')[0].value = 'test';
        $('textarea#description_input')[0].value = 'test';
    };
    //test values for email-list-checker page
    if(path.match(/email-list-checker/)){
        $('.inputList > textarea')[0].value = '13528849392@163.com\naebarlow@ucdavis\nbjt@lcc-inc.cim\nbunsterof3@hotmailcom\nCathyVan910@icloud.co\ncrrwebinfo@gmail.co\ndrosas916@gmailcom\nGrandmagerry @sncglobal.net\njeanmail@earthlink.net; JKNIESE@COMCAST.NET\njholmes@221bbakerstreet\njlarson67rsss@icloud.om\njoy@blackcat@amas.com\nkdeliramich@yahoo.co\nkleger@csu@chico.edu\nlauramara@peoplepc.co\nMickeys54@gmail\nmmpblack@yahoo .com\nmomofbnw@yahoo.co\nmotomxmarissa@gmail.co\nnrloezburton@ucdavisedu\nPurtillk@yahoo.cm\nrbconnelly@frontiernetnet\nrosemu@sbcglobal.et\nsandraross6051@sbcglobalnet\nsensei@pinewood Kante.com\nsflynn6892@aol.co\nslfillo77@gmail.co\nsmccutler@gmail.om\nsnowbird86@hotmail.co\nsofiab@sbservices.co\ntboyd8@yahoo\nunionhackett@comcast..net\nwestcoastwool@gmail.co\nwunderwomen2@hotmail\nyas2@say@aol.com';
    }
    //test values for bug-ticket generator v2 page
    if(path.match(/bug-ticket-v2/)){
        $('#crm')[0].value = '6085';
        $('#systemArea')[0].value = 'till';
        $('[replicable="yes"]')[0].click();
        $('#steps-table tr input').each(function (){
            $(this)[0].value = 'test step';
        });
        $('#description')[0].value = 'test description';
        $('#links-content tr input').each(function (index){
            $(this)[0].value = 'https://drive.google.com/file/d/test/view?' + index;
        });
        $('#examples')[0].value = 'robstestsite.com';
        $('#errors')[0].value = 'No errors';
    }
    //test values for dns-help page
    if(RegExp(/dns\-help/).test(path)){
        $('#domain')[0].value = 'rainadmin.com';
        $('[choice-selector] div').each(function(){
            $(this).click();
        });
        $(`#add-record-table tbody`).append(`<tr>
            <td>
                <span class="row-delete">X</span>
            </td>
            <td>
                Type:<br>
                <div class="data-input">TXT</div>
            </td>
            <td>
                Name:<br>
                <div class="data-input">@</div>
            </td>
            <td>
                Value:<br>
                <div class="data-input">_newdata</div>
            </td>
            <td style="width: 100px;">
                TTL:<br>
                <div class="data-input">3600</div>
            </td>
        </tr>`);
        $(`#correct-record-table tbody`).append(`<tr>
            <td>
                <span class="row-delete">X</span>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                Original Values
                            </td>
                            <td>
                                Type:<br>
                                <div class="data-input">MX</div>
                            </td>
                            <td>
                                Name:<br>
                                <div class="data-input">www</div>
                            </td>
                            <td>
                                Value:<br>
                                <div class="data-input">1 mail.host.com</div>
                            </td>
                            <td>
                                TTL:<br>
                                <div class="data-input">1200</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                New Values
                            </td>
                            <td>
                                Type:<br>
                                <div class="data-input">MX</div>
                            </td>
                            <td>
                                Name:<br>
                                <div class="data-input">www</div>
                            </td>
                            <td>
                                Value:<br>
                                <div class="data-input">2 mail.host1.com</div>
                            </td>
                            <td>
                                TTL:<br>
                                <div class="data-input">3600</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>`);
        $(`#remove-record-table tbody`).append(`<tr>
            <td>
                <span class="row-delete">X</span>
            </td>
            <td>
                Type:<br>
                <div class="data-input">SRV</div>
            </td>
            <td>
                Name:<br>
                <div class="data-input">www</div>
            </td>
            <td>
                Value:<br>
                <div class="data-input">1 24 445 host.server.net</div>
            </td>
            <td style="width: 100px;">
                TTL:<br>
                <div class="data-input">3600</div>
            </td>
        </tr>`);
    }
    //test values for site-work page
    if ((/site-work/).test(path)) {
        $('input#crm')[0].value = '6085';
        
    }
    //test values for database ticket
    if ((/database-ticket/.test(path))) {
        $('#businessName')[0].value = "Experience Test Site";
        $('#storeID')[0].value = "CRM12381";
        $('#vertical')[0].value = "Rain";
        $('#details')[0].value = 'Consignment ID 12345678 needs to be updated so that it has a correct status.';
        $('#ticketID')[0].value = '123456789';
        $('#storyLink')[0].value = 'https://app.shortcut.com/rainretail/story/310515';
        $('#agentName')[0].value = 'Robert Hendrickson';
        $('#ticketReason')[0].value = 'The customer is escalated over the issue.(First Last)';
    }
}
/*this waits for page to be finished loading, then checks if the page is on a test enviornment or if a test value was passed in the url. if either is true test values for the page are set from function parameters*/
$(window).ready(function(){
    if (location.href.match('localhost')) {
        setTestData();
    } else {
        if ((/^\?test$/).test(location.search) ){
            setTestData();
        }
    }
});