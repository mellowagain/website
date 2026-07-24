import { execSync } from "node:child_process";

const headers = [
    { key: "X-Clacks-Overhead", value: "GNU Lola Belying, Hans Steiner" }, // https://xclacksoverhead.org/
    { key: "X-ServerNickname", value: "Pixel" },
    { key: "X-Hacker", value: "Please open a issue on https://github.com/mellowagain/website" },
];

const gitHash = execSync("git rev-parse --short HEAD").toString().trim();
const gitDate = execSync('git log -1 --format=%cd --date=format:"%d %B %Y"').toString().trim();

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: false,
        localPatterns: [
            {
                pathname: "/images/**/*.{jpg,png,svg}",
                search: "",
            },
        ],
    },
    env: {
        NEXT_PUBLIC_GIT_HASH: gitHash,
        NEXT_PUBLIC_GIT_DATE: gitDate,
    },
    async headers() {
        return [
            {
                source: "/",
                headers: headers,
            },
            {
                source: "/:path*",
                headers: headers,
            },
            {
                source: "/.well-known/openpgpkey/policy",
                headers: [
                    { key: "Content-Type", value: "text/plain" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                ],
            },
            {
                source: "/.well-known/openpgpkey/hu/:hash",
                headers: [
                    { key: "Content-Type", value: "application/octet-stream" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                ],
            },
        ];
    },
};

export default nextConfig;
