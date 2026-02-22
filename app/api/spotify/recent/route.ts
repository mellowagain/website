import { getAccessToken } from "@/lib/spotify";

interface SpotifyResponse {
    items: {
        track: {
            name: string;
            artists: {
                name: string;
            }[];
        };
        played_at: string;
    }[];
}

interface RouteResponse {
    success: boolean;
    items: {
        name: string;
        artist: string;
        playedAt: string;
    }[];
}

function mutateToResponse(spotify: SpotifyResponse): RouteResponse {
    return {
        success: true,
        items: spotify.items.map((track) => {
            return {
                name: track.track.name,
                artist: track.track.artists.map((artist) => artist.name).join(", "),
                playedAt: track.played_at,
            };
        }),
    };
}

export async function GET() {
    const access_token = await getAccessToken();

    const response = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=6", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        next: {
            revalidate: process.env.NODE_ENV === "production" ? 30 : undefined, // 30s cache during prod, for dev no cache
        },
    });

    if (response.status !== 200) {
        return Response.json({ success: false, items: [] });
    }

    let jsonResponse: SpotifyResponse = await response.json();

    if (!jsonResponse.items) {
        return Response.json({ success: false, items: [] });
    }

    return Response.json(mutateToResponse(jsonResponse));
}
