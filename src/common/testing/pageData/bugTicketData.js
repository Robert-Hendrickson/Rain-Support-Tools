export default async function setBugTicketData() {
    document.getElementById('Support-Rep').value = 'Test Rep';
    document.getElementById('Store-Name').value = 'Test Store';
    document.getElementById('crm').value = '6085';
    document.getElementById('systemArea').value = 'till';
    document.querySelector('[replicable="yes"]').click();
    document.querySelector('[where="Test"]').click();
    document.getElementById ('description').value = 'test description';
    document.getElementById('examples').value = 'robstestsite.com';
    document.getElementById('errors').value = 'No errors';
}