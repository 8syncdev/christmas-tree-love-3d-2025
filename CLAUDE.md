# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive 3D Christmas experience - a cinematic single-page web application that displays photos in a 3D space with a glowing Christmas tree. It's designed as a romantic gift with photos orbiting around a particle-based tree in a cosmic environment.

**Technology Stack:**
- Three.js for 3D graphics (loaded via CDN, no npm/build process)
- HTML5/CSS3 with glassmorphism UI design
- ES Modules (requires local web server, cannot open directly)
- Post-processing with UnrealBloomPass for neon glow effects

## Architecture

**Single-File Application:** All code (HTML, CSS, JavaScript) is contained in `index.html`.

**Key Components:**
- **Scene Setup:** Three.js scene with fog, nebula shader background, and 5000 twinkling stars
- **Christmas Tree:** 7000 particles using InstancedMesh with "breathing" animation and gradient colors (blue to pink)
- **Photo Gallery:** Photos orbit around the tree, each with a 3D frame and neon glow effect
- **Particle Systems:** 2000+ snow particles (InstancedMesh) and 50 floating hearts with heartbeat animation
- **Viewing Modes:**
  - **Orbit Mode:** Photos rotate around the tree (default)
  - **Flow Mode:** Photos transform into a spiral tunnel effect with cinematic camera movement
  - **View Mode:** Camera focuses on individual photos with slideshow capability

**Data Flow:**
1. Photos are placed in `images/` folder (JPG/PNG)
2. `convert_images.ps1` converts images to base64 and creates `embedded_images.js`
3. `index.html` loads `embedded_images.js` which provides `window.embeddedImages` array
4. Three.js creates 3D photo frames with textures from the base64 data

## Development Commands

### Prepare Images
```powershell
# Windows PowerShell - Convert images to base64
# Right-click convert_images.ps1 -> "Run with PowerShell"
pwsh convert_images.ps1
```

### Run Local Server (Required - ES Modules)
```bash
# Option 1: Python (recommended)
python -m http.server 8080

# Option 2: VS Code Live Server
# Install "Live Server" extension, right-click index.html -> "Open with Live Server"

# Option 3: Node.js
npx http-server .
```

Then open `http://localhost:8080` in browser.

### Update Image List
When adding new photos, edit both:
1. `convert_images.ps1` - Add filenames to `$files` array (line 12)
2. Run the PowerShell script to regenerate `embedded_images.js`

## Code Organization (index.html)

The file is organized into sections:

1. **CSS** (lines 8-371): Glassmorphism UI components, responsive design, neon color scheme
2. **HTML Structure** (lines 383-457): Canvas container, UI layer with dock controls, modal overlay
3. **JavaScript Module** (lines 460-1520):
   - Configuration & embedded image loading
   - UI particle creation
   - Thumbnail generation
   - Three.js scene setup
   - Shader definitions (nebula, stars)
   - InstancedMesh particle systems (tree, snow, hearts)
   - Photo 3D frame creation with multi-layer structure
   - Camera animation and view modes
   - Event handlers for UI controls

## Important Implementation Details

**Performance Optimization:**
- Uses `THREE.InstancedMesh` for all particle systems (tree: 7000, snow: 2000, hearts: 50)
- Snow/heart particles are recycled when they go out of bounds (reset position)
- Post-processing bloom is tuned to avoid overwhelming the scene

**Photo Frame Structure** (create3DPhotoAtIndex, line 779):
Each photo has 5 layers from back to front:
1. Black backing (blocks light through)
2. Gold neon frame (outer glow)
3. White border (sharp edge)
4. Photo texture front side
5. Photo texture back side (double-sided viewing)

**Flow Mode Animation:**
- Tree particles expand from cone shape to spiral tunnel
- Photos transition from orbit ring to spiral tunnel positions
- Camera follows CatmullRomCurve3 through the tunnel
- State machine: idle → expanding → touring → collapsing

**State Management:**
- `isFlowMode`: Whether in tunnel/flow mode
- `isViewMode`: Whether focusing on individual photo
- `flowProgress`: 0-1 transition value for morphing effects

## Configuration Constants

Key configurable values in the code:
- `treeParticleCount = 7000` (line 703)
- `snowCount = 2000` (line 922)
- `heartCount = 50` (line 899)
- `orbitRadius = 9` (line 768) - distance of photos from tree
- Bloom settings (lines 560-563): threshold, strength, radius
- Camera default position: `(0, 5, 25)` (line 548)

## File Structure

```
christmas-tree/
├── index.html              # Main application (all code)
├── convert_images.ps1      # PowerShell script to convert images to base64
├── embedded_images.js      # Generated base64 image data (do not edit manually)
├── images/                 # Source photos (add your photos here)
└── CLAUDE.md              # This file
```
