import { writable } from "svelte/store";

const isOpened = writable(false);
export default isOpened;