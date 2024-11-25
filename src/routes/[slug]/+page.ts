import type { PageLoad } from "../$types";

export const prerender = true; // needed for Netlify deploy


export const load: PageLoad = async () => {

    try {
        const article = "test123"
        const post = await import(`../posts/${article}.md`)

        return {
            props: {
                content: post.default,
                meta: post.metadata,
            }
        }

    } catch (e) {
        console.log("IT'S AN ERROR")
        console.log(e)
    }
}
