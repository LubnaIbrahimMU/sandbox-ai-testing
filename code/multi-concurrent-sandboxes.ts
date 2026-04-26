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

  const sandboxes: any[] = await Promise.all([
    client.create({ labels: { instance: '1' } }),
    client.create({ labels: { instance: '2' } }),
    client.create({ labels: { instance: '3' } })
  ]);

  const results = await Promise.all(sandboxes.map((sandbox) => sandbox.exec('hostname')));
  console.log('Hostnames:', results.map((result) => result.stdout.trim()));

  const hostnames = new Set(results.map((result) => result.stdout.trim()));
  console.assert(hostnames.size === 3, 'expected three unique sandbox hostnames');

  await Promise.all(sandboxes.map((sandbox) => sandbox.destroy()));

  // await client.shutdown();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});