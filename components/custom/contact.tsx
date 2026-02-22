"use client";

import dynamic from "next/dynamic";

// dynamically load contact links so scrapers without JS execution are cooked
const ContactLink = dynamic(() => import("@/components/custom/contact-links"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

export default function ContactMethods() {
    return <ContactLink />;
}
