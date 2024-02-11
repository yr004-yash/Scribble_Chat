// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Stage, Layer, Line, Rect, Circle } from 'react-konva';
// import { Button } from '@mui/material';
// import { useHiddenContext } from './hiddencontext';
// import './draw.css';
// import pencilbg from './wired-lineal-35-edit.gif'
// import clearcanva from './wired-lineal-185-trash-bin.gif'
// import rect from './rectangle.gif'
// import cir from './circle.gif'

// const Draw = ({ sockett }) => {
//     const { usernm } = useHiddenContext();
//     const [lines, setLines] = useState([]);
//     const [selectedTool, setSelectedTool] = useState('pencil');
//     const isDrawing = useRef(false);

//     useEffect(() => {
//         sockett?.on('Updated drawing for users', (lines) => {
//             setLines(lines);
//         });

//         sockett?.on('clear frontend', space => {
//             setLines([]);
//         });
//         sockett?.on('Updated drawing for new user', (lines) => {
//             setLines(lines);
//         });

//         return () => {
//             sockett?.off('Updated drawing for users');
//             sockett?.off('clear frontend');
//             sockett?.off('Updated drawing for new user');
//         };
//     }, [sockett]);


//     const handleMouseDown = (e) => {
//         if (usernm == localStorage.getItem('name')) {
//             isDrawing.current = true;
//             const { x, y } = e.target.getStage().getPointerPosition();

//             if (selectedTool === 'pencil') {
//                 const newLine = { tool: 'pencil', points: [x, y] };
//                 setLines([...lines, newLine]);

//                 sockett?.emit('Updated drawing for backend', [...lines, newLine]);
//             } else if (selectedTool === 'rectangle') {
//                 const newRect = {
//                     tool: 'rectangle',
//                     x: x,
//                     y: y,
//                     width: 0,
//                     height: 0,
//                 };
//                 setLines([...lines, newRect]);

//                 sockett?.emit('Updated drawing for backend', [...lines, newRect]);
//             } else if (selectedTool === 'circle') {
//                 const newCircle = {
//                     tool: 'circle',
//                     x: x,
//                     y: y,
//                     radius: 0,
//                 };
//                 setLines([...lines, newCircle]);
//                 sockett?.emit('Updated drawing for backend', [...lines, newCircle]);
//             }
//         }
//     };

//     const handleMouseMove = (e) => {
//         if (usernm == localStorage.getItem('name')) {
//             if (!isDrawing.current) return;

//             const stage = e.target.getStage();
//             const point = stage.getPointerPosition();
//             let lastLine = lines[lines.length - 1];

//             if (!lastLine) {
//                 // Initialize lastLine if it's undefined
//                 lastLine = {
//                     tool: selectedTool,
//                     points: [],
//                     x: point.x,
//                     y: point.y,
//                     width: 0,
//                     height: 0,
//                     radius: 0,
//                 };
//                 setLines([...lines, lastLine]);
//             }

//             if (selectedTool === 'pencil') {
//                 // Pencil tool: add points to the last line
//                 lastLine.points = lastLine.points.concat([point.x, point.y]);
//             } else if (selectedTool === 'rectangle') {
//                 // Rectangle tool: update width and height as the mouse moves
//                 lastLine.width = point.x - lastLine.x;
//                 lastLine.height = point.y - lastLine.y;
//             } else if (selectedTool === 'circle') {
//                 // Circle tool: update radius as the mouse moves
//                 lastLine.radius = Math.sqrt(
//                     Math.pow(point.x - lastLine.x, 2) + Math.pow(point.y - lastLine.y, 2)
//                 );
//             }

//             // Update state to trigger re-render
//             setLines([...lines.slice(0, -1), lastLine]);

//             // Emit the drawing event to other users
//             // socket.emit('draw', lastLine);
//             sockett?.emit('Updated drawing for backend', [...lines.slice(0, -1), lastLine]);
//         }
//     };

//     const handleMouseUp = () => {
//         if (usernm == localStorage.getItem('name')) {
//             isDrawing.current = false;
//         }
//     };

//     const clearCanvas = () => {
//         setLines([]);
//         var space = "";
//         sockett?.emit('clear', space);
//     };

//     const canvasStyles = {
//         width: '100%',  // Set width to 100% of the container
//         height: '88%', // Set height to 100% of the container
//         overflowX: 'hidden', // Add scrollbars when content overflows
//     };
//     const canvasWidth = 2*window.innerWidth / 3;
//     const canvasHeight = window.innerHeight;

