import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(express.static('dist'));
app.post('/api/lightbar/all', (req, res) => {
  if (process.platform === 'win32') return res.sendStatus(200);

  const color = req.body?.color || '#ffffff';

  try {
    const sysfsPath = '/sys/class/leds';
    if (!fs.existsSync(sysfsPath)) return res.sendStatus(200);

    const leds = fs.readdirSync(sysfsPath);
    const redLeds = leds.filter(dir => dir.endsWith(':red'));

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    redLeds.forEach(dir => {
      const baseName = dir.replace(':red', '');
      try {
        fs.writeFileSync(`${sysfsPath}/${baseName}:red/brightness`, r.toString());
        fs.writeFileSync(`${sysfsPath}/${baseName}:green/brightness`, g.toString());
        fs.writeFileSync(`${sysfsPath}/${baseName}:blue/brightness`, b.toString());
      } catch (e) {}
    });

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(200);
  }
});
app.post('/api/lightbar', (req, res) => {
  if (process.platform === 'win32') return res.sendStatus(200);

  const { index, color } = req.body;
  if (index === undefined || !color) return res.sendStatus(400);

  try {
    const sysfsPath = '/sys/class/leds';
    if (!fs.existsSync(sysfsPath)) return res.sendStatus(200);

    const leds = fs.readdirSync(sysfsPath);
    const redLeds = leds.filter(dir => dir.endsWith(':red'));

    // Parse hardware metadata for each controller
    const controllers = redLeds.map(dir => {
      const baseName = dir.replace(':red', '');
      let jsIndex = null;
      let inputNum = 0;

      // 1. Inspect sysfs device link for joystick node (js0, js1, ...)
      try {
        const devPath = `${sysfsPath}/${dir}/device`;
        if (fs.existsSync(devPath)) {
          const files = fs.readdirSync(devPath);
          const jsFile = files.find(f => /^js\d+$/.test(f));
          if (jsFile) {
            jsIndex = parseInt(jsFile.replace('js', ''), 10);
          }
        }
      } catch (e) {}

      // 2. Extract numeric input ID (e.g., input4 -> 4) for natural sorting
      const match = dir.match(/input(\d+)/);
      if (match) {
        inputNum = parseInt(match[1], 10);
      }

      return { baseName, jsIndex, inputNum };
    });

    // Sort numerically (by jsIndex if present, otherwise by input integer)
    controllers.sort((a, b) => {
      if (a.jsIndex !== null && b.jsIndex !== null) {
        return a.jsIndex - b.jsIndex;
      }
      return a.inputNum - b.inputNum;
    });

    // Prefer exact jsIndex match, fall back to sorted array index
    let target = controllers.find(c => c.jsIndex === index);
    if (!target && index < controllers.length) {
      target = controllers[index];
    }

    if (!target) return res.sendStatus(200);

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    fs.writeFileSync(`${sysfsPath}/${target.baseName}:red/brightness`, r.toString());
    fs.writeFileSync(`${sysfsPath}/${target.baseName}:green/brightness`, g.toString());
    fs.writeFileSync(`${sysfsPath}/${target.baseName}:blue/brightness`, b.toString());

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(200);
  }
});

app.listen(3000, () => console.log('Kiosk server running on port 3000'));