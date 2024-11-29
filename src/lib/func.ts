// Functions:
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
            element.id = `-${id_string}-xyz`

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