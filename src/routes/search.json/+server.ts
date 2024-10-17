import { json } from '@sveltejs/kit'
import type { Element } from '$lib/types';
import type { Note } from '$lib/notes_files_desc.js';
import { notes } from '$lib/notes_files_desc.js';


export const prerender = true

export async function GET({fetch}) {

    // Get the post from the API
    const response = await fetch('api/posts');
	const posts: Element[] = await response.json();

    // For each post, add a 'pagine/' at the beginning
    posts.forEach(post => {
        post.slug = 'pagine/' + post.slug;
    });


    
    const res2 = await fetch('api/progetti');
    const progetti: Element[] = await res2.json();

    // For each post, add a 'pagine/' at the beginning
    progetti.forEach(post => {
        post.slug = 'progetti/' + post.slug;
    });

    // Return the post
    return json({ posts, progetti});
}
