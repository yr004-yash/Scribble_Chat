import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Line, Rect, Circle } from 'react-konva';
import { Button } from '@mui/material';
import { useHiddenContext } from './hiddencontext';
import './draw.css';
import pencilbg from './wired-lineal-35-edit.gif';
import clearcanva from './wired-lineal-185-trash-bin.gif';
import rect from './rectangle.gif';
import cir from './circle.gif';

const Draw = ({ sockett }) => {
    const { usernm } = useHiddenContext();
    const [lines, setLines] = useState([]);
    const [selectedTool, setSelectedTool] = useState('pencil');
    const isDrawing = useRef(false);
    const lastLine = useRef(null);

    useEffect(() => {
        sockett?.on('Updated drawing for users', (lines) => {
            setLines(lines);
        });

        sockett?.on('clear frontend', () => {
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
        if (usernm === localStorage.getItem('name')) {
            isDrawing.current = true;
            const { x, y } = e.target.getStage().getPointerPosition();
            lastLine.current = {
                tool: selectedTool,
                points: selectedTool === 'pencil' ? [x, y] : [],
                x,
                y,
                width: 0,
                height: 0,
                radius: 0,
            };
            setLines([...lines, lastLine.current]);
            sockett?.emit('Updated drawing for backend', [...lines, lastLine.current]);
        }
    };

    const handleMouseMove = (e) => {
        if (usernm === localStorage.getItem('name') && isDrawing.current) {
            const point = e.target.getStage().getPointerPosition();
            const updatedLines = lines.map((line, index) => {
                if (index === lines.length - 1) {
                    const updatedLine = { ...line };
                    if (selectedTool === 'pencil') {
                        updatedLine.points = updatedLine.points.concat([point.x, point.y]);
                    } else if (selectedTool === 'rectangle') {
                        updatedLine.width = point.x - updatedLine.x;
                        updatedLine.height = point.y - updatedLine.y;
                    } else if (selectedTool === 'circle') {
                        updatedLine.radius = Math.sqrt(Math.pow(point.x - updatedLine.x, 2) + Math.pow(point.y - updatedLine.y, 2));
                    }
                    return updatedLine;
                }
                return line;
            });
            setLines(updatedLines);
            sockett?.emit('Updated drawing for backend', updatedLines);
        }
    };

    const handleMouseUp = () => {
        if (usernm === localStorage.getItem('name')) {
            isDrawing.current = false;
        }
    };

    const clearCanvas = () => {
        setLines([]);
        sockett?.emit('clear', '');
    };

    return (
        <div className="h-full" style={{ width: '100%' }}>
            <div style={{ height: '12%', width: '100%' }}>
                {usernm === localStorage.getItem('name') ? (
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
                            style={{ height: '80%', width: '20%', background: `linear-gradient(45deg, #2175F3, #21AAF3)`, backgroundSize: 'cover', borderRadius: '5px', boxShadow: 'inset 0 0 20px rgba(0, 0, 255, 0.6)', transition: 'background 0.3s, transform 0.3s', transform: selectedTool === 'pencil' ? 'scale(0.8)' : 'scale(1)', fontSize: '80%', fontStretch: 'condensed', margin: '1%' }}>
                            <img src={pencilbg} style={{ height: '100%', width: 'auto', marginRight: '1px' }} />
                        </Button>
                        <Button variant="contained" onClick={() => setSelectedTool('rectangle')}
                            style={{ height: '80%', width: '20%', background: `linear-gradient(45deg, #2175F3, #21AAF3)`, backgroundSize: 'cover', borderRadius: '5px', boxShadow: 'inset 0 0 20px rgba(0, 0, 255, 0.6)', transition: 'background 0.3s, transform 0.3s', transform: selectedTool === 'rectangle' ? 'scale(0.8)' : 'scale(1)', fontSize: '80%', fontStretch: 'condensed', margin: '1%' }}>
                            <img src={rect} style={{ height: '100%', width: 'auto', marginRight: '1px' }} />
                        </Button>
                        <Button variant="contained" onClick={() => setSelectedTool('circle')}
                            style={{ height: '80%', width: '20%', background: `linear-gradient(45deg, #2175F3, #21AAF3)`, backgroundSize: 'cover', borderRadius: '5px', boxShadow: 'inset 0 0 20px rgba(0, 0, 255, 0.6)', transition: 'background 0.3s, transform 0.3s', transform: selectedTool === 'circle' ? 'scale(0.8)' : 'scale(1)', fontSize: '80%', fontStretch: 'condensed', margin: '1%' }}>
                            <img src={cir} style={{ height: '100%', width: 'auto', marginRight: '1px' }} />
                        </Button>
                        <Button variant="contained" onClick={clearCanvas}
                            style={{ height: '80%', width: '20%', background: `linear-gradient(45deg, #2175F3, #21AAF3)`, backgroundSize: 'cover', borderRadius: '5px', boxShadow: 'inset 0 0 20px rgba(0, 0, 255, 0.6)', transition: 'background 0.3s, transform 0.3s', fontSize: '80%', fontStretch: 'condensed', margin: '1%', }}>
                            <img src={clearcanva} style={{ height: '100%', width: 'auto', marginRight: '1px' }} />
                        </Button>
                    </div>
                ) : ""}
            </div>
            <div style={{ width: '100%', height: '88%', overflowX: 'hidden' }}>
                <Stage
                    width={window.innerWidth * 2 / 3}
                    height={window.innerHeight}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                >
                    <Layer>
                        {lines.map((line, index) => {
                            switch (line.tool) {
                                case 'pencil':
                                    return <Line key={index} points={line.points} stroke="black" strokeWidth={2} tension={0.5} lineCap="round" />;
                                case 'rectangle':
                                    return <Rect key={index} x={line.x} y={line.y} width={line.width} height={line.height} stroke="black" strokeWidth={2} />;
                                case 'circle':
                                    return <Circle key={index} x={line.x} y={line.y} radius={line.radius} stroke="black" strokeWidth={2} />;
                                default:
                                    return null;
                            }
                        })}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
};

export default Draw;
