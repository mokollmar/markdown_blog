<script lang="ts">
	import { config } from '$lib/blog/config';

    export let metadata_category
    export let metadata_name
</script>

<!-- Breadcrumbs -->
<ol class="breadcrumb flex w-auto items-center justify-start rounded-lg py-2">
	<li class="crumb"><a class="anchor" href={config.blogUrl}>Blog</a></li>
	<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
	<li class="crumb">
		<a class="anchor" href={`${config.blogUrl}/?tag=${metadata_category}`}>{metadata_name}</a>
	</li>
</ol>
