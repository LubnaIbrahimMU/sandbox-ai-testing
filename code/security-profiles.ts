import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { createSandbox, STRICT_SECURITY_PROFILE } = require('@syntera-ai/sandbox');

async function main() {
	const client: any = await createSandbox({
		provider: 'docker',
		defaults: {
			image: 'lubnaibrahimu/swe-base:latest',
			cpu: 2,
			memory: 4096
		}
	});

	const strictSandbox: any = await client.create({ securityProfile: STRICT_SECURITY_PROFILE });
	const capResult = await strictSandbox.exec('cat /proc/1/status | grep Cap');
	console.log('Capabilities:', capResult.stdout);

	await strictSandbox.destroy();

	// await client.shutdown();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});