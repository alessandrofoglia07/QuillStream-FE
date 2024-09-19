import { ZodError } from "zod";
import type { Notification } from "@/types";
import { AxiosError } from "axios";

export const handleError = (err: unknown, setError: (error: string) => void = console.error, defaultMessage = 'An error occurred. Please try again.'): { message: string; notification: Notification; } => {
    const infoErrors = ['User is already an editor', 'No changes detected'];
    const output = (result: string) => {
        setError(result);
        return {
            message: result,
            notification: Object.freeze({
                message: result,
                type: infoErrors.includes(result) ? 'info' : 'error',
            })
        };
    };
    if (err instanceof ZodError) {
        return output(err.errors[0]?.message || defaultMessage);
    } else if (err instanceof Error) {
        if (err instanceof AxiosError) {
            return output(err.response?.data?.message || err.message || defaultMessage);
        }
        return output(err.message || defaultMessage);
    } else if (typeof err === 'string') {
        return output(err || defaultMessage);
    } else {
        return output(defaultMessage);
    }
};