# Hitbox Maker: A Visual Editor for Matter.js Games

Hitbox Maker is a web-based tool for creating and exporting custom hitbox shapes for Matter.js physics games. With features like **image overlay**, **point dragging**, and **coordinates export**, this tool simplifies the process of creating complex collision shapes.

## Features
- **Visual Editor**: Click to place points and create custom polygon shapes
- **Image Overlay**: Upload reference images to trace hitboxes accurately
- **Point Manipulation**: Drag points to adjust hitbox vertices
- **Customizable Coordinate System**: Adjust the coordinate range to match your game
- **Real-time Preview**: See the polygon shape and coordinates as you work
- **One-click Export**: Export hitbox data in Matter.js compatible format

## Technologies Used
- **React**: Frontend framework
- **Tailwind CSS**: Styling and responsive design
- **SVG**: Vector graphics for visual editor
- **Vite**: Fast development and building

## Installation

### Prerequisites
- Node.js (v16 or higher)
- NPM or Yarn package manager

### Setup
1. Clone the repository:
```bash
git clone https://github.com/TheShizuka/Hitbox-Generator-Matterjs
cd hitbox-maker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Usage
1. Set the hitbox name and coordinate system range
2. Upload a reference image (optional)
3. Click on the canvas to place points
4. Drag points to adjust their positions
5. Click "Export" to download the hitbox data as a JavaScript file
6. Import the generated file in your Matter.js project

## Integration with Matter.js
The exported hitbox shapes can be used with Matter.js by:

```javascript
// Import your hitbox shape
import { hitboxShape } from './path/to/exported/file';

// Create a body with the custom shape
const body = Matter.Bodies.fromVertices(
  x, y, 
  [Matter.Vertices.create(hitboxShape, null)],
  {
    // Your body options here
  }
);
```

## Contact
If you have any questions or feedback, feel free to reach out:
- Email: ayatgimenez@hotmail.com
- LinkedIn: [Hicham AYAT GIMENEZ](https://www.linkedin.com/in/hicham-a-9553ba28b/)
- Portfolio: [Portfolio Website](https://shizukadesu.com/)

Made with ❤️ for game developers