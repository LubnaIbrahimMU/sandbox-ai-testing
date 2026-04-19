// any ports as u want

import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { createSandbox } = require('@syntera-ai/sandbox');

async function main() {
	const client: any = await createSandbox({
		provider: 'docker',
		defaults: {
			// specify the image to ensure consistent runtime
			image: 'lubnaibrahimu/swe-agent:latest',
			cpu: 2,
			memory: 4096
		}
	});

	const sandbox: any = await client.create({ ports: [4000, 8081] });

	// Start HTTP server in background so exec returns quickly (avoid timeout)
	const serverCmd = `sh -c 'nohup node -e "require(\\'http\\').createServer((q,s)=>{s.end(\\'ok\\')}).listen(4000)" >/dev/null 2>&1 &'`;
	await sandbox.exec(serverCmd, { timeout: 5000 });

	// Wait a moment for server to start
	await new Promise((r) => setTimeout(r, 2000));

	const ports = await sandbox.listPorts();
	console.log('Listening ports:', ports);

	const url = await sandbox.getPortUrl(4000);
	console.log('Port 4000 URL:', url);

	// Cleanup
	// await sandbox.stop();
	// await sandbox.destroy();
	// await client.shutdown();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});