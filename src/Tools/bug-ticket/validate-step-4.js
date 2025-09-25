/**
 * @module validate-step-4
 * @description This module is used to validate the data entered on step 4 of the bug ticket form.
 */
import {regexController} from '/Rain-Support-Tools/src/modules/regex-patterns/patterns.js';
export default {
    name: 'validate-step-4',
    template: `
        <div style="z-index: 4;" id="links-content" data="4" :class="{active: this.$props.step === 4, 'in-active': this.$props.step < 4, complete: this.$props.step > 4}">
            <div id="sharepoint-app">
                <share-point-upload></share-point-upload>
            </div>
            <h2 class="header-center">
                <div title="Please provide links to any screenshots that show the bug in action." class="note-wrapper">
                    Screenshots
                    <span class="fa-solid fa-question"></span>
                </div>
            </h2>
            <div table-controls>
                <button :tabIndex="this.$props.step === 4 ? '0' : '-1'" class="btn secondary" @click="addScreenshotTableRow('')">Add Row</button>
                <button :tabIndex="this.$props.step === 4 ? '0' : '-1'" class="btn secondary" @click="removeScreenshotTableRow">Remove Row</button>
            </div>
            <table id="screenshot-table">
                <tbody>
                    <tr v-for="(screenshot, index) in screenshots" :key="index">
                        <td>
                            Screenshot {{ index + 1 }}<input :tabIndex="this.$props.step === 4 ? '0' : '-1'" :placeholder="'Enter Screenshot ' + (index + 1)" type="text" v-model="screenshots[index]" />
                        </td>
                    </tr>
                </tbody>
            </table>
            <h2 class="header-center">
                <div title="Please provide links to any videos that show the bug in action." class="note-wrapper">
                    Videos
                    <span class="fa-solid fa-question"></span>
                </div>
            </h2>
            <div table-controls>
                <button :tabIndex="this.$props.step === 4 ? '0' : '-1'" class="btn secondary" @click="addVideoTableRow('')">Add Row</button>
                <button :tabIndex="this.$props.step === 4 ? '0' : '-1'" class="btn secondary" @click="removeVideoTableRow">Remove Row</button>
            </div>
            <table id="video-table">
                <tbody>
                    <tr v-for="(video, index) in videos" :key="index">
                        <td>
                            Video {{ index + 1 }}<input :tabIndex="this.$props.step === 4 ? '0' : '-1'" :placeholder="'Enter Video ' + (index + 1)" type="text" v-model="videos[index]" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>`,
    props: {
        brand: String,
        step: Number
    },
    data(){
        return {
            screenshots: ['','',''],
            videos: ['']
        }
    },
    mounted(){
        if(location.search === '?test'){
            this.screenshots = ['https://drive.google.com/file/d/test/view?1', 'https://drive.google.com/file/d/test/view?2', 'https://drive.google.com/file/d/test/view?3'];
            this.videos = ['https://drive.google.com/file/d/test/view?4'];
        }
        // Listen for SharePoint upload completion
        document.addEventListener('sharepoint-upload-complete', (e) => {
            for (let i = 0; i < e.detail.links.length; i++) {
                if (e.detail.links[i].includes(":i:")) {
                    let index = this.screenshots.findIndex(screenshot => screenshot === '');
                    if (index !== -1) {
                        this.screenshots[index] = e.detail.links[i];
                    } else {
                        this.addScreenshotTableRow(e.detail.links[i]);
                    }
                }
                if (e.detail.links[i].includes(":v:")) {
                    let index = this.videos.findIndex(video => video === '');
                    if (index !== -1) {
                        this.videos[index] = e.detail.links[i];
                    } else {
                        this.addVideoTableRow(e.detail.links[i]);
                    }
                }
            }
        });
    },
    methods: {
        async validate(returnData){
            //create object to store any errors found in the form
            let bad_data_list = {};

            let image_problems = this.checkLinkList(document.querySelectorAll('#screenshot-table tr input') , 'Image');
            if (image_problems.length) {
                for (let i=0;i<image_problems.length;i++) {
                    bad_data_list[`image_${i}`] = image_problems[i];
                }
            };
            let video_problems = this.checkLinkList(document.querySelectorAll('#video-table tr input'), 'Video');
            if (video_problems.length) {
                for (let i=0;i<video_problems.length;i++) {
                    bad_data_list[`video_${i}`] = video_problems[i];
                }
            };
            let duplicate_links = this.duplicateLinksFound();
            if (duplicate_links.length) {
                for (let i=0;i<duplicate_links.length;i++) {
                    bad_data_list[`dupLink_${i}`] = `${duplicate_links[i]} was found more than one time.`;
                };
            };
            //if there are any errors, return the errors
            if (Object.entries(bad_data_list).length) {
                returnData({success: false, data: bad_data_list});
            } else {
                //if there are no errors, return the steps
                let links = {
                    images: '',
                    videos: ''
                }
                document.querySelectorAll('#screenshot-table tr input').forEach((element, index) => {
                    links.images += `[Screenshot_${index + 1}](${element.value})\n\n`;
                });
                document.querySelectorAll('#video-table tr input').forEach((element, index) => {
                    links.videos += `[Video_${index + 1}](${element.value})\n\n`;
                });
                returnData({success: true, data: links});
            };
        },
        checkLinkList(list_content, list_type){
            let error_array = [];
            //check that there are rows to look through
            if (list_content.length < 1 && !['frameready','tritech','dive360'].includes(this.brand)) {
                error_array.push(`${list_type} list is empty. Please make sure that the list has at least one ${list_type} link provided.`);
                return error_array;
            }
            //if list is longer than 0, loop through each element in the list with the below function, this checks that there isn't more than one link in a row. If a duplicate link is found in the row then it is removed, if the second link found isn't a duplicate an error is thrown to the user to make sure they delete any extra data out of the row
            list_content.forEach((element, index) => {
                //set current loop row value to be called on
                if(element.value != ''){//if there is data in the row, check how many links are in it
                    let row_data = element.value.match(/https?/g) || [];
                    //if the array returned is longer than 1 then there is a duplicate
                    if(row_data.length > 1){
                        //let's find where second link starts in the string
                        let dup_link_check = {//object created to find duplicate links
                            times_iterated: 0,
                            iterator: element.value.matchAll(/https?/g),
                            _constructor: () => {
                                for(let match of dup_link_check.iterator){
                                    dup_link_check.times_iterated ++;
                                    dup_link_check[`match_${dup_link_check.times_iterated}`] = match.index;
                                }
                            }
                        }
                        dup_link_check._constructor();
                        //find part of url string that is the first link
                        let first_link = element.value.substr(0, dup_link_check.match_2);
                        //check full string to see if the first link is found more than one time in fullness
                        if (element.value.match(this.urlRegExBuilder(first_link)).length > 1) {
                            //if first link string is seen more than one time, set string value of the element to be just the first link
                            element.value = first_link;
                        } else {
                            //otherwise set return value as true for a potentially issue
                            error_array.push(`${list_type} ${index + 1} has more than one link.`);
                        }
                        //check if the link has bad characters in it
                        if (element.value.includes('(') || element.value.includes(')')) {
                            error_array.push(`${list_type} ${index + 1}: please remove any parenthesis from the link.`);
                        }
                    }
                }
            });
            //loop through each link given again
            list_content.forEach((element, index) => {
                //remove all white space from each link string, (spaces, tabs, etc.)
                element.value = element.value.trim();
                //make sure that each link meets the expected criteria of being a google drive or one drive link
                if(this.imageVideoLink(element.value)){
                    error_array.push(`${list_type} ${index + 1} isn't a valid google drive or one drive link.`);
                }
            });
            //return value of checks. A false return means no issues were found, a true return means we found an issue
            return error_array;
        },
        duplicateLinksFound(){
            let duplicates = [];
            let link_list = '';
            //build link list by getting each input and making a string comma delimited (link_1,link_2,etc)
            document.querySelectorAll('#links-content tr input').forEach((element) => {
                link_list += element.value + ',';
            })
            //loop through each input and check it's input as a regex test on the string to make sure it doesn't find more than one instance of a link
            document.querySelectorAll('#links-content tr input').forEach((element) => {
                let temp_regex = this.urlRegExBuilder(element.value);
                if(link_list.match(temp_regex).length > 1 && element.value != ''){
                    //if test finds more than 1 instance of a link add it to the list to display
                    duplicates.push(element.value);
                }
            })
            //return true if duplicates found, false if no duplicates found
            return [... new Set(duplicates)];
        },
        imageVideoLink(url_string){
            return (
                    url_string === '' 
                    || 
                    (
                        !regexController.regexPatterns.googleDrive.test(url_string) 
                        &&
                        !regexController.regexPatterns.oneDrive.test(url_string)
                    )
                );
            /*
            good links
            image
            https://quiltsoftware-my.sharepoint.com/:i:/p/david_vandersluis/EWo5q-V1MB9DqxBQmFNw87YBX430MdWX3N-HzL8V1TghEg?e=Fpia10
        
            video
            https://quiltsoftware-my.sharepoint.com/:v:/p/david_vandersluis/EbR3Bar75tVEp4GBKUYrIMUBtvnbBAkUd9L9vzY7ASC6cA?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=U49V57
        
            bad link - leads to a folder instead of a file
            https://quiltsoftware-my.sharepoint.com/:f:/p/david_vandersluis/EtJUFCiLE6RMiVD5AlmC8GEBvmlKwzDVIDjQt8EGoV01_A?e=7LKReI
        
            */
        },
        urlRegExBuilder(url_string){
            //replace characters '\/' and '?' so that they are searched correctly by the new regex expression
            url_string = url_string.replace(/[\?\\\/]/g,"\\\$&");
            //return the new regex expression to be used with a global search attached
            return new RegExp(url_string, 'g');
        },
        addVideoTableRow(url = ''){
            try {
                this.videos.push(url);
            } catch(error) {
                console.error(`Error adding video table row`, error);
            }
        },
        removeVideoTableRow(){
            try {
                this.videos.pop();
            } catch(error) {
                console.error(`Error removing video table row`, error);
            }
        },
        addScreenshotTableRow(url = ''){
            try {
                this.screenshots.push(url);
            } catch(error) {
                console.error(`Error adding screenshot table row`, error);
            }
        },
        removeScreenshotTableRow(){
            try {
                this.screenshots.pop();
            } catch(error) {
                console.error(`Error removing screenshot table row`, error);
            }
        }
    }
}   