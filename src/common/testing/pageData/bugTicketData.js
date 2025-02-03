export default async function setBugTicketData() {
    $('#crm')[0].value = '6085';
            $('#systemArea')[0].value = 'till';
            $('[replicable="yes"]')[0].click();
            $('[where="Test"]')[0].click();
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