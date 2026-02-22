import { execSync } from "node:child_process";

const headers = [
    { key: "X-Clacks-Overhead", value: "GNU Hans Steiner, Terry Davis" }, // https://xclacksoverhead.org/
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
        unoptimized: true,
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
        ];
    },
};

export default nextConfig;
