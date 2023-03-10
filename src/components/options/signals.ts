import { signal } from "@preact/signals-react";
import { StorageItem } from "../../rules";

type Nullable<T> = T | null;

export const Rules = signal<StorageItem[]>([]);
export const Rule = signal<StorageItem | null>(null);
export const OpenModal = signal<boolean>(false);
