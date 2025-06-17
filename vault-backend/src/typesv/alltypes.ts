/* eslint-disable @typescript-eslint/no-explicit-any */
export interface VaultItems {
    id: string;
    userId: string;
    title: string;
    content: string | null;
    isEncrypted: boolean;
    unlockAt: Date;
    unlocked: boolean;
    createdAt: Date;
} 