import React, { useEffect, useRef } from "react";
//ChakraUI
import { Box } from "@chakra-ui/layout";
const Canvas = () => {
	const canvasRef = useRef();
	const boxRef = useRef();
	const painting = useRef(false);
	useEffect(() => {
		let ctx = canvasRef.current.getContext("2d");
		//Resize Canvas
		canvasRef.current.height = boxRef.current.clientHeight;
		canvasRef.current.width = boxRef.current.clientWidth;

		const startDrawing = e => {
			painting.current = true;
			//
			draw(e);
		};
		const endDrawing = e => {
			painting.current = false;
			//Reset cursor position
			ctx.beginPath();
		};
		const draw = e => {
			if (!painting.current) return;
			ctx.lineWidth = 5;
			ctx.lineCap = "round";
			if (
				e.offsetX <= 0 ||
				e.offsetX >= boxRef.current.clientWidth ||
				e.offsetY <= 0 ||
				e.offsetY >= boxRef.current.clientHeight
			) {
				return endDrawing(e);
			}
			console.log(e.offsetX, e.offsetY);
			//Draw line
			ctx.lineTo(e.offsetX, e.offsetY);
			ctx.stroke();
			//Reset position to start
			ctx.beginPath();
			ctx.moveTo(e.offsetX, e.offsetY);
		};
		canvasRef.current.addEventListener("mousedown", startDrawing);
		canvasRef.current.addEventListener("mouseup", endDrawing);
		canvasRef.current.addEventListener("mousemove", draw);
	}, []);

	return (
		<Box height="80vh" width="57%" bg="gray.100" ref={boxRef}>
			<canvas ref={canvasRef}></canvas>
		</Box>
	);
};

export default Canvas;
