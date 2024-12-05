import { getHeaderImage } from '$lib/blog/config';
import type { PageLoad } from './$types';

export const prerender = true;

interface PostMetadata {
    title: string,
    description: string,
    date: string,
    category: string,
    published: boolean,
    authors: Array<string>,
    reading_time: number,
}
interface PostResponse {
    metadata: PostMetadata;
}
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
    header_image: any
}

export const load: PageLoad = () => {
    try {
        let search_posts_list: Array<SearchPost> = [];

        const allMarkdownFiles = import.meta.glob('/posts/*/index.md', { eager: true }); // here we use eager to load all data statically not dynamically
        const allHeaderImages = import.meta.glob('/posts/*/header/*', { eager: true });

        const iterableMarkdownFiles = Object.entries(allMarkdownFiles);
        const interableHeaderImages = Object.entries(allHeaderImages)

        const allPosts = iterableMarkdownFiles.map(([path, module], idx) => {

            const theSlug = path.split("/posts/")[1].split("/")[0]
            const blogModule = module as PostResponse

            const header_image = getHeaderImage(theSlug, interableHeaderImages)

            // add to search list:
            {
                const meta = blogModule.metadata
                let new_entry: SearchPost = {
                    title: meta.title,
                    description: meta.description,
                    date: meta.date,
                    category: meta.category,
                    published: meta.published,
                    authors: meta.authors,
                    reading_time: meta.reading_time,
                    slug: theSlug,
                    content: null,
                    header_image: header_image
                };
                search_posts_list.push(new_entry)
            }

            if (blogModule.metadata.published === true) { // check that this article should really be published
                return {
                    meta: blogModule.metadata,
                    slug: theSlug,
                    header_image: header_image
                };
            }

        })
        // *
        return { posts: allPosts, search_obj: search_posts_list }; // *
        // *
    } catch (e) {
        console.log("OMG AN ERROR")
        console.error(e)
    }
}
