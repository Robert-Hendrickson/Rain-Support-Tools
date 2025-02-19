export default async function setDNSHelpData() {
    document.getElementById('domain').value = 'rainadmin.com';
    document.querySelectorAll('[choice-selector] div').forEach(function (el){
        el.click();
    });
    document.querySelector(`#add-record-table tbody`).insertAdjacentHTML('beforeend', `<tr>
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
    document.querySelector('#correct-record-table tbody').insertAdjacentHTML('beforeend', `<tr>
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
    document.querySelector('#remove-record-table tbody').insertAdjacentHTML('beforeend', `<tr>
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