//     return (
//         <div className="h-full" style={{ width: '100%'}}>
//             <div style={{height:'12%',width:'100%'}}>
//                 {usernm == localStorage.getItem('name') ? (
//                     <div style={{
//                         display: 'flex',
//                         justifyContent: 'space-between', /* Equal space between items */
//                         alignItems: 'center', /* Center items vertically */
//                         backgroundColor:'rgb(0,60,125)',
//                         height:'100%',
//                         maxWidth:'100%',
//                         overflowY:'hidden',
//                     }}>
//                         <Button variant="contained" onClick={() => setSelectedTool('pencil')} 
//                             style={{
//                                 height: '80%',
//                                 width:`20%`,
//                                 background: `linear-gradient(45deg, #2175F3, #21AAF3)`,
//                                 backgroundSize: 'cover',
//                                 borderRadius: '5px',
//                                 boxShadow: 'inset 0 0 20px rgba(0, 0, 255, 0.6)',
//                                 transition: 'background 0.3s, transform 0.3s',
//                                 transform: selectedTool==='pencil' ? 'scale(0.8)' : 'scale(1)',
//                                 fontSize:'80%',
//                                 fontStretch:'condensed',
//                                 margin:'1%',
//                             }}>
//                                 {/* <div className='flex flex-row h-full w-full'> */}
//                                 <img src={pencilbg} style={{height:'100%',width:'auto',marginRight:'1px'}}/>
//                                 {/* Pencil */}
//                                 {/* </div> */}
//                             </Button>
//                         <Button variant="contained" onClick={() => setSelectedTool('rectangle')}
//                             style={{
//                                 height: '80%',
//                                 width: `20%`,
//                                 background: `linear-gradient(45deg, #2175F3, #21AAF3)`,
//                                 backgroundSize: 'cover',
//                                 borderRadius: '5px',
//                                 boxShadow: 'inset 0 0 20px rgba(0, 0, 255, 0.6)',
//                                 transition: 'background 0.3s, transform 0.3s',
//                                 transform: selectedTool==='rectangle' ? 'scale(0.8)' : 'scale(1)',
//                                 fontSize:'80%',
//                                 fontStretch:'condensed',
//                                 margin:'1%',
//                             }}>
//                                 <img src={rect} style={{height:'100%',width:'auto',marginRight:'1px'}}/>
//                             </Button>
//                         <Button variant="contained" onClick={() => setSelectedTool('circle')}
//                             style={{
//                                 height: '80%',
//                                 width: `20%`,
//                                 background: `linear-gradient(45deg, #2175F3, #21AAF3)`,
//                                 backgroundSize: 'cover',
//                                 borderRadius: '5px',
//                                 boxShadow: 'inset 0 0 20px rgba(0, 0, 255, 0.6)',
//                                 transition: 'background 0.3s, transform 0.3s',
//                                 transform: selectedTool==='circle' ? 'scale(0.8)' : 'scale(1)',
//                                 fontSize:'80%',
//                                 fontStretch:'condensed',
//                                 margin:'1%',
//                             }}>
//                                 <img src={cir} style={{height:'100%',width:'auto',marginRight:'1px'}}/>
//                             </Button>
//                         <Button variant="contained" onClick={clearCanvas}
//                             style={{
//                                 height: '80%',
//                                 width: `20%`,
//                                 background: `linear-gradient(45deg, #2175F3, #21AAF3)`,
//                                 backgroundSize: 'cover',
//                                 borderRadius: '5px',
//                                 boxShadow: 'inset 0 0 20px rgba(0, 0, 255, 0.6)',
//                                 transition: 'background 0.3s, transform 0.3s',
//                                 fontSize:'80%',
//                                 fontStretch:'condensed',
//                                 margin:'1%',
//                                 // transform: isClicked ? 'scale(0.8)' : 'scale(1)',
//                             }}>
//                                 <img src={clearcanva} style={{height:'100%',width:'auto',marginRight:'1px'}}/>
//                             </Button>
//                     </div>
//                 ) : ""}
//             </div>
//             <div style={canvasStyles}>
//                 <Stage
//                     width={canvasWidth}
//                     height={canvasHeight}
//                     onMouseDown={handleMouseDown}
//                     onMousemove={handleMouseMove}
//                     onMouseup={handleMouseUp}
//                     onTouchStart={handleMouseDown}
//                     onTouchMove={handleMouseMove}
//                     onTouchEnd={handleMouseUp}
//                 >

