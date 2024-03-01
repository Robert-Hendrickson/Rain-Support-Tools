function setTestData(){
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
    //$('textarea#example_input')[0].value = 'test';
    $('textarea#expectation_input')[0].value = 'test';
    $('textarea#console_input')[0].value = 'test';
    $('textarea#description_input')[0].value = 'test';
}
$(window).ready(function(){
    if(location.href.match('localhost')){
        setTestData();
    }
});