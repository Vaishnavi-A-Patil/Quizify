import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.2a1 1 0 0 0 1 1h.3a1.8 1.8 0 0 1 1.7 1.2 2 2 0 0 1-1.3 2.6l-2.4.9a1.5 1.5 0 0 0-1.2 2.1v.2c0 .5.4 1 1 1h.3a1.8 1.8 0 0 1 1.7 1.2 2 2 0 0 1-1.3 2.6l-2.4.9a1.5 1.5 0 0 0-1.2 2.1v.2a2.5 2.5 0 0 1-5 0v-.2a1.5 1.5 0 0 0-1.2-2.1l-2.4-.9a2 2 0 0 1-1.3-2.6 1.8 1.8 0 0 1 1.7-1.2h.3a1 1 0 0 0 1-1V4.5A2.5 2.5 0 0 1 7.5 2" />
            <path d="M14.5 2a2.5 2.5 0 0 0-2.5 2.5v1.2a1 1 0 0 1-1 1h-.3a1.8 1.8 0 0 0-1.7 1.2 2 2 0 0 0 1.3 2.6l2.4.9a1.5 1.5 0 0 1 1.2 2.1v.2c0 .5-.4 1-1 1h-.3a1.8 1.8نوات0 0 0-1.7 1.2 2 2 0 0 0 1.3 2.6l2.4.9a1.5 1.5 0 0 1 1.2 2.1v.2a2.5 2.5 0 0 0 5 0v-.2a1.5 1.5 0 0 1 1.2-2.1l2.4-.9a2 2 0 0 0 1.3-2.6 1.8 1.8 0 0 0-1.7-1.2h-.3a1 1 0 0 1-1-1V4.5A2.5 2.5 0 0 0 16.5 2Z" />
        </svg>
    )
}
