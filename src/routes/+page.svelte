<script lang="ts">
    import { onMount } from "svelte";
    import type { Post } from "./proxy+page.js";

    export let data;

    let blog_list: Array<Post> | undefined = data?.posts;

    onMount(() => {
        console.log(data);
        console.log(blog_list);
    });
</script>

{#if blog_list}
    <div class="flex flex-col">

        <h1 class="text-center text-5xl my-5">My Blog</h1>

        {#each blog_list as article}
        <div class="flex flex-col p-5 m-5 bg-orange-400 rounded-lg">
            <p class="font-bold">{article.title}</p>
            <p>{article.description}</p>
        </div>
        {/each}
    </div>
{/if}
