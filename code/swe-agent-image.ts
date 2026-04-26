import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { createSandbox } = require('@syntera-ai/sandbox');

async function main() {
	const sweClient: any = await createSandbox({
		provider: 'docker',
		defaults: { image: 'lubnaibrahimu/swe-agent:latest', cpu: 2, memory: 4096 }
	});

	const sweSandbox: any = await sweClient.create();

	const checks = await Promise.all([
		sweSandbox.exec('node --version'),
		sweSandbox.exec('python3 --version'),
		sweSandbox.exec('go version'),
		sweSandbox.exec('rustc --version'),
		sweSandbox.exec('tsc --version'),
		sweSandbox.exec('rg --version'),
		sweSandbox.exec('psql --version'),
		sweSandbox.exec('docker --version'),
	]);
	checks.forEach((r: any, i: number) => console.log(`Tool ${i}:`, r.stdout.trim()));
	console.assert(checks.every((r: any) => r.exitCode === 0));

	await sweSandbox.destroy();
	// await sweClient.shutdown();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});