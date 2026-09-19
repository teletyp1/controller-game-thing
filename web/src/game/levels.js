export const levels = [
  {
    id: 1,
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
    cannon: { x: 960, y: 950, angle: -Math.PI / 2 }, 
    obstacles: [
      { x: 700, y: 0, width: 100, height: 700, color: '#374151' },     // Left main wall
      { x: 1120, y: 0, width: 100, height: 700, color: '#374151' },    // Right main wall
      { x: 910, y: 300, width: 100, height: 300, color: '#1f2937' },   // Center island separator
      { x: 0, y: 400, width: 500, height: 100, color: '#374151' },     // Left room divider
      { x: 1420, y: 400, width: 500, height: 100, color: '#374151' }   // Right room divider
    ],
    targets: [
      { x: 200, y: 200, radius: 20 },
      { x: 200, y: 700, radius: 20 },
      { x: 500, y: 200, radius: 20 },
      { x: 500, y: 700, radius: 20 },

      { x: 1720, y: 200, radius: 20 },
      { x: 1720, y: 700, radius: 20 },
      { x: 1420, y: 200, radius: 20 },
      { x: 1420, y: 700, radius: 20 }
    ]
  },
  {
    id: 5,
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
  {
    id: 6,
    timeLimit: 200, 
    cannon: { x: 960, y: 100, angle: Math.PI / 2 }, 
    obstacles: [
      { x: 300, y: 300, width: 150, height: 150, color: '#374151' },
      { x: 750, y: 300, width: 150, height: 150, color: '#374151' },
      { x: 1020, y: 300, width: 150, height: 150, color: '#374151' },
      { x: 1470, y: 300, width: 150, height: 150, color: '#374151' },
      
      { x: 525, y: 550, width: 150, height: 150, color: '#1f2937' },
      { x: 885, y: 550, width: 150, height: 150, color: '#1f2937' },
      { x: 1245, y: 550, width: 150, height: 150, color: '#1f2937' },
      
      { x: 300, y: 800, width: 150, height: 150, color: '#374151' },
      { x: 750, y: 800, width: 150, height: 150, color: '#374151' },
      { x: 1020, y: 800, width: 150, height: 150, color: '#374151' },
      { x: 1470, y: 800, width: 150, height: 150, color: '#374151' },
    ],
    targets: [
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

    ]
  },
  {
    id: 7,
    cannon: { x: 960, y: 100, angle: Math.PI / 2 },
    obstacles: [
      // Top horizontal wall (Gap on right)
      { x: 0, y: 240, width: 1450, height: 80, color: '#374151' },
      // Top dangling baffle
      { x: 600, y: 320, width: 80, height: 180, color: '#1f2937' },
      
      // Middle horizontal wall (Gap on left)
      { x: 470, y: 500, width: 1450, height: 80, color: '#374151' },
      // Middle dangling baffle
      { x: 1240, y: 580, width: 80, height: 180, color: '#1f2937' },
      
      // Bottom horizontal wall (Gap on right)
      { x: 0, y: 760, width: 1450, height: 80, color: '#374151' },
      // Bottom dangling baffle
      { x: 600, y: 840, width: 80, height: 180, color: '#1f2937' }
    ],
    targets: [
      { x: 1700, y: 150, radius: 18 },
      { x: 1700, y: 370, radius: 18 },
      { x: 250, y: 370, radius: 18 },
      { x: 950, y: 410, radius: 18 },
      { x: 250, y: 630, radius: 18 },
      { x: 1700, y: 630, radius: 18 },
      { x: 950, y: 670, radius: 18 },
      { x: 1700, y: 930, radius: 18 },
      { x: 250, y: 930, radius: 18 },
      { x: 950, y: 930, radius: 18 }
    ]
  },
  {
    id: 8,
    cannon: { x: 960, y: 540, angle: 0 },
    obstacles: [
      // Top Vertical Beam (with gap)
      { x: 920, y: 0, width: 80, height: 160, color: '#374151' },
      { x: 920, y: 280, width: 80, height: 160, color: '#374151' },
      
      // Bottom Vertical Beam (with gap)
      { x: 920, y: 640, width: 80, height: 160, color: '#374151' },
      { x: 920, y: 920, width: 80, height: 160, color: '#374151' },
      
      // Left Horizontal Beam (with gap)
      { x: 0, y: 500, width: 340, height: 80, color: '#1f2937' },
      { x: 460, y: 500, width: 400, height: 80, color: '#1f2937' },
      
      // Right Horizontal Beam (with gap)
      { x: 1060, y: 500, width: 400, height: 80, color: '#1f2937' },
      { x: 1580, y: 500, width: 340, height: 80, color: '#1f2937' }
    ],
    targets: [
      // Deep Quadrant Targets
      { x: 200, y: 150, radius: 18 },
      { x: 1720, y: 150, radius: 18 },
      { x: 200, y: 930, radius: 18 },
      { x: 1720, y: 930, radius: 18 },
      
      // Targets hiding inside the beam gaps!
      { x: 960, y: 220, radius: 18 },
      { x: 960, y: 860, radius: 18 },
      { x: 400, y: 540, radius: 18 },
      { x: 1520, y: 540, radius: 18 },
      
      // Center ring perimeter
      { x: 740, y: 320, radius: 18 },
      { x: 1180, y: 320, radius: 18 },
      { x: 740, y: 760, radius: 18 },
      { x: 1180, y: 760, radius: 18 }
    ]
  },
  {
    id: 9,
    cannon: { x: 150, y: 540, angle: 0 },
    obstacles: [
      // Outer Fortress Walls (with 80px entry holes on all 4 sides)
      { x: 600, y: 200, width: 60, height: 300, color: '#374151' },
      { x: 600, y: 580, width: 60, height: 300, color: '#374151' },
      
      { x: 1260, y: 200, width: 60, height: 300, color: '#374151' },
      { x: 1260, y: 580, width: 60, height: 300, color: '#374151' },
      
      { x: 660, y: 200, width: 260, height: 60, color: '#374151' },
      { x: 1000, y: 200, width: 260, height: 60, color: '#374151' },
      
      { x: 660, y: 820, width: 260, height: 60, color: '#374151' },
      { x: 1000, y: 820, width: 260, height: 60, color: '#374151' },

      // Inner Baffles (Blocks direct straight shots into the core)
      { x: 800, y: 380, width: 60, height: 320, color: '#1f2937' },
      { x: 1060, y: 380, width: 60, height: 320, color: '#1f2937' },
      { x: 860, y: 380, width: 200, height: 60, color: '#1f2937' },
      { x: 860, y: 640, width: 200, height: 60, color: '#1f2937' }
    ],
    targets: [
      // Absolute Core (Very hard to reach)
      { x: 960, y: 540, radius: 18 },
      
      // Inner Fortress Corners
      { x: 730, y: 330, radius: 18 },
      { x: 1190, y: 330, radius: 18 },
      { x: 730, y: 750, radius: 18 },
      { x: 1190, y: 750, radius: 18 },
      
      // Outside Corners
      { x: 300, y: 150, radius: 18 },
      { x: 1620, y: 150, radius: 18 },
      { x: 300, y: 930, radius: 18 },
      { x: 1620, y: 930, radius: 18 },
      
      // Flanks
      { x: 960, y: 100, radius: 18 },
      { x: 960, y: 980, radius: 18 }
    ]
  }
];