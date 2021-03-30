install:
	deno cache mod.ts
	deno cache tests/*

test:
	deno test tests/*