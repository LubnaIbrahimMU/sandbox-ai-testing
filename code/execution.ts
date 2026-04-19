import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { createSandbox } = require('@syntera-ai/sandbox');

async function main() {
  const client: any = await createSandbox({
    provider: 'docker',
    defaults: { image: 'lubnaibrahimu/swe-base:latest', cpu: 2, memory: 4096 }
  });

  const sandbox: any = await client.create({ ports: [3000] });
  console.log('Created sandbox:', sandbox.id);

  // With environment variables
  const r1 = await sandbox.exec('echo $MY_VAR', { env: { MY_VAR: 'test123' } });
  console.assert(r1.stdout.trim() === 'test123');

  // With working directory
  const r2 = await sandbox.exec('pwd', { workdir: '/tmp' });
  console.assert(r2.stdout.trim() === '/tmp');

  // With timeout
  try {
    await sandbox.exec('sleep 30', { timeout: 3000 });
    console.error('Should have timed out!');
  } catch (e) {
    console.log('Timeout works correctly');
  }

  // Multi-line script
  const r3 = await sandbox.exec('node -e "console.log(JSON.stringify({a:1,b:2}))"');
  console.assert(JSON.parse(r3.stdout).a === 1);

  // Cleanup
  // await sandbox.stop();
  // await sandbox.destroy();
  // await client.shutdown();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});