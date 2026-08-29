const { spawnSync } = require('child_process');
const path = require('path');

const seedScripts = ['seedProducts.js', 'seedDoctors.js'];

for (const script of seedScripts) {
  const result = spawnSync(process.execPath, [path.join(__dirname, script)], {
    stdio: 'inherit',
    env: process.env,
  });

  if (result.error) {
    console.error(`Failed to run ${script}:`, result.error.message);
    process.exitCode = 1;
    break;
  }

  if (result.status !== 0) {
    console.error(`${script} exited with status ${result.status}`);
    process.exitCode = result.status || 1;
    break;
  }
}
