interface SpotifyResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string | null;
    scope: string;
}

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

// https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens
export async function getAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            Authorization: `Basic ${basic}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refresh_token!,
        }),
        next: {
            revalidate: 3600, // spotify access tokens are valid for one hour
        },
    });

    const json: SpotifyResponse = await response.json();

    if (json.refresh_token) {
        console.warn("received new refresh token for some reason?");
    }

    return json.access_token;
}
