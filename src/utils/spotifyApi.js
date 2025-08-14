// spotifyApi.js
export async function getAccessToken() {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT;
    const clientSecret = import.meta.env.VITE_SPOTIFY_SECRET;

    console.log('Client ID:', import.meta.env.VITE_SPOTIFY_CLIENT);
    console.log('Client Secret exists:', Boolean(import.meta.env.VITE_SPOTIFY_SECRET));

    // Basic check if credentials exist
    if (!clientId || !clientSecret) {
        throw new Error('Spotify client credentials not configured');
    }

    try {
        // Create the authorization header
        const authHeader = 'Basic ' + btoa(`${clientId}:${clientSecret}`);

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": authHeader,
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Spotify API error: ${errorData.error_description || response.statusText}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
} 