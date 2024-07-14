import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Point = { x: number; y: number };

type Status = "idle" | "swapping" | "success" | "error";

const GRID_CELL = 38;

const directionOffsets = {
	0: { x: GRID_CELL, y: 0 },
	1: { x: GRID_CELL, y: 0 },
	2: { x: GRID_CELL, y: 0 },
	3: { x: 0, y: -GRID_CELL },
	4: { x: 0, y: GRID_CELL },
};

function rand(min: number, max: number) {
	return (
		Math.floor(
			crypto.getRandomValues(new Uint32Array(1))[0] % (max - min + 1),
		) + min
	);
}

function generateRandomPath() {
	const rightSegments = Math.floor(window.innerWidth / GRID_CELL) + 1;
	const points: Point[] = [];

	const minHeight = 0;
	const maxHeight = Math.floor(window.innerHeight / GRID_CELL) - minHeight;

	const head = {
		x: 0,
		// random starting height
		y: rand(minHeight, maxHeight) * GRID_CELL,
	};
	let rightCount = 0;

	points.push({ ...head });

	while (rightCount < rightSegments) {
		// can only go bottom or right or top
		// since we prefer right we will go right 4/6 of the time
		const direction = rand(0, Object.keys(directionOffsets).length - 1);

		const addX = directionOffsets[direction as keyof typeof directionOffsets].x;
		const addY = directionOffsets[direction as keyof typeof directionOffsets].y;

		points.push({ x: head.x + addX, y: head.y + addY });

		// make sure we don't go back	and forth
		if (
			points.length > 3 &&
			Math.abs(addY) > 0 &&
			points[points.length - 3].y === points[points.length - 1].y
		) {
			points.pop();
			continue;
		}

		// make sure we don't go out of the screen
		if (
			points.length > 1 &&
			(points[points.length - 1].y < minHeight * GRID_CELL ||
				points[points.length - 1].y > maxHeight * GRID_CELL)
		) {
			points.pop();
			continue;
		}

		if (addX > 0) {
			rightCount++;
		}

		head.x += addX;
		head.y += addY;
	}

	return points;
}

function AnimatedPath({
	points,
	status,
	duration,
}: { points: Point[]; status: Status; duration: number }) {
	const stroke = {
		swapping: "#FC72FF20",
		success: "#2ABDFF40",
		error: "#E32B2B50",
		idle: "#00000000",
	}[status];

	const d = useMemo(() => {
		return points
			.map((p, index) => {
				if (index === 0) return `M ${p.x},${p.y}`;
				return `L ${p.x},${p.y}`;
			})
			.join(" ");
	}, [points]);

	return (
		<svg className="absolute" width="100%" height="100%">
			<title>Animated lighting strike</title>
			<linearGradient id="strokeGradient">
				<stop stopColor={"#FC72FF20"} stopOpacity="1" />
				<stop offset="100%" stopColor={stroke} stopOpacity="1" />
			</linearGradient>
			<motion.path
				d={d}
				fill="none"
				stroke="url('#strokeGradient')"
				strokeWidth="1"
				initial={{ pathLength: 0 }}
				animate={{ pathLength: 1 }}
				transition={{
					pathLength: { type: "spring", duration, bounce: 0 },
				}}
			/>
		</svg>
	);
}

export default function Lightning({
	status,
	duration,
}: { status: Status; duration: number }) {
	const [points, setPoints] = useState<{ id: string; points: Point[] }[]>([]);

	useEffect(() => {
		if (status === "swapping" && points.length === 0) {
			setPoints(
				Array.from({ length: rand(5, 10) }, (_, index) => ({
					id: index.toString(),
					points: generateRandomPath(),
				})),
			);
		}

		if (status === "error" && points.length > 0) {
		}

		if (status === "idle" && points.length > 0) {
			setPoints([]);
		}
	}, [status, points]);

	return (
		<div className="absolute inset-0 -z-[1]">
			{points.map((p) => (
				<AnimatedPath
					key={p.id}
					points={p.points}
					status={status}
					duration={duration}
				/>
			))}
		</div>
	);
}
