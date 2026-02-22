import { NextResponse } from "next/server";

const token = process.env.RAINDROP_TEST_TOKEN;

interface RaindropResponse {
    result: boolean;
    count: number;
    items: {
        title: string;
        domain: string;
        link: string;
        created: string;
    }[];
}

export async function GET() {
    const response = await fetch("https://api.raindrop.io/rest/v1/raindrops/0", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        next: {
            revalidate: process.env.NODE_ENV === "production" ? 3600 : undefined, // 1h cache during prod, for dev no cache
        },
    });

    if (response.status !== 200) {
        return NextResponse.json({ error: "Non 200 response from raindrop" }, { status: 500 });
    }

    let jsonResponse: RaindropResponse = await response.json();
    return NextResponse.json(jsonResponse);
}
