import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Note {
    id: bigint;
    content: string;
    timestamp: Time;
}
export type Time = bigint;
export interface backendInterface {
    createNote(content: string): Promise<Note>;
    deleteNote(id: bigint): Promise<void>;
    editNote(id: bigint, newContent: string): Promise<Note>;
    getNextNotification(): Promise<string | null>;
    getNotes(): Promise<Array<Note>>;
    processNotifications(): Promise<Time>;
    setBreakReminder(interval: bigint): Promise<void>;
}
