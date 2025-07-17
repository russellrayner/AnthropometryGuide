# Interactive Anthropometry Guide

A web application for learning anatomical landmark identification and anthropometric measurements, including landmarks, skinfolds, lengths, girths, and breadths.

### Basic Navigation
1. Select a task using the buttons at the top (Landmarks, Skinfolds, Girths, Lengths, Breadths)
2. Click on any colored dot, line, or arc on the anatomical silhouette
3. View measurement procedures in the side panel

### Coordinate Finder Tool (For Development)
- Press `Alt+C` to activate coordinate finding mode
- All measurement elements are hidden for clear visibility
- Click anywhere on the image to get precise coordinates
- Coordinates appear as temporary yellow dots and in the console
- Press `Alt+C` again to return to normal mode

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
2. Use the coordinate finder tool (`Alt+C`) to locate positions
3. Test measurements in the interface

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
