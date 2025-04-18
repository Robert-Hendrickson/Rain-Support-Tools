import { getValidToken } from './token-utils.js';

const SharePointUpload = {
    name: 'SharePointUpload',
    template: `
        <div class="content-container">
            <div class="container">
                <h2>Upload Image to SharePoint</h2>
                
                <div v-if="!isAuthenticated">
                    <p>You need to authenticate first.</p>
                    <button @click="goToAuth">Authenticate</button>
                </div>
                
                <div v-else>
                    <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
                        <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*,video/*" multiple style="display: none" />
                        <p>Click or drag and drop images or videos here</p>
                    </div>
                    
                    <div v-if="selectedFiles.length > 0">
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
                        <button @click="uploadFiles" :disabled="uploading">
                            {{ uploading ? 'Uploading...' : 'Upload All' }}
                        </button>
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
            uploadStatus: null,
            isImages: [],
            showVideoModal: false,
            currentVideoUrl: null,
            showPreviewModal: false,
            currentPreviewUrl: null,
            showImagePreview: false
        }
    },
    methods: {
        checkAuth() {
            const token = localStorage.getItem('access_token');
            this.isAuthenticated = !!token;
        },
        goToAuth() {
            window.location.href = 'auth.html';
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
            const validFiles = files.filter(file => 
                file.type.startsWith('image/') || file.type.startsWith('video/')
            );
            
            if (validFiles.length === 0) {
                alert('Please select image or video files');
                return;
            }
            
            this.selectedFiles = [...this.selectedFiles, ...validFiles];
            this.previewUrls = this.selectedFiles.map(file => URL.createObjectURL(file));
            this.isImages = this.selectedFiles.map(file => file.type.startsWith('image/'));
        },
        removeFile(index) {
            this.selectedFiles.splice(index, 1);
            this.previewUrls.splice(index, 1);
            this.isImages.splice(index, 1);
        },
        copyLink(link) {
            navigator.clipboard.writeText(link).then(() => {
                alert('Link copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy link:', err);
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
        async uploadFiles() {
            if (this.selectedFiles.length === 0) return;

            this.uploading = true;
            this.uploadStatus = null;
            const uploadedLinks = [];

            try {
                // Get a valid token (will refresh if needed)
                const token = await getValidToken();

                // Upload all files
                for (const file of this.selectedFiles) {
                    // First upload the file
                    const uploadResponse = await axios.put(
                        `https://graph.microsoft.com/v1.0/me/drive/root:/Bug Data/${encodeURIComponent(file.name)}:/content`,
                        file,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': file.type
                            }
                        }
                    );

                    // Then create a permanent sharing link
                    const shareResponse = await axios.post(
                        `https://graph.microsoft.com/v1.0/me/drive/items/${uploadResponse.data.id}/createLink`,
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

                    uploadedLinks.push(shareResponse.data.link.webUrl);
                }

                this.uploadStatus = {
                    type: 'success',
                    message: `Successfully uploaded ${uploadedLinks.length} file(s)!`,
                    links: uploadedLinks
                };

                // Clear the selected files after successful upload
                this.selectedFiles = [];
                this.previewUrls = [];
                this.isImages = [];
            } catch (error) {
                console.error('Upload error:', error);
                let errorMessage = 'Error uploading files';
                
                if (error.response) {
                    // Check for invalid authentication token
                    if (error.response.data?.error?.code === 'InvalidAuthenticationToken') {
                        this.uploadStatus = {
                            type: 'error',
                            message: 'Your session has expired. Please authenticate again.',
                            action: {
                                text: 'Re-authenticate',
                                handler: () => this.goToAuth()
                            }
                        };
                        return;
                    }
                    
                    errorMessage += `: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`;
                } else if (error.request) {
                    errorMessage += ': No response from server';
                } else {
                    errorMessage += `: ${error.message}`;
                }

                this.uploadStatus = {
                    type: 'error',
                    message: errorMessage
                };
            } finally {
                this.uploading = false;
            }
        }
    },
    mounted() {
        this.checkAuth();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Vue.createApp(SharePointUpload).mount('#sharepoint-app');
});