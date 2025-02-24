export default async function setFeeDifferenceData() {
    document.querySelector('.import').insertAdjacentHTML('afterbegin',`<button onclick="testFeeDifference()">Test</button>`);
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
        function testFeeDifference(){
            document.querySelector('.import textarea').value = \`04:35:05 AM
1400120209
Card Present
Completed
Jan 17, 2024
$24.28
-$1.00
$0.00
$23.28
04:35:05 AM
1400120210
Card Not Present
Amex
Jan 17, 2024
$24.28
-$1.13
$0.00
$23.28
04:35:06 AM
1400120211
Card Not Present
Completed
Jan 17, 2024
$27.60
-$1.10
$0.00
$26.50
04:35:06 AM
1400120212
Card Not Present
Completed
Jan 17, 2024
$27.60
-$1.10
$0.00
$26.50
04:35:09 AM
1400120213
Card Not Present
Completed
Jan 17, 2024
$27.60
-$1.10
$0.00
$26.50\`;
        };
    `;
    document.querySelector('head').appendChild(script);
    document.getElementById('cardPresentRate').value = '1.95';
    document.getElementById('cardPresentAmount').value = '0.07';
    document.getElementById('cardNotPresentRate').value = '2.9';
    document.getElementById('cardNotPresentAmount').value = '0.30';
    document.getElementById('amexcardPresentRate').value = '2.1';
    document.getElementById('amexcardPresentAmount').value = '0.15';
    document.getElementById('amexcardNotPresentRate').value = '3.2';
    document.getElementById('amexcardNotPresentAmount').value = '0.35';
}