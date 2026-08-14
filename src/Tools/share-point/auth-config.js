const SITE_MODE_KEY = 'sharepoint_site_mode';

/**
 * Feature flag for the SharePoint-site upload path.
 *
 * `?sharePointUpdate=1` turns it on, `?sharePointUpdate=0` turns it back off,
 * and the choice is persisted so the auth popups (auth.html / callback.html),
 * which never receive the query string, inherit the same mode.
 * With no flag ever set, the original OneDrive behavior is used.
 */
export function isSiteMode() {
    const param = new URLSearchParams(window.location.search).get('sharePointUpdate');
    if (param !== null) {
        localStorage.setItem(SITE_MODE_KEY, param === '1' ? '1' : '0');
    }
    return localStorage.getItem(SITE_MODE_KEY) === '1';
}

/**
 * Tokens are namespaced per mode. The two paths need different scopes, so
 * sharing one set of keys would hand a legacy-scoped token to the site path
 * (403 on upload) and mean that flipping the flag off no longer rolls back
 * cleanly. Keeping them separate makes the flag a true toggle.
 */
export function tokenKey(name) {
    return isSiteMode() ? `sp_site_${name}` : name;
}

export const config = {
    tenantId: atob('OTFmYmNkMDItMmE1ZC00ZWZhLTlhNDktYjE4ZTE3MzJlNDU2'), // Base64 encoded
    clientId: atob('ZTEwNGRmMDgtMDFkMi00Njc0LWExZGEtMDgwZjQ0Njc4NDc0'),
    redirectUri: 'https://robert-hendrickson.github.io/Rain-Support-Tools/src/Tools/share-point/callback.html',
    testRedirectUri: 'http://localhost/Rain-Support-Tools/src/Tools/share-point/callback.html',
    testPort: 'http://localhost:3000/Rain-Support-Tools/src/Tools/share-point/callback.html',
    // Reaching a shared site drive needs .All; the OneDrive path does not, so
    // legacy users keep their narrower consent.
    legacyScopes: 'user.read files.readwrite',
    siteScopes: 'user.read files.readwrite.all',
    getScopes() {
        return isSiteMode() ? this.siteScopes : this.legacyScopes;
    },
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

// Target for uploads: a shared SharePoint site rather than the user's OneDrive.
export const sharePointConfig = {
    siteId: 'quiltsoftware.sharepoint.com,687ebfb2-db2d-4d4e-a5b6-c26c31a5821b,9193ef89-c47b-4caf-a5a5-24ea533613a2',
    siteUrl: 'https://quiltsoftware.sharepoint.com/sites/RainAgentRecordings',
    // Optional: set to upload to a specific document library instead of the
    // site's default one. Leave blank to use the default ("Documents").
    driveId: '',
    uploadFolder: 'Bug Data',
    // Base Graph URL for every drive call (upload, session, createLink).
    getDriveUrl() {
        if (!isSiteMode()) {
            return 'https://graph.microsoft.com/v1.0/me/drive';
        }
        return this.driveId
            ? `https://graph.microsoft.com/v1.0/drives/${this.driveId}`
            : `https://graph.microsoft.com/v1.0/sites/${this.siteId}/drive`;
    }
};
