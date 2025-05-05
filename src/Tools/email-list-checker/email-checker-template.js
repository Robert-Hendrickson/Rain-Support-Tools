export const email_checker_template = `<div class="mainContainer">
    <h1 style="text-align: center;">Email List Checker</h1>
    <div class="controls">
        <input type="button" value="Clear" @click="clearData()" />
        <input type="button" value="Check" @click="runCheck()" />
        <input type="button" value="Import" @click="show_import = true"/>
    </div>
    <div class="mainContent">
        <div class="inputList">
            <h2>Imported List</h2>
            <p>List count <count>{{ input_list.length }}</count></p>
            <textarea v-model="inputListText"></textarea>
        </div>
        <div class="goodList">
            <h2>Good Emails</h2>
            <p>Found <count>{{ good_list.length }}</count></p>
            <textarea>{{ array_string(good_list) }}</textarea>
        </div>
        <div class="badList">
            <h2>Potentially Bad Emails</h2>
            <p>Found <count>{{ bad_list.length }}</count></p>
            <textarea>{{ array_string(bad_list) }}</textarea>
        </div>
    </div>
</div>
<div v-show="show_import" class="import">
    <div>
        <input type="button" value="Run" @click="importList()" />
        <input type="button" value="Close" @click="show_import = false" />
        <input v-show="isTest" type="button" value="Test" @click="testImport()" />
    </div>
    <textarea></textarea>
    <div id="get-email-list-code">
        <p>
            Run the below code on the email list page in and this will collect the list of emails from the table.<br>
            <br>
            After running the code, click the copy link that appears and paste the content into the box to the left.
        </p>
        <p v-show="code_copied">Code copied to clipboard!</p>
        <div class="code-display" @click="copyCode()">
            <pre>
                <code>
let email_list = document.querySelectorAll('table > tbody tr td:first-child');
let email_list_string = '';
for(i=1;i&#60;email_list.length;i++){
email_list_string += email_list[i].innerText + \`\n\`;
};
email_list_string.substring(0, email_list_string.length -1);
                </code>
            </pre>
        </div>
        <br>
        <video
        controls
        style="width: 400px;"
        controlslist="nodownload"
        >
            <source src="/Rain-Support-Tools/src/media/videos/email-list-checker-overview.mp4" type="video/mp4"></source>
            <p class="vjs-no-js">
                To view this video please enable JavaScript, and consider upgrading to a
                web browser that
                <a href="https://videojs.com/html5-video-support/" target="_blank">
                supports HTML5 video
                </a>
            </p>
        </video>
    </div>
</div>`;