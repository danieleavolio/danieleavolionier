import { writable } from "svelte/store";

export const categoryStore = writable<string | null>(null);

export const projectsCategoryStore = writable<string | null>(null);