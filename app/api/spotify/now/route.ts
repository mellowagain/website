import { getAccessToken } from "@/lib/spotify";

interface TrackObject {
    type: "track";
    name: string;
    album: {
        name: string;
    };
    artists: {
        name: string;
    }[];
}

interface EpisodeObject {
    type: "episode";
    name: string;
    show: {
        name: string;
    };
}

interface SpotifyResponse {
    is_playing: boolean;
    current_playing_type?: "track" | "episode" | "ad" | "unknown" | null;
    item?: TrackObject | EpisodeObject | null;
}

interface RouteResponse {
    isPlaying: boolean;
    track?: string | null;
    artist?: string | null;
    album?: string | null;
}

function objectToResponse(object: SpotifyResponse): RouteResponse {
    if (!object.is_playing || !object.item) {
        return { isPlaying: false };
    }

    switch (object.item.type) {
        case "track":
            return {
                isPlaying: true,
                album: object.item.album.name,
                artist: object.item.artists.map((artist) => artist.name).join(", "),
                track: object.item.name,
            };
        case "episode":
            return {
                isPlaying: true,
                album: object.item.show.name,
                artist: object.item.show.name,
                track: object.item.name,
            };
    }
}

export async function GET() {
    const access_token = await getAccessToken();

    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        next: {
            revalidate: process.env.NODE_ENV === "production" ? 30 : undefined, // 30s cache during prod, for dev no cache
        }
    });

    if (response.status === 204 || response.status > 400) {
        return Response.json({ isPlaying: false } as RouteResponse);
    }

    let jsonResponse: SpotifyResponse = await response.json();

    if (!jsonResponse.is_playing || !jsonResponse.item) {
        return Response.json({ isPlaying: false } as RouteResponse);
    }

    return Response.json(objectToResponse(jsonResponse));
}
