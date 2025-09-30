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
            <path d="M8 21h8" />
            <path d="M12 17v4" />
            <path d="M11.5 17C10.1 16.5 6 16 6 9c0-3.5 2.5-6.5 6-6.5s6 3 6 6.5c0 7-4.1 7.5-5.5 8" />
            <path d="M14.5 9.5c0 1.2-1.1 2.5-2.5 2.5S9.5 10.7 9.5 9.5c0-1.2 1.1-2.5 2.5-2.5s2.5 1.3 2.5 2.5Z" />
        </svg>
    )
}
