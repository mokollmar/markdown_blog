import type { PageLoad } from "./$types";

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
export interface Post {
    title: string,
    description: string,
    date: string,
    category: string,
    published: boolean,
    authors: Array<string>,
    reading_time: number,
    slug: string | null,
    content: string | null,
}

export const load: PageLoad = () => {
    try {
        let posts_list: Array<Post> = [];

        const allMarkdownFiles = import.meta.glob('../posts/*/index.md', { eager: true }); // here we use eager to load all data statically not dynamically
        const iterableMarkdownFiles = Object.entries(allMarkdownFiles);

        iterableMarkdownFiles.map(([path, module], idx) => {

            const theSlug = path.split("/posts/")[1].split("/")[0]
            const blogModule = module as PostResponse

            // add to list:
            {
                const meta = blogModule.metadata
                let new_entry: Post = {
                    title: meta.title,
                    description: meta.description,
                    date: meta.date,
                    category: meta.category,
                    published: meta.published,
                    authors: meta.authors,
                    reading_time: meta.reading_time,
                    slug: theSlug,
                    content: null,
                };
                posts_list.push(new_entry)
            }
        })
        return { posts: posts_list }; // *
    } catch (e) {
        console.log("OMG AN ERROR")
        console.error(e)
    }
}
