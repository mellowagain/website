const headers = [
    { key: "X-Clacks-Overhead", value: "GNU Hans Steiner, Terry Davis" }, // https://xclacksoverhead.org/
    { key: "X-ServerNickname", value: "Pixel" },
    { key: "X-Hacker", value: "Please open a issue on https://github.com/mellowagain/website" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
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
