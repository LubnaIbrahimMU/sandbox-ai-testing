import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { createSandbox } = require('@syntera-ai/sandbox');

async function main() {
	const client = await createSandbox({
		provider: 'docker',
		defaults: {
			image: 'lubnaibrahimu/swe-base:latest',
			cpu: 2,
			memory: 4096
		}
	});

	const sandbox: any = await client.create({ ports: [3000] });
	console.log('Created:', sandbox.id);

	// Test 2: File System Operations
	await sandbox.fs.write('/home/sandbox/test.txt', 'hello world');
	const content = await sandbox.fs.read('/home/sandbox/test.txt');
	console.assert(content === 'hello world');

	const exists = await sandbox.fs.exists('/home/sandbox/test.txt');
	console.assert(exists === true);

	await sandbox.fs.mkdir('/home/sandbox/mydir', true);
	await sandbox.fs.copy('/home/sandbox/test.txt', '/home/sandbox/mydir/test.txt');
	const list = await sandbox.fs.list('/home/sandbox/mydir');
	console.assert(list.length >= 1);

	const stat = await sandbox.fs.stat('/home/sandbox/test.txt');
	console.log('File stat:', stat);

	await sandbox.fs.move('/home/sandbox/mydir/test.txt', '/home/sandbox/mydir/moved.txt');
	await sandbox.fs.delete('/home/sandbox/mydir', true);

	// Cleanup
	// await sandbox.stop();
	// await sandbox.destroy();
	// await client.shutdown();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});