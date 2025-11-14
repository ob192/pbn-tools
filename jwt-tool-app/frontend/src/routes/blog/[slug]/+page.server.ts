import { fetchBlogPost } from '$lib/utils/api';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const post = await fetchBlogPost(params.slug);

    if (!post) {
        throw error(404, 'Post not found');
    }

    return {
        post
    };
};