import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { createSandbox } = require('@syntera-ai/sandbox');

async function main() {
	const client: any = await createSandbox({
		provider: 'docker',
		defaults: {
			image: 'lubnaibrahimu/swe-base:latest',
			cpu: 2,
			memory: 4096
		}
	});

	const sandbox: any = await client.create({ ports: [3000] });

	await sandbox.fs.write('/home/sandbox/state.txt', 'checkpoint-1');
	const snapshot = await sandbox.snapshot?.create('checkpoint-1');
	console.log('Snapshot:', snapshot);

	await sandbox.fs.write('/home/sandbox/state.txt', 'modified');
	await sandbox.snapshot?.restore('checkpoint-1');

	const restored = await sandbox.fs.read('/home/sandbox/state.txt');
	console.log('After restore:', restored);

	// Cleanup
	// await sandbox.stop();
	// await sandbox.destroy();
	// await client.shutdown();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});