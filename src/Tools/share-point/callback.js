async function handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
        document.getElementById('status').textContent = `Error: ${error}`;
        return;
    }

    if (!code) {
        document.getElementById('status').textContent = 'No authorization code received';
        return;
    }

    try {
        // Get the code verifier we stored earlier
        const codeVerifier = localStorage.getItem('code_verifier');
        // Get the config
        const { config } = await import('./auth-config.js');
        
        // Exchange the code for tokens
        const response = await axios.post(`https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`, {
            client_id: config.clientId,
            scope: config.scopes,
            code: code,
            redirect_uri: /localhost/.test(window.location.hostname) ? config.testRedirectUri : config.redirectUri,
            grant_type: 'authorization_code',
            code_verifier: codeVerifier
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Store both access token and refresh token
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('token_expires_at', Date.now() + (response.data.expires_in * 1000));
        
        // Ensure the Bug Data folder exists
        try {
            await axios.put(
                'https://graph.microsoft.com/v1.0/me/drive/root:/Bug Data:/children',
                { name: 'Bug Data', folder: {} },
                {
                    headers: {
                        'Authorization': `Bearer ${response.data.access_token}`
                    }
                }
            );
        } catch (folderError) {
            console.log('Folder creation skipped:', folderError.message);
        } finally {
            // Send message back to parent window
            window.opener.postMessage('auth-complete', window.location.origin);
        }

        // Redirect back to the main page
        window.location.href = './upload.html';
    } catch (error) {
        document.getElementById('status').textContent = `Error exchanging code: ${error.message}`;
    }
}

// Handle the callback when the page loads
window.onload = handleCallback;