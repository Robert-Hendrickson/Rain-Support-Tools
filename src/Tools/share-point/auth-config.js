/**
 * Token storage keys keep the `sp_site_` prefix permanently, even though the
 * OneDrive path is gone.
 *
 * Tokens minted under the old flow carry the narrower `files.readwrite` scope and
 * live under bare keys (`access_token`, ...). Reading those bare keys here would
 * hand a legacy-scoped token to code that uploads to the site drive, which fails
 * with a 403 partway through the tool. Keeping the prefix means those old entries
 * are simply never read: anyone still holding one gets a clean auth prompt instead
 * of a mid-upload error, and testers already migrated keep working untouched.
 */
export function tokenKey(name) {
    return `sp_site_${name}`;
}

// Storage written by the pre-cutover flow: bare-key tokens from the OneDrive path
// and the retired feature-flag entry. Nothing reads these anymore.
const LEGACY_KEYS = ['access_token', 'refresh_token', 'token_expires_at', 'sharepoint_site_mode'];

/**
 * Drops leftover pre-cutover storage so stale credentials don't sit in localStorage
 * indefinitely. Call this only *after* the new tokens are written -- clearing first
 * would leave a user with neither set if the write failed partway.
 *
 * Self-limiting: once a user is cleaned it finds nothing and does nothing.
 */
export function clearLegacyStorage() {
    const removed = LEGACY_KEYS.filter(key => localStorage.getItem(key) !== null);
    removed.forEach(key => localStorage.removeItem(key));
    if (removed.length) {
        console.log('Cleared pre-cutover SharePoint storage:', removed.join(', '));
    }
}

export const config = {
    tenantId: atob('OTFmYmNkMDItMmE1ZC00ZWZhLTlhNDktYjE4ZTE3MzJlNDU2'), // Base64 encoded
    clientId: atob('ZTEwNGRmMDgtMDFkMi00Njc0LWExZGEtMDgwZjQ0Njc4NDc0'),
    redirectUri: 'https://robert-hendrickson.github.io/Rain-Support-Tools/src/Tools/share-point/callback.html',
    testRedirectUri: 'http://localhost/Rain-Support-Tools/src/Tools/share-point/callback.html',
    testPort: 'http://localhost:3000/Rain-Support-Tools/src/Tools/share-point/callback.html',
    // Reaching a shared site drive requires .All; the narrower files.readwrite only
    // reaches the caller's own OneDrive.
    scopes: 'user.read files.readwrite.all',
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

// Uploads go to a shared SharePoint site rather than any individual's OneDrive.
export const sharePointConfig = {
    siteId: 'quiltsoftware.sharepoint.com,687ebfb2-db2d-4d4e-a5b6-c26c31a5821b,9193ef89-c47b-4caf-a5a5-24ea533613a2',
    siteUrl: 'https://quiltsoftware.sharepoint.com/sites/RainAgentRecordings',
    // Optional: set to upload to a specific document library instead of the
    // site's default one. Leave blank to use the default ("Documents").
    driveId: '',
    uploadFolder: 'Bug Data',
    // Base Graph URL for every drive call (upload, session, createLink).
    getDriveUrl() {
        return this.driveId
            ? `https://graph.microsoft.com/v1.0/drives/${this.driveId}`
            : `https://graph.microsoft.com/v1.0/sites/${this.siteId}/drive`;
    }
};
