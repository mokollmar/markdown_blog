import { startIndexing, searchHandler } from './search'

// listen for messages
addEventListener('message', async (e) => {
    const { type, payload } = e.data

    if (type === 'load') {
        console.warn("Worker Loading")
        console.warn(payload.search_obj)
        startIndexing(payload.search_obj)
        postMessage({ type: 'ready' })
    }

    if (type === 'search') {
        const searchTerm = payload.search_term
        console.warn(`Payload searchTerm - ${searchTerm}`)
        const results = searchHandler(searchTerm)
        postMessage({ type: 'results', payload: { results, searchTerm } })
    }
})


// only for processing article search