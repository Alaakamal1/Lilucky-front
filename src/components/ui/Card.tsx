import React, { ReactNode } from "react";

type CardProps = {
    className?: string;
    children: ReactNode;
};

export function Card({ className = "", children }: CardProps) {
    return (
        <div className={`rounded-2xl border bg-white shadow-sm ${className}`}>
        {children}
        </div>
    );
}

export function CardContent({ className = "", children }: CardProps) {
    return (
        <div className={`p-4 ${className}`}>
        {children}
        </div>
    );
}