//                     <Layer>
//                         {lines.map((line, index) => {
//                             if (line.tool === 'pencil') {
//                                 return (
//                                     <Line
//                                         key={index}
//                                         points={line.points}
//                                         stroke="black"
//                                         strokeWidth={2}
//                                         tension={0.5}
//                                         lineCap="round"
//                                     />
//                                 );
//                             } else if (line.tool === 'rectangle') {
//                                 return (
//                                     <Rect
//                                         key={index}
//                                         x={line.x}
//                                         y={line.y}
//                                         width={line.width}
//                                         height={line.height}
//                                         stroke="black"
//                                         strokeWidth={2}
//                                     />
//                                 );
//                             } else if (line.tool === 'circle') {
//                                 return (
//                                     <Circle
//                                         key={index}
//                                         x={line.x}
//                                         y={line.y}
//                                         radius={line.radius}
//                                         stroke="black"
//                                         strokeWidth={2}
//                                     />
//                                 );
//                             }
//                             return null;
//                         })}
//                     </Layer>
//                 </Stage>
//             </div>

//         </div>
//     );
// };

// export default Draw;

import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash'; // Import lodash
import axios from 'axios';
import { Stage, Layer, Line, Rect, Circle } from 'react-konva';
import { Button } from '@mui/material';
import { useHiddenContext } from './hiddencontext';
import './draw.css';
import pencilbg from './wired-lineal-35-edit.gif'
import clearcanva from './wired-lineal-185-trash-bin.gif'
import rect from './rectangle.gif'
import cir from './circle.gif'

