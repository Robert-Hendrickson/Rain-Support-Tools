export const config = {
    tenantId: atob('OTFmYmNkMDItMmE1ZC00ZWZhLTlhNDktYjE4ZTE3MzJlNDU2'), // Base64 encoded
    clientId: atob('ZTEwNGRmMDgtMDFkMi00Njc0LWExZGEtMDgwZjQ0Njc4NDc0'),
    redirectUri: 'https://robert-hendrickson.github.io/Rain-Support-Tools/src/Tools/share-point/callback.html',
    testRedirectUri: 'http://localhost/Rain-Support-Tools/src/Tools/share-point/callback.html',
    testPort: 'http://localhost:3000/Rain-Support-Tools/src/Tools/share-point/callback.html',
    scopes: 'user.read files.readwrite',
    getRedirectUri() {
        if (window.location.hostname != 'localhost') {
            return this.redirectUri;
        } else if (window.location.hostname === 'localhost' && window.location.port === '3000') {
            return this.testPort;
        } else {
            return this.testRedirectUri;
        }
    }
};