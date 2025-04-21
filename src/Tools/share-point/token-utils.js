export async function getValidToken() {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const tokenExpiresAt = localStorage.getItem('token_expires_at');

    // If we don't have a token or it's expired (with 5 minute buffer)
    if (!accessToken || !tokenExpiresAt || Date.now() >= (tokenExpiresAt - 300000)) {
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const { config } = await import('./auth-config.js');
            const response = await axios.post(`https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`, {
                client_id: config.clientId,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
                scope: config.scopes
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            // Store the new tokens
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            localStorage.setItem('token_expires_at', Date.now() + (response.data.expires_in * 1000));

            return response.data.access_token;
        } catch (error) {
            console.error('Error refreshing token:', error);
            // If token refresh failed, redirect to auth page
            /*if (error.response?.data?.error === 'invalid_grant') {
                window.location.href = './auth.html';
                return;
            }*/
            throw error;
        }
    }

    return accessToken;
} 