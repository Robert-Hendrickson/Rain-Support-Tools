import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
import { GrowlCtrl } from '/Rain-Support-Tools/src/modules/growl-ctrl/growl-ctrl.js';

// Version stamp applied by sp-loader.js. Forwarded to every share-point module so
// the whole graph is fetched fresh, not just this file. Empty when loaded directly
// (e.g. without the loader), which simply falls back to normal caching.
const V = new URL(import.meta.url).search;
const { getValidToken } = await import(`./token-utils.js${V}`);
const { sharePointConfig, tokenKey } = await import(`./auth-config.js${V}`);

// Microsoft's guidance is to use a resumable upload session for anything larger
// than 4 MB. A plain PUT above that is a single long-running request with no
// progress reporting, which is what made videos look like they had stalled.
const CHUNKED_UPLOAD_THRESHOLD = 4 * 1024 * 1024;
// Chunk size must be a multiple of 320 KiB per Microsoft's requirements
const UPLOAD_CHUNK_SIZE = 320 * 1024 * 16; // ~5 MiB per chunk
// Only warn about the wait for files big enough to genuinely take a while
const LARGE_FILE_NOTICE_THRESHOLD = 150 * 1024 * 1024;

const SharePointUpload = {
    name: 'SharePointUpload',
    components: {
        GrowlCtrl
    },
    template: `
        <growl-ctrl ref="growlCtrl"></growl-ctrl>
        <div class="sharepoint-content-container">
            <h2 @click="toggleContainer" class="toggle-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                Upload to Quilt SharePoint
                <span class="toggle-icon" style="font-size: 0.8em;">{{ isContainerVisible ? '▼' : '▶' }}</span>
            </h2>
            <div class="sharepoint-container" v-show="isContainerVisible">
                <div v-if="!isAuthenticated">
                    <p>You need to authenticate first.</p>
                    <button @click="goToAuth">Authenticate</button>
                </div>

                <div v-else>
                    <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
                        <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*,video/*" multiple style="display: none" />
                        <p>Click or drag and drop images or videos here</p>
                    </div>

                    <div v-if="displaySelectedFiles">
                        <div class="file-list">
                            <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
                                <div class="file-preview">
                                    <div v-if="isImages[index]" class="image-thumbnail" @click="openImageModal(index)">
                                        <img :src="previewUrls[index]" class="preview-image" />
                                        <span class="zoom-icon fa-solid fa-magnifying-glass-plus"></span>
                                    </div>
                                    <div v-else class="video-thumbnail" @click="openImageModal(index)">
                                        <img :src="previewUrls[index]" class="preview-image" />
                                        <div class="play-icon fa-solid fa-play"></div>
                                    </div>
                                    <span>{{ file.name }}</span>
                                </div>
                                <button @click="removeFile(index)" class="copy-button">Remove</button>
                            </div>
                        </div>
                        <button @click="attemptFileUpload" :disabled="uploading">
                            {{ uploading ? 'Uploading...' : 'Upload All' }}
                        </button>
                    </div>
                    <div v-if="uploading" class="upload-progress">
                        <p>Uploading file {{ fileNumber }} of {{ selectedFiles.length }} ({{ Math.round(((fileNumber - 1) / selectedFiles.length) * 100) }}%)</p>
                        <p class="upload-timer">
                            <span class="fa-solid fa-spinner fa-spin"></span>
                            <span class="upload-timer-file">{{ currentFileName }}</span>
                            <span class="upload-timer-elapsed">{{ elapsedDisplay }}</span>
                            <span v-if="fileProgressPercent !== null">({{ fileProgressPercent }}% of this file)</span>
                        </p>
                    </div>

                    <div v-if="uploadStatus" :class="['status', uploadStatus.type]">
                        {{ uploadStatus.message }}
                        <div v-if="uploadStatus.action" class="action-container">
                            <button @click="uploadStatus.action.handler" class="action-button">
                                {{ uploadStatus.action.text }}
                            </button>
                        </div>
                        <div v-if="uploadStatus.links && uploadStatus.links.length > 0" class="link-container">
                            <h4>Uploaded Files:</h4>
                            <div v-for="(link, index) in uploadStatus.links" :key="index" class="file-item">
                                <input type="text" :value="link" readonly class="link-input" />
                                <button @click="copyLink(link)" class="copy-button">Copy</button>
                            </div>
                        </div>
                    </div>

                    <!-- Preview Modal -->
                    <div class="modal" :class="{ active: showPreviewModal }">
                        <div class="close-modal" @click="closePreviewModal">&times;</div>
                        <div class="modal-content">
                            <img v-if="showImagePreview" :src="currentPreviewUrl" class="modal-image" />
                            <video v-else :src="currentPreviewUrl" class="modal-video" controls autoplay></video>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            isAuthenticated: false,
            selectedFiles: [],
            previewUrls: [],
            uploading: false,
            fileNumber: 1,
            uploadStatus: null,
            isImages: [],
            showVideoModal: false,
            currentVideoUrl: null,
            showPreviewModal: false,
            currentPreviewUrl: null,
            showImagePreview: false,
            isContainerVisible: true,
            attemptUploadCount: 0,
            currentFileName: '',
            fileElapsedMs: 0,
            fileBytesSent: 0,
            fileTotalBytes: 0,
            fileTimerId: null,
            fileStartedAt: 0,
        }
    },
    methods: {
        // Starts (or restarts) the elapsed-time counter for a single file.
        startFileTimer(file) {
            this.stopFileTimer();
            this.currentFileName = file.name;
            this.fileTotalBytes = file.size;
            this.fileBytesSent = 0;
            this.fileStartedAt = Date.now();
            this.fileElapsedMs = 0;
            this.fileTimerId = setInterval(() => {
                this.fileElapsedMs = Date.now() - this.fileStartedAt;
            }, 500);
        },
        stopFileTimer() {
            if (this.fileTimerId) {
                clearInterval(this.fileTimerId);
                this.fileTimerId = null;
            }
        },
        resetFileProgress() {
            this.stopFileTimer();
            this.currentFileName = '';
            this.fileElapsedMs = 0;
            this.fileBytesSent = 0;
            this.fileTotalBytes = 0;
        },
        toggleContainer() {
            this.isContainerVisible = !this.isContainerVisible;
        },
        checkAuth() {
            const token = localStorage.getItem(tokenKey('access_token'));
            this.isAuthenticated = !!token;
        },
        goToAuth() {
            const authTab = window.open('../share-point/auth.html', '_blank');
            window.addEventListener('message', (event) => {
                if (event.origin !== window.location.origin) {
                    return;
                }
                if (event.data === 'auth-complete') {
                    console.log('Auth complete');
                    authTab.close();
                    this.checkAuth();
                    this.uploadStatus = {
                        type: 'success',
                        message: 'Authentication process complete. Please upload your files.'
                    };
                    this.attemptFileUpload();
                }
                if (event.data === 'auth-error') {
                    console.log('Auth error');
                    authTab.close();
                    this.uploadStatus = {
                        type: 'error',
                        message: 'Authentication process failed. Please try again.',
                        action: {
                            text: 'Try Again',
                            handler: () => this.goToAuth()
                        }
                    };
                    this.attemptUploadCount = 0;
                }
            }, { once: true });
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileSelect(event) {
            const files = Array.from(event.target.files);
            this.handleFiles(files);
        },
        handleDrop(event) {
            const files = Array.from(event.dataTransfer.files);
            this.handleFiles(files);
        },
        handleFiles(files) {
            if (files.length === 0) {
                alert('Please select image or video files');
                return;
            }
            for (const file of files) {
                if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                    this.selectedFiles.push(file);
                    this.previewUrls.push(URL.createObjectURL(file));
                    this.isImages.push(file.type.startsWith('image/'));
                } else {
                    this.growl('File ' + file.name + ' is not a valid image or video file. Please select a valid file.');
                }
            }
        },
        removeFile(index) {
            this.selectedFiles.splice(index, 1);
            this.previewUrls.splice(index, 1);
            this.isImages.splice(index, 1);
        },
        copyLink(link) {
            navigator.clipboard.writeText(link).then(() => {
                this.growl('Link copied to clipboard!', 'success');
            }).catch(err => {
                console.error('Failed to copy link:', err);
                this.growl('Failed to copy link to clipboard!', 'error');
            });
        },
        openVideoModal(index) {
            this.currentVideoUrl = this.previewUrls[index];
            this.showVideoModal = true;
        },
        closeVideoModal() {
            this.showVideoModal = false;
            this.currentVideoUrl = null;
        },
        openImageModal(index) {
            this.currentPreviewUrl = this.previewUrls[index];
            this.showImagePreview = this.isImages[index];
            this.showPreviewModal = true;
        },
        closePreviewModal() {
            this.showPreviewModal = false;
            this.currentPreviewUrl = null;
            this.showImagePreview = false;
        },
        async smallFileUpload(file, token) {
            try {
                    const uploadResponse = await axios.put(
                        `${sharePointConfig.getDriveUrl()}/root:/${sharePointConfig.uploadFolder}/${encodeURIComponent(file.name)}:/content`,
                        file,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': file.type
                            },
                            onUploadProgress: (event) => {
                                this.fileBytesSent = event.loaded;
                            }
                        }
                    );
                    const sharedLink = await this.getSharedLink(uploadResponse, token);
                    return sharedLink;
                } catch (error) {
                    throw new Error(error.message);
                }
        },
        async largeFileUpload(file, token) {
            if (file.size > LARGE_FILE_NOTICE_THRESHOLD) {
                this.growl('Uploading large file. This may take a while...');
            }
            // Declared out here so the catch block can cancel the session
            let uploadUrl = null;
            try {
                const uploadPath = `${sharePointConfig.uploadFolder}/${encodeURIComponent(file.name)}`;

                // Step 1: Create an upload session
                const sessionResponse = await axios.post(
                    `${sharePointConfig.getDriveUrl()}/root:/${uploadPath}:/createUploadSession`,
                    {
                        item: {
                            "@microsoft.graph.conflictBehavior": "rename",
                            "name": file.name
                        }
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                uploadUrl = sessionResponse.data.uploadUrl;
                const fileSize = file.size;
                const chunkSize = UPLOAD_CHUNK_SIZE;
                let uploadResponse = null;

                // Step 2: Upload the file in sequential byte-range chunks
                for (let start = 0; start < fileSize; start += chunkSize) {
                    const end = Math.min(start + chunkSize - 1, fileSize - 1);
                    const chunk = file.slice(start, end + 1);

                    // Upload session URLs are pre-authenticated; no Authorization header needed
                    const response = await axios.put(uploadUrl, chunk, {
                        headers: {
                            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                            //'Content-Length': chunk.size
                        },
                        onUploadProgress: (event) => {
                            this.fileBytesSent = start + event.loaded;
                        }
                    });

                    // 200/201 on the final chunk means the DriveItem was created
                    if (response.status === 200 || response.status === 201) {
                        uploadResponse = response;
                    }
                    this.fileBytesSent = end + 1;
                }

                if (!uploadResponse) {
                    throw new Error('Upload session finished without returning the created file');
                }

                const sharedLink = await this.getSharedLink(uploadResponse, token);
                return sharedLink;
            } catch (error) {
                console.error('Large file upload error:', error);
                this.growl('Error uploading file: ' + error.message, 'error');
                // Only cancel if the session was actually created
                if (uploadUrl) {
                    try {
                        await axios.delete(uploadUrl);
                    } catch (cancelError) {
                        console.error('Failed to delete upload session:', cancelError);
                        console.log('Upload URL:', uploadUrl);
                    }
                }
                return '';
            }
        },
        async getSharedLink(uploadResponse, token) {
            try {
                const shareResponse = await axios.post(
                    `${sharePointConfig.getDriveUrl()}/items/${uploadResponse.data.id}/createLink`,
                    {
                        type: "view",
                        scope: "organization"
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                return shareResponse.data.link.webUrl;
            } catch (error) {
                throw new Error('Failed to get shared link: ' + error.message);
            }
        },
        async uploadFiles() {
            this.fileNumber = 1;
            let returnValue = {};
            //update file number as we upload each file
            if (this.selectedFiles.length === 0) return 'no upload';

            this.uploading = true;
            this.uploadStatus = null;
            const uploadedLinks = [];
            let token = null;

            try {
                // Get a valid token (will refresh if needed)
                token = await getValidToken();
                if (token.error) {
                    throw new Error(token.error);
                }
            } catch (error) {
                // These returns bypass the finally below, so clear the progress
                // display here or the spinner keeps running after the failure
                this.uploading = false;
                this.resetFileProgress();
                if (error.message === 'No refresh token available') {
                    return {success: false, error: {
                        type: 'error',
                        message: 'Your session has expired. Please authenticate again.',
                    }};
                } else {
                    return {success: false, error: {
                        type: 'error',
                        message: error.message,
                    }};
                }
            }

            try {
                // Upload all files
                for (const file of this.selectedFiles) {
                    // Restart the elapsed timer so each file reports its own duration
                    this.startFileTimer(file);
                    // First upload the file
                    if (file.size > CHUNKED_UPLOAD_THRESHOLD) {
                        console.log('Uploading file in chunks:', file.name);
                        const sharedLink = await this.largeFileUpload(file, token);
                        sharedLink ? uploadedLinks.push(sharedLink): null;
                    } else {
                        const sharedLink = await this.smallFileUpload(file, token);
                        sharedLink ? uploadedLinks.push(sharedLink): null;
                    }
                    this.stopFileTimer();
                    this.fileNumber++;
                }

                this.uploadStatus = {
                    type: 'success',
                    message: `Successfully uploaded ${uploadedLinks.length} file(s)!`,
                    links: uploadedLinks
                };
                document.dispatchEvent(new CustomEvent('sharepoint-upload-complete', {
                    detail: {
                        links: uploadedLinks
                    }
                }));
                // Clear the selected files after successful upload
                this.selectedFiles = [];
                this.previewUrls = [];
                this.isImages = [];
                returnValue = {success: true};
            } catch (error) {
                console.error('Upload error:', error);
                let errorMessage = 'Error uploading files';

                if (error.response) {
                    errorMessage += `: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`;
                } else if (error.request) {
                    errorMessage += ': No response from server. See console for more details.';
                    console.error('No response from server:', error.request);
                } else {
                    errorMessage += `: ${error.message}`;
                }
                return {success: false, error: {
                    type: 'error',
                    message: errorMessage,
                }};
            } finally {
                this.uploading = false;
                this.resetFileProgress();
                return returnValue;
            }
        },
        growl(growlMessage, growlType) {
            this.$refs.growlCtrl.updateGrowl({message: growlMessage, type: growlType});
        },
        async attemptFileUpload() {
            if (this.attemptUploadCount < 2) {
                let attempted = await this.uploadFiles();
                if (attempted === 'no upload') {
                    // end if no files to upload, reset attempt count
                    this.attemptUploadCount = 0;
                    return;
                }
                if (!attempted.success) {
                    this.attemptUploadCount++;
                    this.growl('Error authenticating. Getting new Token...');
                    this.uploadStatus = attempted.error;
                    this.goToAuth();
                } else {
                    this.attemptUploadCount = 0;
                }
            } else {
                this.growl('Failed to upload files. Please try again.');
                this.attemptUploadCount = 0;
                return {success: false, error: {
                    type: 'error',
                    message: 'Failed to upload files. Please try again.',
                    action: {
                        text: 'Try Again',
                        handler: () => this.attemptFileUpload()
                    }
                }};
            }
        },
    },
    computed: {
        displaySelectedFiles() {
            return this.selectedFiles.length > 0 && !this.uploading
        },
        // Elapsed time on the current file as m:ss (or h:mm:ss past an hour)
        elapsedDisplay() {
            const totalSeconds = Math.floor(this.fileElapsedMs / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const pad = (n) => String(n).padStart(2, '0');
            return hours > 0
                ? `${hours}:${pad(minutes)}:${pad(seconds)}`
                : `${minutes}:${pad(seconds)}`;
        },
        fileProgressPercent() {
            if (!this.fileTotalBytes) return null;
            return Math.min(100, Math.round((this.fileBytesSent / this.fileTotalBytes) * 100));
        }
    },
    mounted() {
        this.checkAuth();
    },
    unmounted() {
        this.stopFileTimer();
    }
};

window.apptest = createApp(SharePointUpload).mount('#sharepoint-app');
