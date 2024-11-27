import { getHeaderImage } from "$lib/func";
import { error } from "@sveltejs/kit";
import type { PageLoad } from './$types';

export const prerender = true; // needed for Netlify deploy

export const load: PageLoad = async ({ params }) => {

    try {
        const post = await import(`../../posts/${params.slug}/index.md`)

        // get Header Image
        const allHeaderImages = import.meta.glob('../../posts/*/header/*', { eager: true });
        const interableHeaderImages = Object.entries(allHeaderImages)
        const header_image = getHeaderImage(params.slug, interableHeaderImages)

        return {
            props: {
                content: post.default,
                meta: post.metadata,
                header_image: header_image
            }
        }

    } catch (e) {
        console.log("IT'S AN ERROR")
        console.log(e)
        error(404, `Could not find ${params.slug}`)
    }
}
