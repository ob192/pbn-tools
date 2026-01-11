export const GA_MEASUREMENT_ID = 'G-3WGLQKZJCR';

type GTagEvent = {
    action: string;
    category?: string;
    label?: string;
    value?: number;
};

export const gaEvent = ({
                            action,
                            category,
                            label,
                            value,
                        }: GTagEvent) => {
    if (typeof window === 'undefined') return;
    if (!(window as any).gtag) return;

    (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value,
    });
};
