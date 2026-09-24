import { TranscriptionStatus } from "./transcription-status";

export interface JournalEntry {
    id: string;
    userId: string;
    objectKey: string;
    created: string | null;
    uploaded: string;
    name: string;
    fileName: string;
    description: string;
    secLength: number;
    sizeInBytes: number;
    title: string;
    favorite: boolean;
    transcription: string | null;
    wordCount: number;
    summary: string | null;
    validated: boolean;
    transcribed: TranscriptionStatus;
}