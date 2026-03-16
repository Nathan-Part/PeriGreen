import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

type ImpactCounterProps = {
    value: number;
    durationMs?: number;
    prefix?: string;
    suffix?: string;
};

export function ImpactCounter({
    value,
    durationMs = 1400,
    prefix = '',
    suffix = '',
}: ImpactCounterProps) {
    const ref = useRef<HTMLSpanElement | null>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (!isInView) {
            return;
        }

        let startTime = 0;
        let frameId = 0;

        const tick = (timestamp: number) => {
            if (!startTime) {
                startTime = timestamp;
            }

            const progress = Math.min((timestamp - startTime) / durationMs, 1);
            const nextValue = Math.round(progress * value);
            setDisplayValue(nextValue);

            if (progress < 1) {
                frameId = window.requestAnimationFrame(tick);
            }
        };

        frameId = window.requestAnimationFrame(tick);

        return () => window.cancelAnimationFrame(frameId);
    }, [durationMs, isInView, value]);

    return (
        <span ref={ref}>
            {prefix}
            {displayValue}
            {suffix}
        </span>
    );
}
