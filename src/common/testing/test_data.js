/*this file is used in defining values for tools for testing purposes*/
/*function sets test data based on the page being seen*/
async function setTestData() {
    //get page name from url pathname
    let path = location.pathname;
    
    try {
        let testModule;
        
        if(path.match(/email-list-checker/)) {
            testModule = await import('./pageData/emailListData.js');
        } else if(path.match(/bug-ticket-v2/)) {
            testModule = await import('./pageData/bugTicketData.js');
        } else if(RegExp(/dns\-help/).test(path)) {
            testModule = await import('./pageData/dnsHelpData.js');
        } else if((/site-work/).test(path)) {
            testModule = await import('./pageData/siteWorkData.js');
        } else if((/database-ticket/).test(path)) {
            testModule = await import('./pageData/databaseData.js');
        }
        
        if (testModule && testModule.default) {
            await testModule.default();
        }
    } catch (error) {
        console.error('Error loading test data:', error);
    }
}

/*this waits for page to be finished loading, then checks if the page is on a test environment or if a test value was passed in the url*/
$(window).ready(async function(){
    if (location.href.match('localhost') || (/^\?test$/).test(location.search)) {
        await setTestData();
    }
});