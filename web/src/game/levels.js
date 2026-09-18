export const levels = [
  {
    id: 1,
    timeLimit: 20, 
    cannon: { x: 150, y: 540, angle: 0 }, // Left side, pointing right
    obstacles: [
      { x: 860, y: 440, width: 200, height: 200, color: '#374151' }
    ],
    targets: [
      { x: 1200, y: 200, radius: 25 },
      { x: 1200, y: 300, radius: 25 },
      { x: 1200, y: 780, radius: 25 },
      { x: 1200, y: 880, radius: 25 }
    ]
  },
  {
    id: 2,
    timeLimit: 25,
    cannon: { x: 960, y: 900, angle: -Math.PI / 2 }, // Bottom center, pointing UP
    obstacles: [
      { x: 500, y: 200, width: 100, height: 680, color: '#374151' }, 
      { x: 1320, y: 200, width: 100, height: 680, color: '#374151' }, 
    ],
    targets: [
      { x: 960, y: 200, radius: 25 }, 
      { x: 150, y: 540, radius: 25 }, 
      { x: 250, y: 540, radius: 25 }, 
      { x: 1670, y: 540, radius: 25 },
      { x: 1770, y: 540, radius: 25 }, 
    ]
  },
  {
    id: 3,
    timeLimit: 30,
    cannon: { x: 100, y: 100, angle: 0 }, // Top left, tight corner
    obstacles: [
      { x: 760, y: 240, width: 400, height: 400, color: '#374151' }, 
      { x: 0, y: 250, width: 600, height: 100, color: '#374151' },   
      { x: 1320, y: 490, width: 600, height: 100, color: '#374151' } 
    ],
    targets: [
      { x: 680, y: 300, radius: 40 },
      { x: 1240, y: 530, radius: 40 },
      { x: 1600, y: 300, radius: 25 },
      { x: 960, y: 880, radius: 25 },
      { x: 400, y: 880, radius: 25 },
      { x: 1700, y: 880, radius: 25 }
    ]
  },
  {
    id: 4,
    timeLimit: 80, // Solo player gets 80s, 4-players get 20s
    cannon: { x: 960, y: 950, angle: -Math.PI / 2 }, 
    obstacles: [
      { x: 700, y: 0, width: 100, height: 700, color: '#374151' },     // Left main wall
      { x: 1120, y: 0, width: 100, height: 700, color: '#374151' },    // Right main wall
      { x: 910, y: 300, width: 100, height: 300, color: '#1f2937' },   // Center island separator
      { x: 0, y: 400, width: 500, height: 100, color: '#374151' },     // Left room divider
      { x: 1420, y: 400, width: 500, height: 100, color: '#374151' }   // Right room divider
    ],
    targets: [
      // Left side targets
      { x: 200, y: 200, radius: 20 },
      { x: 200, y: 700, radius: 20 },
      { x: 500, y: 200, radius: 20 },
      { x: 500, y: 700, radius: 20 },
      // Right side targets
      { x: 1720, y: 200, radius: 20 },
      { x: 1720, y: 700, radius: 20 },
      { x: 1420, y: 200, radius: 20 },
      { x: 1420, y: 700, radius: 20 }
    ]
  },

  // Level 5: The Gauntlet (10 Targets)
  // A brutal left-to-right obstacle course where targets are nested in tight corners.
  {
    id: 5,
    timeLimit: 100, 
    cannon: { x: 100, y: 540, angle: 0 }, 
    obstacles: [
      { x: 450, y: 0, width: 100, height: 400, color: '#374151' },      // Top Wall 1
      { x: 450, y: 680, width: 100, height: 400, color: '#374151' },    // Bottom Wall 1
      { x: 850, y: 200, width: 100, height: 680, color: '#374151' },    // Middle Wall 2 (Blocks center)
      { x: 1250, y: 0, width: 100, height: 400, color: '#374151' },     // Top Wall 3
      { x: 1250, y: 680, width: 100, height: 400, color: '#374151' },   // Bottom Wall 3
      { x: 1650, y: 300, width: 100, height: 480, color: '#1f2937' }    // Right Blocker
    ],
    targets: [
      { x: 300, y: 150, radius: 20 },
      { x: 300, y: 930, radius: 20 },
      { x: 700, y: 540, radius: 20 },
      { x: 700, y: 100, radius: 20 },
      { x: 700, y: 980, radius: 20 },
      { x: 1100, y: 150, radius: 20 },
      { x: 1100, y: 930, radius: 20 },
      { x: 1500, y: 540, radius: 20 },
      { x: 1800, y: 150, radius: 20 },
      { x: 1800, y: 930, radius: 20 }
    ]
  },

  // Level 6: The Pillar Room (11 Targets)
  // A heavy maze of small blocks. Missiles will crash into each other here easily.
  {
    id: 6,
    timeLimit: 120, 
    cannon: { x: 960, y: 100, angle: Math.PI / 2 }, 
    obstacles: [
      // Top Row
      { x: 300, y: 300, width: 150, height: 150, color: '#374151' },
      { x: 750, y: 300, width: 150, height: 150, color: '#374151' },
      { x: 1020, y: 300, width: 150, height: 150, color: '#374151' },
      { x: 1470, y: 300, width: 150, height: 150, color: '#374151' },
      
      // Middle Row (Offset)
      { x: 525, y: 550, width: 150, height: 150, color: '#1f2937' },
      { x: 885, y: 550, width: 150, height: 150, color: '#1f2937' },
      { x: 1245, y: 550, width: 150, height: 150, color: '#1f2937' },
      
      // Bottom Row
      { x: 300, y: 800, width: 150, height: 150, color: '#374151' },
      { x: 750, y: 800, width: 150, height: 150, color: '#374151' },
      { x: 1020, y: 800, width: 150, height: 150, color: '#374151' },
      { x: 1470, y: 800, width: 150, height: 150, color: '#374151' },
    ],
    targets: [
      // Tucked tightly between the pillars
      { x: 600, y: 400, radius: 18 },
      { x: 960, y: 400, radius: 18 },
      { x: 1320, y: 400, radius: 18 },
      
      { x: 400, y: 625, radius: 18 },
      { x: 750, y: 625, radius: 18 },
      { x: 1170, y: 625, radius: 18 },
      { x: 1520, y: 625, radius: 18 },
      
      { x: 600, y: 875, radius: 18 },
      { x: 960, y: 875, radius: 18 },
      { x: 1320, y: 875, radius: 18 },
      
      // The ultimate dead center trap
      { x: 960, y: 625, radius: 15 }
    ]
  }
];