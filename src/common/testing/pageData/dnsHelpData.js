export default async function setDNSHelpData() {
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