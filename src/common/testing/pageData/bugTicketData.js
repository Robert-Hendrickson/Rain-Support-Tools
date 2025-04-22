export default async function setBugTicketData() {
    document.getElementById('Support-Rep').value = 'Test Rep';
    document.getElementById('Store-Name').value = 'Test Store';
    document.getElementById('crm').value = '6085';
    document.getElementById('systemArea').value = 'till';
    document.querySelector('[replicable="yes"]').click();
    document.querySelector('[where="Test"]').click();
    document.querySelectorAll('#steps-table tr input').forEach(function (el){
        el.value = 'test step';
    });
    document.getElementById ('description').value = 'test description';
    for(let i = 0; i < 3; i++){
        document.querySelector(`#screenshot-table tbody`).insertAdjacentHTML('beforeend', `<tr><td>Image ${i+1}<input placeholder="Enter Image ${i+1}" type="text" /></td></tr>`);
    };
    document.querySelector(`#video-table tbody`).insertAdjacentHTML('beforeend', `<tr><td>Video 1<input placeholder="Enter Video 1" type="text" /></td></tr>`);
    document.querySelectorAll('#links-content tr input').forEach(function (el,index){
        el.value = 'https://drive.google.com/file/d/test/view?' + index;
    });
    document.getElementById('examples').value = 'robstestsite.com';
    document.getElementById('errors').value = 'No errors';
}