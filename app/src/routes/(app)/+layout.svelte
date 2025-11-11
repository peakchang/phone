<script>
	import favicon from "$lib/assets/favicon.svg";
	
	let { children } = $props();
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
	/>
	<script
		src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
	></script>
</svelte:head>

<div class="max-w-[1100px] text-right mx-auto mt-1 mb-10 text-sm">
	<span>신청내역조회</span>
	<span class="mx-1">|</span>
	<span>고객센터</span>
	<span class="mx-1">|</span>
	<span>회원가입</span>
	<span class="mx-1">|</span>
	<span>로그인</span>
</div>

<div class="hidden md:flex justify-center items-center p-4 bg-white shadow-md">
	<div class="w-[255px] mr-14">
		<img src="/logo.jpg" alt="" />
	</div>
	<div>
		<ul class="flex justify-between gap-16 text-xl font-bold">
			<li>키즈폰</li>
			<li>갤럭시</li>
			<li>애플</li>
			<li>특가폰</li>
			<li>인터넷</li>
			<li>구매후기</li>
		</ul>
	</div>
</div>

<div class="block md:hidden">
	<div class="w-[205px] mx-auto mb-2">
		<img src="/logo.jpg" alt="" />
	</div>
	<div class="py-2">
		<ul
			class="flex justify-around border-t border-b border-gray-400 py-3 px-5 text-sm font-extrabold"
		>
			<li>키즈폰</li>
			<li>갤럭시</li>
			<li>애플</li>
			<li>특가폰</li>
			<li>인터넷</li>
			<li>구매후기</li>
		</ul>
	</div>
</div>

{@render children()}
<div class="max-w-[1100px] mx-auto mt-10 pt-5 pb-10 border-t">
	푸터영역
</div>