// // Test 1: Basic Sandbox Lifecycle (base-agent) done

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

  const sandbox = await client.create({ ports: [3000] });
  console.log('Created:', sandbox.id);

  const result = await sandbox.exec('echo "Hello from Syntera Sandbox"');
  console.log(result.stdout);

  // await sandbox.stop();
  // await sandbox.destroy();
  // await client.shutdown();
}

main();