import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { createSandbox } = require('@syntera-ai/sandbox');

async function main() {
	const client: any = await createSandbox({
		provider: 'docker',
		defaults: {
			image: 'lubnaibrahimu/swe-agent:latest',
			cpu: 2,
			memory: 4096
		}
	});

	const sandbox: any = await client.create({ ports: [3000] });

	const state = await sandbox.getState();
	console.log('Sandbox state:', state);

	await sandbox.waitUntilRunning(30000);
	console.log('Sandbox is running');

	// await sandbox.stop();
	// await sandbox.destroy();
	// await client.shutdown();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});