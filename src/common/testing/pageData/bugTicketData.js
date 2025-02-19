export default async function setBugTicketData() {
    $('#crm')[0].value = '6085';
            document.getElementById('systemArea').value = 'till';
            document.querySelector('[replicable="yes"]').click();
            document.querySelector('[where="Test"]').click();
            document.querySelectorAll('#steps-table tr input').forEach(function (el){
                el.value = 'test step';
            });
            document.getElementById ('description').value = 'test description';
            document.querySelectorAll('#links-content tr input').forEach(function (el,index){
                el.value = 'https://drive.google.com/file/d/test/view?' + index;
            });
            document.getElementById('examples').value = 'robstestsite.com';
            document.getElementById('errors').value = 'No errors';
}