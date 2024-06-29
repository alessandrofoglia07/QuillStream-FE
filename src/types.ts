export interface Notification {
    message: string;
    type: 'error' | 'success' | 'info';
    /**
     * Duration in milliseconds.
     * ```ts
     * 10000 // -> Default duration (10 seconds)
     * -1 // -> Infinite duration
     * ```
     */
    duration?: number;
}