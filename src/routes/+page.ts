import { getHeaderImage } from '$lib/config';
import type { PageLoad } from './$types';

export const prerender = true;

interface SearchPost {
    title: string,
    description: string,
    date: string,
    category: string,
    published: boolean,
    authors: Array<string>,
    reading_time: number,
    slug: string | null,
    content: string | null,
    header_image: string | undefined
}
interface PostResponse {
    metadata: SearchPost;
}
interface PostMetadata {
    title: string,
    description: string,
    date: string,
    category: string,
    published: boolean,
    authors: Array<string>,
    reading_time: number,
}
interface Post {
    meta: PostMetadata | undefined,
    slug: string | undefined,
    header_image: string | undefined
}

export const load: PageLoad = () => {
    try {
        const allMarkdownFiles = import.meta.glob('../posts/*/index.md', { eager: true }); // here we use eager to load all data statically not dynamically
        const allHeaderImages = import.meta.glob('../posts/*/header/*', { eager: true });

        const iterableMarkdownFiles = Object.entries(allMarkdownFiles);
        const interableHeaderImages = Object.entries(allHeaderImages)

        const allPosts: Array<Post> | undefined = iterableMarkdownFiles.map(([path, module], idx) => {

            const theSlug = path.split("/posts/")[1].split("/")[0]
            const blogModule = module as PostResponse

            const header_image = getHeaderImage(theSlug, interableHeaderImages)


            if (blogModule.metadata.published === true) { // check that this article should really be published
                return {
                    meta: blogModule.metadata,
                    slug: theSlug,
                    header_image: header_image
                };
            }

        })
        // *
        return { posts: allPosts }; // *
        // *
    } catch (e) {
        console.log("OMG AN ERROR")
        console.error(e)
    }
}
