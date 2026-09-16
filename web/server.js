import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());

// Serve the compiled React game
app.use(express.static('dist'));

// Handle lightbar requests
app.post('/api/lightbar', (req, res) => {
  // 1. Immediately exit and quietly succeed if running on Windows
  if (process.platform === 'win32') {
    return res.sendStatus(200); 
  }

  const { index, color } = req.body;
  if (index === undefined || !color) return res.sendStatus(400);

  try {
    const sysfsPath = '/sys/class/leds';
    
    // 2. Double-check the path exists just in case (quiet fallback)
    if (!fs.existsSync(sysfsPath)) return res.sendStatus(200); 

    // Find all Sony controller LED directories in Linux sysfs
    const leds = fs.readdirSync(sysfsPath);
    
    const redLeds = leds.filter(dir => 
      dir.endsWith(':red')
    );

    // Sort chronologically to match the player join order
    redLeds.sort(); 

    if (index >= redLeds.length) {
      return res.sendStatus(200); // Fail quietly if controller isn't mapped yet
    }

    const baseName = redLeds[index].replace(':red', '');

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Write directly to the hardware
    fs.writeFileSync(`${sysfsPath}/${baseName}:red/brightness`, r.toString());
    fs.writeFileSync(`${sysfsPath}/${baseName}:green/brightness`, g.toString());
    fs.writeFileSync(`${sysfsPath}/${baseName}:blue/brightness`, b.toString());

    res.sendStatus(200);
  } catch (err) {
    // 3. If anything fails (like a permission error), fail quietly without crashing
    res.sendStatus(200);
  }
});

app.listen(3000, () => {
  console.log(`Kiosk server running on port 3000`);
  if (process.platform === 'win32') {
    console.log('Running on Windows: Hardware lightbar controls are safely disabled.');
  }
});