const Draw = ({ sockett }) => {
    const { usernm } = useHiddenContext();
    const [lines, setLines] = useState([]);
    const [selectedTool, setSelectedTool] = useState('pencil');
    const isDrawing = useRef(false);

    // Throttle mouse move events using lodash
    const throttledMouseMove = useRef(_.throttle(handleMouseMove, 16)); // Adjust throttle time as needed

    useEffect(() => {
        sockett?.on('Updated drawing for users', (lines) => {
            setLines(lines);
        });

        sockett?.on('clear frontend', space => {
            setLines([]);
        });
        sockett?.on('Updated drawing for new user', (lines) => {
            setLines(lines);
        });

        return () => {
            sockett?.off('Updated drawing for users');
            sockett?.off('clear frontend');
            sockett?.off('Updated drawing for new user');
        };
    }, [sockett]);


    const handleMouseDown = (e) => {
        if (usernm == localStorage.getItem('name')) {
            isDrawing.current = true;
            const { x, y } = e.target.getStage().getPointerPosition();

            if (selectedTool === 'pencil') {
                const newLine = { tool: 'pencil', points: [x, y] };
                setLines([...lines, newLine]);

                sockett?.emit('Updated drawing for backend', [...lines, newLine]);
            } else if (selectedTool === 'rectangle') {
                const newRect = {
                    tool: 'rectangle',
                    x: x,
                    y: y,
                    width: 0,
                    height: 0,
                };
                setLines([...lines, newRect]);

                sockett?.emit('Updated drawing for backend', [...lines, newRect]);
            } else if (selectedTool === 'circle') {
                const newCircle = {
                    tool: 'circle',
                    x: x,
                    y: y,
                    radius: 0,
                };
                setLines([...lines, newCircle]);
                sockett?.emit('Updated drawing for backend', [...lines, newCircle]);
            }
        }
    };

    // Replace handleMouseMove with throttled version
    const handleMouseMove = (e) => {
        if (usernm == localStorage.getItem('name')) {
            if (!isDrawing.current) return;

            const stage = e.target.getStage();
            const point = stage.getPointerPosition();
            let lastLine = lines[lines.length - 1];

            if (!lastLine) {
                lastLine = {
                    tool: selectedTool,
                    points: [],
                    x: point.x,
                    y: point.y,
                    width: 0,
                    height: 0,
                    radius: 0,
                };
                setLines([...lines, lastLine]);
            }

            if (selectedTool === 'pencil') {
                lastLine.points = lastLine.points.concat([point.x, point.y]);
            } else if (selectedTool === 'rectangle') {
                lastLine.width = point.x - lastLine.x;
                lastLine.height = point.y - lastLine.y;
            } else if (selectedTool === 'circle') {
                lastLine.radius = Math.sqrt(
                    Math.pow(point.x - lastLine.x, 2) + Math.pow(point.y - lastLine.y, 2)
                );
            }

            setLines([...lines.slice(0, -1), lastLine]);

            sockett?.emit('Updated drawing for backend', [...lines.slice(0, -1), lastLine]);
        }
    };

    const handleMouseMoveThrottled = (e) => {
        throttledMouseMove.current(e);
    };

    const handleMouseUp = () => {
        if (usernm == localStorage.getItem('name')) {
            isDrawing.current = false;
        }
    };

    const clearCanvas = () => {
        setLines([]);
        var space = "";
        sockett?.emit('clear', space);
    };

    const canvasStyles = {
        width: '100%',
        height: '88%',
        overflowX: 'hidden',
    };
    const canvasWidth = 2 * window.innerWidth / 3;
    const canvasHeight = window.innerHeight;

    return (
        <div className="h-full" style={{ width: '100%' }}>
            <div style={{ height: '12%', width: '100%' }}>
                {usernm == localStorage.getItem('name') ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'rgb(0,60,125)',
                        height: '100%',
                        maxWidth: '100%',
                        overflowY: 'hidden',
                    }}>
                        <Button variant="contained" onClick={() => setSelectedTool('pencil')}
                            style={{
                                height: '80%',
                                width: `20%`,
                                background: `linear-gradient(45deg, #2175F3, #21AAF3)`,
                                backgroundSize: 'cover',
                                borderRadius: '5px',
                                boxShadow: 'inset 0 0 20px rgba(0, 0, 255, 0.6)',
                                transition: 'background 0.3s, transform 0.3s',
                                transform: selectedTool === 'pencil' ? 'scale(0.8)' : 'scale(1)',
                                fontSize: '80%',
                                fontStretch: 'condensed',
                                margin: '1%',
                            }}>
                            <img src={pencilbg} style={{ height: '100%', width: 'auto', marginRight: '1px' }} />
                        </Button>
                        <Button variant="contained" onClick={() => setSelectedTool('rectangle')}
                            style={{
                                height: '80%',
                                width: `20%`,
                                background: `linear-gradient(45deg, #2175F3, #21AAF3)`,
                                backgroundSize: 'cover',
                                borderRadius: '5px',
                                boxShadow: 'inset 0 0 20px rgba(0, 0, 255, 0.6)',
                                transition: 'background 0.3s, transform 0.3s',
                                transform: selectedTool === 'rectangle' ? 'scale(0.8)' : 'scale(1)',
                                fontSize: '80%',
                                fontStretch: 'condensed',
                                margin: '1%',
                            }}>
                            <img src={rect} style={{ height: '100%', width: 'auto', marginRight: '1px' }} />
                        </Button>
                        <Button variant="contained" onClick={() => setSelectedTool('circle')}
                            style={{
                                height: '80%',
                                width: `20%`,
                                background: `linear-gradient(45deg, #2175F3, #21AAF3)`,
                                backgroundSize: 'cover',
                                borderRadius: '5px',
                                boxShadow: 'inset 0 0 20px rgba(0, 0, 255, 0.6)',
                                transition: 'background 0.3s, transform 0.3s',
                                transform: selectedTool === 'circle' ? 'scale(0.8)' : 'scale(1)',
                                fontSize: '80%',
                                fontStretch: 'condensed',
                                margin: '1%',
                            }}>
                            <img src={cir} style={{ height: '100%', width: 'auto', marginRight: '1px' }} />
                        </Button>
                        <Button variant="contained" onClick={clearCanvas}
                            style={{
                                height: '80%',
                                width: `20%`,
                                background: `linear-gradient(45deg, #2175F3, #21AAF3)`,
                                backgroundSize: 'cover',
                                borderRadius: '5px',
                                boxShadow: 'inset 0 0 20px rgba(0, 0, 255, 0.6)',
                                transition: 'background 0.3s, transform 0.3s',
                                fontSize: '80%',
                                fontStretch: 'condensed',
                                margin: '1%',
                            }}>
                            <img src={clearcanva} style={{ height: '100%', width: 'auto', marginRight: '1px' }} />
                        </Button>
                    </div>
                ) : ""}
            </div>
            <div style={canvasStyles}>
                <Stage
                    width={canvasWidth}
                    height={canvasHeight}
                    onMouseDown={handleMouseDown}
                    onMousemove={handleMouseMoveThrottled} // Use throttled mouse move handler
                    onMouseup={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMoveThrottled} // Use throttled mouse move handler
                    onTouchEnd={handleMouseUp}
                >
                    <Layer>
                        {lines.map((line, index) => {
                            if (line.tool === 'pencil') {
                                return (
                                    <Line
                                        key={index}
                                        points={line.points}
                                        stroke="black"
                                        strokeWidth={2}
                                        tension={0.5}
                                        lineCap="round"
                                    />
                                );
                            } else if (line.tool === 'rectangle') {
                                return (
                                    <Rect
                                        key={index}
                                        x={line.x}
                                        y={line.y}
                                        width={line.width}
                                        height={line.height}
                                        stroke="black"
                                        strokeWidth={2}
                                    />
                                );
                            } else if (line.tool === 'circle') {
                                return (
                                    <Circle
                                        key={index}
                                        x={line.x}
                                        y={line.y}
                                        radius={line.radius}
                                        stroke="black"
                                        strokeWidth={2}
                                    />
                                );
                            }
                            return null;
                        })}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
};

export default Draw;

