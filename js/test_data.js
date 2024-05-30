function setTestData(){
    let path = location.pathname;
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
    if(path.match(/email-list-checker/)){
        $('.inputList > textarea')[0].value = '13528849392@163.com\naebarlow@ucdavis\nbjt@lcc-inc.cim\nbunsterof3@hotmailcom\nCathyVan910@icloud.co\ncrrwebinfo@gmail.co\ndrosas916@gmailcom\nGrandmagerry @sncglobal.net\njeanmail@earthlink.net; JKNIESE@COMCAST.NET\njholmes@221bbakerstreet\njlarson67rsss@icloud.om\njoy@blackcat@amas.com\nkdeliramich@yahoo.co\nkleger@csu@chico.edu\nlauramara@peoplepc.co\nMickeys54@gmail\nmmpblack@yahoo .com\nmomofbnw@yahoo.co\nmotomxmarissa@gmail.co\nnrloezburton@ucdavisedu\nPurtillk@yahoo.cm\nrbconnelly@frontiernetnet\nrosemu@sbcglobal.et\nsandraross6051@sbcglobalnet\nsensei@pinewood Kante.com\nsflynn6892@aol.co\nslfillo77@gmail.co\nsmccutler@gmail.om\nsnowbird86@hotmail.co\nsofiab@sbservices.co\ntboyd8@yahoo\nunionhackett@comcast..net\nwestcoastwool@gmail.co\nwunderwomen2@hotmail\nyas2@say@aol.com';
    }
    if(path.match(/bug-ticket-v2/)){
        $('#crm')[0].value = '6085';
        $('#systemArea')[0].value = 'till';
        $('[replicable="yes"]')[0].click();
        $('#steps-table tr input').each(function (){
            $(this)[0].value = 'test step';
        });
        $('#description')[0].value = 'test description';
        $('#expected')[0].value = 'test expectation';
        $('#links-content tr input').each(function (index){
            $(this)[0].value = 'https://drive.google.com/file/d/test/view?' + index;
        });
        $('#examples')[0].value = 'robstestsite.com';
        $('#errors')[0].value = 'No errors';
    }
}
$(window).ready(function(){
    if(location.href.match('localhost')){
        setTestData();
    }
});