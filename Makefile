install:
	deno cache mod.ts
	deno cache tests/*

test:
	deno test tests/*

test-coverage:
	deno test --coverage=coverage --unstable tests/*
	deno coverage --unstable coverage --lcov > coverage/lcov.info