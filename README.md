# Interactive Anthropometry Guide

A web application for learning anatomical landmark identification and anthropometric measurements, including landmarks, skinfolds, lengths, girths, and breadths.

### Basic Navigation
1. Select a task using the buttons at the top (Landmarks, Skinfolds, Girths, Lengths, Breadths)
2. Click on any colored dot, line, or arc on the anatomical silhouette
3. View measurement procedures in the side panel

### Developer Tools

#### Coordinate Finder Tool
- Press `Alt+C` to activate coordinate finding mode
- All measurement elements are hidden for clear visibility
- Click anywhere on the image to get precise coordinates
- Coordinates appear as temporary yellow dots and in the console
- Press `Alt+C` again to return to normal mode

#### Developer Mode (Advanced Overlay Alignment)
Press `Alt+D` to activate developer mode for precise overlay alignment.

**Features:**
- **Site-by-site guidance**: Cycles through each measurement point for the current tab
- **Coordinate capture**: 
  - **Dots**: Single click to capture position
  - **Lines**: Click start point, then end point with live preview
  - **Ellipses**: Click center point, then edge for radius calculation
- **Visual feedback**: 
  - Red dots for free placement
  - Blue dots when Y-axis is locked
  - Orange preview lines for line measurements
- **Y-axis alignment**: Lock Y-coordinate for horizontal alignment of landmarks
- **Overlay visibility toggle**: Hide/show existing overlays for reference
- **Site definitions**: View anatomical definitions for accurate placement
- **Coordinate export**: Generate JSON with all captured coordinates

**Controls:**
- **Previous/Next buttons**: Navigate between measurement sites
- **Hide existing overlays checkbox**: Toggle overlay visibility
- **Lock Y-axis checkbox**: Enable horizontal alignment mode
- **Output Coordinates button**: Export alignment data to console and clipboard

**Workflow:**
1. Switch to desired tab (landmarks, skinfolds, etc.)
2. Press `Alt+D` to enter developer mode
3. Follow prompts to click each measurement point
4. Use Y-axis lock for horizontal alignment when needed
5. Export coordinates when complete

```
SkinfoldToolMockup/
├── index.html                 # Main HTML file
├── style.css                  # Styling and responsive design
├── script.js                  # Application logic and interactivity
├── anatomical-data.json       # Measurement data and procedures
├── Landmarks.md              # Source documentation for landmarks
├── Blank-Sillouette.png      # Anatomical silhouette image
├── Dotted-Sillouette.png     # Alternative silhouette (unused)
└── README.md                 # This file
```

## Development

### Adding New Measurements
1. Update measurement data in `anatomical-data.json`
2. Use developer mode (`Alt+D`) for overlay alignment:
   - Navigate to the appropriate tab
   - Use site-by-site guidance to position overlays
   - Export coordinates and update the JSON file
3. Test measurements in the interface

### Aligning Existing Overlays
1. Switch to the measurement type you want to align
2. Enter developer mode (`Alt+D`)
3. Use the overlay visibility toggle to reference existing positions
4. Follow the site-by-site prompts to capture new coordinates
5. Use Y-axis lock for landmarks that should be horizontally aligned
6. Export the coordinates and update `anatomical-data.json`

## Data Sources

- Landmark definitions based on ISAK standards
- Measurement procedures follow established anthropometric protocols
- Video content from ISAK YouTube

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Acknowledgments

- ISAK for standardised anthropometric protocols
- ISAK for educational video content