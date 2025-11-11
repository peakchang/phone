<script>
	import favicon from "$lib/assets/favicon.svg";
	import "../app.css";
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<link
		rel="stylesheet"
		href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
	/>
	<!-- SUIT 폰트 CSS -->
	<link
		href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/static/woff2/SUIT.css"
		rel="stylesheet"
	/>

	<link
		rel="stylesheet"
		as="style"
		href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard-dynamic-subset.css"
	/>
</svelte:head>

{@render children()}

<style>
	:global(.suit-font) {
		font-family: "SUIT" !important;
	}
</style>
