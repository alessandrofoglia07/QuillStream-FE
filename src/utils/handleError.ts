import { ZodError } from "zod";

export const handleError = (err: unknown, setError: (error: string) => void = console.error, defaultMessage = 'An error occurred. Please try again.') => {
    const output = (result: string) => {
        setError(result);
        return result;
    };
    if (err instanceof ZodError) {
        output(err.errors[0]?.message || defaultMessage);
    } else if (err instanceof Error) {
        output(err.message || defaultMessage);
    } else if (typeof err === 'string') {
        output(err || defaultMessage);
    } else {
        output(defaultMessage);
    }
};