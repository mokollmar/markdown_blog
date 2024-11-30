
import profile_picture from '$lib/assets/profile_picture.jpeg';
import fallback_profile from '$lib/assets/fallback_profile.webp';

// Config
interface Config {
    siteUrl: string,
    siteName: string,
    siteDescription: string,
    twitterHandle: string,
    blogUrl: string,
    image_ratio_list: string,
    image_ratio_view: string,
    profiles: ProfPics
}
interface ProfPics {
    [key: string]: {
        pic: string,
        txt: string
    };
}


export const config: Config = {
    siteUrl: "https://netlify.com",
    siteName: "mdBlog",
    siteDescription: 'mdBlog - create How-to guides in Seconds',
    twitterHandle: "@mdBlog",
    blogUrl: "",
    image_ratio_list: "4 / 3",
    image_ratio_view: "8 / 5",
    profiles: {
        "001": {
            pic: profile_picture,
            txt: "@mokollmar"
        },
        "_": {
            pic: fallback_profile,
            txt: "Anonymous"
        }
    }
}


// Header Images:
interface ImgModule {
    default: string,
}
export function getHeaderImage(slug: string, iterable: [string, unknown][]): string | undefined {
    let header_image: Array<any> = iterable.map(([path, module]) => {
        if (path.includes(slug)) {
            const img_module = module as ImgModule
            return img_module?.default
        }
    })
    header_image = [...header_image].filter((element) => element !== undefined)

    return header_image.join("").length != 0 ? header_image.join("") : undefined;
}

// TOC:
export interface ContentEntry {
    id: string,
    title: string,
    type: string | null
}
export function exportTOC(): Array<ContentEntry> {

    console.log("exporting ...")

    // for now only h2, most important and nice, clean

    let return_array: Array<ContentEntry> = []

    document.getElementById("blog-article")!.querySelectorAll("h2").forEach(element => {

        if (element.textContent) {
            // set the id:
            const id_string = element.textContent?.split(" ").toString().toLowerCase().replaceAll(",", "-")
            const prefix = config.siteName.toLowerCase()
            element.id = `${prefix}-${id_string}-xyz`

            console.log(element.id)

            return_array.push({
                id: element.id,
                title: element.textContent!,
                type: null
            })
        }


    });

    console.log(return_array)

    return return_array;
}