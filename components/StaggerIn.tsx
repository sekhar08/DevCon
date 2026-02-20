"use client";

import { motion } from "motion/react";
import React from "react";

export function StaggerContainer({
    children,
    className,
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                hidden: {},
                show: {
                    transition: {
                        staggerChildren: 0.08,
                        delayChildren: delay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function FadeInUp({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
                show: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
