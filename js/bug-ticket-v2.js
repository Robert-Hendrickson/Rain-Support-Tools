function validateData(){
    let current_step = parseInt($('#info-tabs .active')[0].getAttribute('step'));
    switch (current_step) {
        case 1:
            let crm = $('#crm')[0].value != '' && $('#crm')[0].value.match(/^(?:[c|C][r|R][m|M])?\d{3,}$/);
            let system = $('#systemArea')[0].value != '' && $('#systemArea')[0].value.match(/^\w{4,}$/);
            let replicable = $('[replicable].selected').length;

            if(crm && system && replicable) {
                nextStep(current_step);
            } else {
                console.error('something is missing');
                //this will pass the elements that didn't succeed to another function to list the area's needing fixed before moving on
            };
            break;
        case 2:
            let number_of_steps = $('#steps-table tbody tr').length > 0;
            let steps_true = true;
            $('#steps-table tbody tr input').each(function (){
                if($(this)[0].value === null){
                    steps_true = false;
                }
            });
            if(number_of_steps && steps_true){
                nextStep(current_step);
            };
            break;
        case 3:
            let description = {
                el :$('#description')[0],
                value: true
            };
            let expected = {
                el: $('#expected')[0],
                value: true
            };
            if(description.el.value === '' || description.el.value.match(/^[n|N](?:\/|\\)?[a|A]/) != null){
                description.value = false;
            }
            if(expected.el.value === '' || expected.el.value.match(/^[n|N](?:\/|\\)?[a|A]/) != null){
                expected.value = false;
            }
            if(description.value && expected.value){
                nextStep(current_step);
            }
            break;
        case 4:
            let screenshot_ready = false;
            if($('#screenshot-table tr input').length > 0){
                screenshot_ready = true;
            }
            $('#screenshot-table tr input').each(function (){
                if($(this)[0].value === '' || $(this)[0].value.match(/^(?:https?:\/\/)?drive\.google\.com\/file\/d\/.*\/view(?:\?.+)?$/) === null){
                    screenshot_ready = false;
                }
            });
            let video_ready = false;
            if($('#video-table tr input').length > 0){
                video_ready = true;
            }
            $('#video-table tr input').each(function (){
                if($(this)[0].value === '' || $(this)[0].value.match(/^(?:https?:\/\/)?drive\.google\.com\/file\/d\/.*\/view(?:\?.+)?$/) === null){
                    video_ready = false;
                }
            });
            let duplicates = false;
            let link_list = '';
            $('#links-content tr input').each(function (){
                link_list += $(this)[0].value + ',';
            })
            $('#links-content tr input').each(function (){
                
                let temp_regex = new RegExp($(this)[0].value.replaceAll('?','\\\?'),'g');
                if(link_list.match(temp_regex).length > 1){
                    duplicates = true;
                }
            })
            if(screenshot_ready && video_ready && !duplicates){
                nextStep(current_step);
            };
            break;
        case 5:
            //check examples box
            let examples = $('#examples')[0].value;
            let examples_ready = true;
            if(examples.match(/rainadmin|quiltstorewebsites|jewel360|musicshop360/) != null){
                examples_ready = false;
            }
            if(examples.match(/^[nN](?:\\|\/)?[aA]/) != null || examples === ''){
                examples_ready = false;
            }
            //check errors box
            let errors = $('#errors')[0].value;
            let errors_ready = true;
            if(errors.match(/^[nN](?:\\|\/)?[aA]/) != null || errors === ''){
                errors_ready = false;
            }
            if(examples_ready && errors_ready){
                generateTicket();
            }
            break;
        default:
            break;
    }
}

function nextStep(current_step){
    //Move to next step
    $(`[step='${current_step}']`)[0].classList.value = 'complete';
    $(`[step='${current_step + 1}']`)[0].classList.value = 'active';
    //move to next data set
    $(`[data='${current_step}']`)[0].classList.value = '';
    $(`[data='${current_step + 1}']`)[0].classList.value = 'active';
    if(current_step === 1){
        $('button[prev]').removeClass('hide');
    }
    if(current_step === 4){
        $('button[next]').addClass('hide');
        $('button[finish]').removeClass('hide');
    }
}

function generateTicket(){
    let data = {
        crm: $('#crm')[0].value,
        area: $('#systemArea')[0].value,
        replicable: $('[replicable].selected').attr('replicable'),
        steps: () => {
            let string = '';
            $('#steps-table tr input').each(function (index){
                let step = index + 1;
                string += `${index + 1}. ` + $(this)[0].value + '\n';
            });
            return string;
        },
        description: $('#description')[0].value,
        expected: $('#expected')[0].value,
        screenshots: () => {
            let string = '';
            $('#screenshot-table tr input').each(function (){
                string += $(this)[0].value + '\n\n';
            });
            return string;
        },
        videos: () => {
            let string = '';
            $('#video-table tr input').each(function (){
                string += $(this)[0].value + '\n\n';
            });
            return string;
        },
        examples: $('#examples')[0].value,
        errors: $('#errors')[0].value
    };
    $('#ticket-container > div > textarea')[0].value = `**LOCATION**
Store ID:
${data.crm}

System Area:
${data.replicable}

Can you recreate the problem on your demo site (if yes please continue, if no use the "Bug - non reproducible" macro)?

STEPS TO REPRODUCE:
${data.steps()}

ACTUAL RESULTS:(Please be as detailed as possible.)

Description:
${data.description}

Example:(If this pertains to the customer's site, please provide links to the relevant pages.)
${data.examples}

Screenshot:
${data.screenshots()}

Video:
${data.videos()}

Console Info:

EXPECTED RESULTS:
${data.expected}

CONSOLE ERRORS:
\`\`\`
${data.errors}
\`\`\`
`;
    $('#ticket-container').removeClass('hide');
    $('#ticket-container > div > textarea')[0].focus();
}

function copyTicket() {
    // Get the text field
    var copyText = $('#ticket-container > div > textarea')[0];

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);

    // Alert the copied text
    //console.log("Copied the text: " + copyText.value);
};

function addTableRow(table){
    let new_row_number = $(`#${table} tbody tr`).length + 1;
    $(`#${table} tbody`).append(`<tr><td>Step ${new_row_number}<input placeholder="Enter Step ${new_row_number}" type="text" /></td></tr>`)
}

function removeTableRow(table){
    $(`#${table} tbody tr:last-child`).remove();
}

function previousStep(){
    let current_step = parseInt($('#info-tabs .active')[0].getAttribute('step'));
    if(current_step === 2){
        $('button[prev]').addClass('hide');
    }
    if(current_step === 5){
        $('button[finish]').addClass('hide');
        $('button[next]').removeClass('hide');
    }
    //set step display changes
    $(`[step='${current_step}']`)[0].classList.value = '';
    $(`[step='${current_step - 1}']`)[0].classList.value = 'active';
    //set data display changes
    $(`[data='${current_step}']`)[0].classList.value = '';
    $(`[data='${current_step - 1}']`)[0].classList.value = 'active';
}

function selectReplicability(el){
    $('div[replicable].selected').removeClass('selected');
    el.target.classList.value = 'selected';
}

$(window).ready(function (){
    $('div[replicable]').on('click',selectReplicability);
});


