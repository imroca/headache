import { signal } from "@preact/signals-react";
import { IItem } from "../../common/interfaces";

type Nullable<T> = T | null;

export const Rules = signal<IItem[]>([]);
export const Rule = signal<IItem | null>(null);
export const OpenModal = signal<boolean>(false);
