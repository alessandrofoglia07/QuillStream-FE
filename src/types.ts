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

export interface Document {
    documentId: string;
    authorId: string;
    authorName: string;
    title: string;
    content: string;
    editors: string[];
    createdAt: string;
    updatedAt: string;

    // UserDocument fields
    user: {
        userId: string;
        role: 'author' | 'editor';
        lastAccessedAt: string;
    };
}

export interface UserDocument {
    userId: string; // partition key
    documentId: string; // sort key
    role: 'author' | 'editor';
    lastAccessedAt: string;
    createdAt: string;
}

export interface WebSocketConnection {
    connectionId: string; // partition key
    documentId: string; // sort key
    userId: string;
}

export type MainPageSortOption = 'Last accessed by me' | 'Title' | 'Last modified';