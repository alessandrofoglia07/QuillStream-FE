export interface Notification {
    message: string;
    type: 'error' | 'success' | 'info';
    duration?: number;
}