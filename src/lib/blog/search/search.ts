import FlexSearch from 'flexsearch';

export interface SearchPost {
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
export interface PostMetadata {
    title: string,
    description: string,
    date: string,
    category: string,
    published: boolean,
    authors: Array<string>,
    reading_time: number,
}

let searchIndex: FlexSearch.Index;
let posts: Array<SearchPost>;

export function startIndexing(data: Array<SearchPost>) {

    searchIndex = new FlexSearch.Index({ tokenize: 'forward', preset: 'performance', encode: false, },);

    data.forEach((post, i) => {
        if (post.published === true) { // check a 2nd time, that the post was really published
            const item = `${post.title} ${post.description} ${post.date} ${post.content}`;
            searchIndex.add(i, item);
        }
    });

    posts = data;
    // console.log(posts)
}

export function searchHandler(searchTerm: string): any {

    // console.log(`SearchTerm: ${searchTerm}`)
    

    const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // to any of those characters is a \ added for regex to correctly work

    // console.log(`${match}`)

    const results = searchIndex.search(match, 5) // term, limits : return idx of origin data

    let returnArray: Array<SearchPost> = []

    results.forEach((id, idx) => {
        let found_post = { ...posts[Number(id)] }; // MUST create shallow copy or deep copy
        // let found_post = JSON.parse(JSON.stringify(posts))[Number(id)] // deep
        //*
        //*
        const regex = new RegExp(searchTerm, 'gi')

        // for title:
        found_post.title = markMatches(found_post.title, searchTerm)

        // for content/description
        // console.log(found_post.description)
        let matches: number = 0;
        let indexes_found: Array<number> = [];
        let match;
        while ((match = regex.exec(found_post.description)) !== null && matches < 5) {
            indexes_found.push(match.index) // .exec only returns first match, to get all call it multiple times
            matches++
        }
        // console.log(indexes_found)
        found_post.description = indexes_found.map((word_idx, loop_index) => { // display pre and post match strings to user
            if (loop_index < 2) { // important not idx 
                const output_start = word_idx - 20
                const output_end = word_idx + 80
                const excerpt = found_post.description.substring(output_start, output_end).trim()
                // console.log(excerpt)
                // console.log("...")
                // console.log(markMatches(excerpt, searchTerm))
                // console.log("...")
                return ` ${output_start > 0 ? "..." : ""} ${markMatches(excerpt, searchTerm)} ${output_end < found_post.description.length ? "..." : ""} `
            } else {
                // console.log("forget it!")
            }
            // console.log(loop_index)
        }).join("").trim()

        // for date:
        found_post.date = markMatches(found_post.date, searchTerm)
        //*
        //*
        returnArray.push(found_post)
    });

    return returnArray
}

function markMatches(text: string, match: string) {
    const regex = new RegExp(match, 'gi')
    return text.replaceAll(regex, (match) => `<mark>${match}</mark>`)
}
