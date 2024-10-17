import { json } from '@sveltejs/kit'
import type { Element } from '$lib/types';


export const prerender = true

export async function GET({fetch}) {

    // Get the post from the API
    const response = await fetch('api/posts');
	const posts: Element[] = await response.json();
    
    const res2 = await fetch('api/progetti');
    const progetti: Element[] = await res2.json();

    // Return the post
    return json({ posts, progetti });
}
