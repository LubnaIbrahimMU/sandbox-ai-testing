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

	const sb1: any = await client.create({ labels: { env: 'test', project: 'alpha' } });
	const sb2: any = await client.create({ labels: { env: 'test', project: 'beta' } });

	const found = await client.findOne({ labels: { project: 'alpha' } });
	console.assert(found.id === sb1.id, 'findOne returned wrong sandbox');

	const all = await client.list({ labels: { env: 'test' } });
	console.log('Sandboxes found:', all.length, 'Expected: 2');
	console.log('sb1.id:', sb1.id, 'sb2.id:', sb2.id);
	console.log('Found sandboxes:', all.map((s: any) => s.id));
	console.assert(all.length === 2, 'expected 2 sandboxes');

	await sb1.setLabels({ env: 'test', project: 'alpha', version: '2' });
	const labels = await sb1.getLabels();
	console.assert(labels.version === '2', 'label update failed');

	// Cleanup
	// await sb1.destroy();
	// await sb2.destroy();

	// await client.shutdown();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});