import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Wallet from "./Components/Wallet";
import Grid from "./Components/Grid";
import Gradients from "./Components/Gradients";
import Lightning from "./Components/Lightning";

function InputKpi({
	text,
	token,
	value,
	variant,
	onChange,
}: {
	token: string;
	value: string;
	text: string;
	variant: "secondary" | "primary";
	onChange: (value: string) => void;
}) {
	return (
		<div className="flex flex-col gap-[30px]">
			<div className="flex w-max gap-5 items-center">
				<span
					className={`text-5xl
						${variant === "secondary" ? "text-secondary" : "text-primary"}`}
				>
					{text}
				</span>
				<span
					className={`px-4 py-3 text-white text-4xl rounded-2xl bg-opacity-[0.12]
						${variant === "secondary" ? "bg-secondary" : "bg-primary"}`}
				>
					{token}
				</span>
			</div>

			<div className="relative h-20 w-full">
				<input
					className={`absolute inset-0 rounded-2xl text-4xl p-5 focus:outline-none
						text-white border-opacity-25 bg-white bg-opacity-15 border
						focus:ring-2 ${
							variant === "secondary"
								? "border-secondary focus:ring-secondary/40"
								: "border-primary focus:ring-primary/40"
						}`}
					placeholder="0.00"
					value={value}
					onChange={(e) => onChange(e.target.value)}
				/>
			</div>
		</div>
	);
}

function SwapButton({ onClick }: { onClick: () => void }) {
	const [isHovered, setHovered] = useState(false);

	return (
		<motion.div
			className="relative bg-dark overflow-hidden rounded-2xl border border-opacity-25 border-white
			focus-within:outline-none focus-within:ring-2 focus-within:ring-white focus-within:ring-opacity-40"
		>
			<motion.svg
				xmlns="http://www.w3.org/2000/svg"
				className="absolute z-0 -inset-[1px] w-[calc(100%+2px)] h-[calc(100%+2px)]"
			>
				<title>Animated background gradient</title>
				<motion.linearGradient
					id="buttonBackground"
					initial={false}
					animate={{
						gradientTransform: isHovered ? "translate(-0.1)" : "translate(0.5)",
					}}
					transition={{ duration: 0.3, ease: "easeInOut" }}
				>
					<stop stopColor="#FC72FF" stopOpacity="0.35" />
					<stop offset="100%" stopColor="#2ABDFF" stopOpacity="0.35" />
				</motion.linearGradient>
				<motion.rect
					x="0"
					y="0"
					width="100%"
					height="100%"
					fill="url('#buttonBackground')"
				/>
			</motion.svg>
			<motion.button
				onHoverStart={() => setHovered(true)}
				onHoverEnd={() => setHovered(false)}
				whileHover={{ scale: 1.01 }}
				whileTap={{ scale: 0.99 }}
				className="w-full text-3xl z-10 isolate text-white p-2.5 focus:outline-none"
				type="button"
				onClick={onClick}
			>
				Swap
			</motion.button>
		</motion.div>
	);
}

export default function App() {
	const [sellValue, setSellValue] = useState("");

	const [duration] = useState(3);

	const buyValue = useMemo(() => {
		const num = Number(sellValue) * 2;
		return num === 0 ? "" : num.toString();
	}, [sellValue]);

	const [status, setStatus] = useState<
		"idle" | "swapping" | "success" | "error"
	>("idle");

	const timeoutRef = useRef<number | null>(null);
	const onSwap = async () => {
		status === "idle" ? setStatus("swapping") : setStatus("idle");

		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = +setTimeout(() => {
			if (Math.random() > 0.5) {
				setStatus("success");
			} else {
				setStatus("error");
			}
		}, duration * 500);
	};

	return (
		<>
			<h1 className="mt-20 mb-10 text-4xl text-white mx-auto">
				All my 🦄 read on L1
			</h1>

			<Wallet className="mb-20 mx-auto" />

			<main
				className="max-w-3xl z-10 flex flex-col gap-[30px] mx-auto relative
					before:content-['']
					before:absolute before:-inset-20 before:-z-[1]
					before:bg-[radial-gradient(50%_50%_at_50%_50%,#131313_0%,#13131300_100%)]"
			>
				<header>
					<div className="flex items-start gap-[30px]">
						<InputKpi
							onChange={setSellValue}
							text="sell"
							token="token A"
							value={sellValue}
							variant="primary"
						/>
						<InputKpi
							onChange={() => {}}
							text="buy"
							token="token B"
							value={buyValue}
							variant="secondary"
						/>
					</div>
				</header>

				<div className="mx-auto flex gap-4 items-center">
					<span className="text-white text-xl">Price deviation from L1</span>
					<input
						type="text"
						className="px-2 py-1 text-lg min-w-1 w-20 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white/60"
						placeholder="5.00%"
					/>
				</div>

				<SwapButton onClick={onSwap} />
			</main>

			<Lightning status={status} duration={duration} />
			<Grid />
			<Gradients />
		</>
	);
}
