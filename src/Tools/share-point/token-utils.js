// Forward the loader's version stamp (see sp-loader.js) so this module's own
// dependency is fetched at the same freshness as everything else.
const V = new URL(import.meta.url).search;
const { tokenKey, config } = await import(`./auth-config.js${V}`);

export async function getValidToken() {
    const accessToken = localStorage.getItem(tokenKey('access_token'));
    const refreshToken = localStorage.getItem(tokenKey('refresh_token'));
    const tokenExpiresAt = localStorage.getItem(tokenKey('token_expires_at'));

    // If we don't have a token or it's expired (with 5 minute buffer)
    if (!accessToken || !tokenExpiresAt || Date.now() >= (tokenExpiresAt - 300000)) {
        if (!refreshToken) {
            return {token: null, error: 'No refresh token available'};
        }

        try {
            const response = await axios.post(`https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`, {
                client_id: config.clientId,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
                scope: config.getScopes()
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            // Store the new tokens
            localStorage.setItem(tokenKey('access_token'), response.data.access_token);
            localStorage.setItem(tokenKey('refresh_token'), response.data.refresh_token);
            localStorage.setItem(tokenKey('token_expires_at'), Date.now() + (response.data.expires_in * 1000));

            return response.data.access_token;
        } catch (error) {
            console.error('Error refreshing token:', error);
            // If token refresh failed, redirect to auth page
            /*if (error.response?.data?.error === 'invalid_grant') {
                window.location.href = './auth.html';
                return;
            }*/
            return {token: null, error: error.response?.data?.error};
        }
    }

    return accessToken;
}