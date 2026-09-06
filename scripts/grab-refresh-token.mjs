#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";
import readline from "node:readline/promises";

const REDIRECT_URI = "http://127.0.0.1:3000";

// only what app/api/spotify/{now,recent} actually call
const SCOPES = "user-read-currently-playing user-read-recently-played";

const env = Object.fromEntries(
    fs
        .readFileSync(".env", "utf8")
        .split("\n")
        .filter((line) => line.includes("=") && !line.trim().startsWith("#"))
        .map((line) => {
            const [key, ...rest] = line.split("=");
            return [
                key.trim(),
                rest
                    .join("=")
                    .trim()
                    .replace(/^["']|["']$/g, ""),
            ];
        })
);

const client_id = env.SPOTIFY_CLIENT_ID;
const client_secret = env.SPOTIFY_CLIENT_SECRET;

if (!client_id || !client_secret) {
    console.error("error: SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in .env");
    process.exit(1);
}

const authorizeUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    response_type: "code",
    client_id,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    show_dialog: "true", // otherwise an already-authorized account skips straight through
})}`;

console.log(`\n1. open this and approve:\n\n${authorizeUrl}\n`);
console.log("2. the browser will fail to connect -- that's fine, copy its address bar.\n");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const answer = (await rl.question("3. paste the URL here: ")).trim();
rl.close();

const code = URL.parse(answer)?.searchParams.get("code");

if (!code) {
    console.error("error: no ?code= in that URL (did Spotify send ?error= instead?)");
    process.exit(1);
}

const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
        Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
    }),
});

const json = await response.json();

if (!response.ok) {
    console.error(`error: token exchange failed (${response.status}): ${json.error_description ?? json.error}`);
    process.exit(1);
}

console.log(`\nrefresh token: ${json.refresh_token}\n`);
console.log("put that in .env as SPOTIFY_REFRESH_TOKEN, and in the Vercel env vars.");
