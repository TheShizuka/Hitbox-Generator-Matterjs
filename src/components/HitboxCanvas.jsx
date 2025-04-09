import { useState, useRef, useEffect } from "react";

export default function HitboxMaker() {
  const [points, setPoints] = useState([]);
  const [canvasSize, setCanvasSize] = useState({ x: 40, y: 40 });
  const [image, setImage] = useState(null);
  const [hitboxName, setHitboxName] = useState("hitbox");
  const [isDragging, setIsDragging] = useState(false);
  const [dragPointIndex, setDragPointIndex] = useState(null);
  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  const handleCanvasClick = (e) => {
    if (isDragging) return;
    
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvasSize.x * 2 - canvasSize.x;
    const y = ((e.clientY - rect.top) / rect.height) * canvasSize.y * 2 - canvasSize.y;
    setPoints([...points, { x: parseFloat(x.toFixed(2)), y: parseFloat(-y.toFixed(2)) }]);
  };

  const handlePointMouseDown = (index, e) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragPointIndex(index);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || dragPointIndex === null) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvasSize.x * 2 - canvasSize.x;
    const y = ((e.clientY - rect.top) / rect.height) * canvasSize.y * 2 - canvasSize.y;
    
    const newPoints = [...points];
    newPoints[dragPointIndex] = { 
      x: parseFloat(x.toFixed(2)), 
      y: parseFloat(-y.toFixed(2)) 
    };
    setPoints(newPoints);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragPointIndex(null);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleUndo = () => setPoints(points.slice(0, -1));
  const handleClear = () => setPoints([]);

  const handleExport = () => {
    // Format the data to match the required output
    const formattedData = `// ${hitboxName} shape\n${hitboxName}: [\n  ${points.map(point => 
      `{ x: ${point.x}, y: ${point.y} }`).join(',\n  ')}\n],`;
    
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(formattedData);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = dataStr;
    downloadAnchor.download = `${hitboxName}.js`;
    downloadAnchor.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Draw lines connecting points
  const generatePathData = () => {
    if (points.length < 2) return "";
    
    const svgPoints = points.map(point => {
      const svgX = (point.x + canvasSize.x) / (canvasSize.x * 2) * 100;
      const svgY = (-point.y + canvasSize.y) / (canvasSize.y * 2) * 100;
      return `${svgX}% ${svgY}%`;
    });
    
    return `M ${svgPoints.join(" L ")} Z`;
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900 rounded-lg shadow-lg w-full max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">Hitbox Maker</h1>
      <p className="mb-4 text-gray-300">Click on the canvas to create hitbox points for Matter.js</p>
      
      <div className="flex gap-2 mb-4 w-full">
        <div className="flex-1">
          <label className="block text-sm mb-1">Hitbox Name:</label>
          <input 
            type="text" 
            value={hitboxName} 
            onChange={(e) => setHitboxName(e.target.value)} 
            className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm mb-1">Max X:</label>
          <input 
            type="number" 
            value={canvasSize.x} 
            onChange={(e) => setCanvasSize({ ...canvasSize, x: +e.target.value })} 
            className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded" 
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm mb-1">Max Y:</label>
          <input 
            type="number" 
            value={canvasSize.y} 
            onChange={(e) => setCanvasSize({ ...canvasSize, y: +e.target.value })} 
            className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded" 
          />
        </div>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2 w-full">
        <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
          <span>Upload Image</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
        <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Export
        </button>
        <button onClick={handleUndo} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          Undo
        </button>
        <button onClick={handleClear} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Clear
        </button>
      </div>
      
      <div className="relative border border-gray-700 rounded bg-gray-800" style={{ width: "600px", height: "600px" }}>
        {image && (
          <img 
            src={image} 
            alt="Uploaded" 
            className="absolute inset-0 w-full h-full object-contain opacity-70" 
          />
        )}
        <svg 
          ref={svgRef}
          width="100%" 
          height="100%" 
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          className="cursor-crosshair absolute inset-0"
        >
          {/* Draw connecting lines */}
          <path 
            d={generatePathData()} 
            fill="rgba(255, 255, 0, 0.2)" 
            stroke="rgba(255, 255, 0, 0.8)" 
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          {/* Draw points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle 
                cx={`${(point.x + canvasSize.x) / (canvasSize.x * 2) * 100}%`} 
                cy={`${(-point.y + canvasSize.y) / (canvasSize.y * 2) * 100}%`} 
                r="6" 
                fill="yellow"
                stroke="black"
                strokeWidth="1"
                onMouseDown={(e) => handlePointMouseDown(index, e)}
                style={{ cursor: 'move' }}
              />
              <text 
                x={`${(point.x + canvasSize.x) / (canvasSize.x * 2) * 100}%`} 
                y={`${(-point.y + canvasSize.y) / (canvasSize.y * 2) * 100}%`} 
                dx="10" 
                dy="5" 
                fill="white" 
                fontSize="12"
              >
                {index + 1}
              </text>
            </g>
          ))}
          
          {/* Grid lines */}
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          
          {/* Coordinate display */}
          <text x="10" y="20" fill="white" fontSize="12">
            Origin (0,0) at center
          </text>
        </svg>
        
        {/* Point coordinates display */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 p-2 rounded text-xs">
          Points: {points.length}
        </div>
      </div>
      
      {/* Coordinates preview */}
      {points.length > 0 && (
        <div className="mt-4 w-full max-h-40 overflow-auto bg-gray-800 p-2 rounded text-xs">
          <pre className="text-left">
            // {hitboxName} shape{'\n'}
            {hitboxName}: [<br/>
            {points.map((point, idx) => (
              `  { x: ${point.x}, y: ${point.y} }${idx < points.length - 1 ? ',' : ''}`
            )).join('\n')}
            <br/>],
          </pre>
        </div>
      )}
    </div>
  );
}