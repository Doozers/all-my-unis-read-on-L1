import { useFocusTrap, useHotkeys } from "@mantine/hooks";
import { useConnect } from "wagmi";
import { motion } from "framer-motion";
import { MetaMaskIcon, WalletConnectIcon } from "../Icons";

const WALLET_ICONS = {
	metaMaskSDK: <MetaMaskIcon className="size-6 shrink-0" />,
	walletConnect: <WalletConnectIcon className="size-6 shrink-0" />,
};

type WalletModalProps = {
	onClose: () => void;
};

export default function WalletModal({ onClose }: WalletModalProps) {
	const { connectors, variables, isPending, connectAsync } = useConnect();

	const ref = useFocusTrap();

	useHotkeys([["Escape", () => onClose()]]);

	return (
		<motion.div
			ref={ref}
			className="absolute z-50 isolate inset-0 grid place-items-center"
			onKeyDown={(e) => e.key === "Escape" && onClose()}
		>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="absolute inset-0 backdrop-blur-md bg-white/10"
			/>

			<button
				type="button"
				onClick={() => onClose()}
				className="absolute right-2 top-2 focus:outline-none focus:ring-2 focus:ring-white/40 rounded-sm"
			>
				<svg
					className="size-6 p-0.5"
					viewBox="0 0 42 42"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Close wallet selector</title>
					<path
						d="M1 1L41 41M41 1L1 41"
						stroke="white"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>

			<motion.div
				initial={{ scale: 0.8 }}
				animate={{ scale: 1 }}
				exit={{ opacity: 0 }}
				className="flex isolate flex-col gap-3"
			>
				<h2 className="text-xl text-white">Connect your wallet</h2>

				{connectors.map((e) => (
					<motion.button
						key={e.id}
						type="button"
						onClick={() => connectAsync({ connector: e }).then(() => onClose())}
						whileHover={{ scale: 1.01 }}
						whileTap={{ scale: 0.99 }}
						className={`flex items-center gap-2
							text-black p-3 rounded-lg bg-white
							focus:outline-none focus:ring-2 focus:ring-white/40
							${
								typeof variables?.connector !== "function" &&
								variables?.connector.uid === e.uid &&
								isPending
									? "animate-pulse"
									: ""
							}`}
					>
						{e.icon ? (
							<img src={e.icon} alt="wallet icon" className="size-6 shrink-0" />
						) : (
							WALLET_ICONS?.[e.id as keyof typeof WALLET_ICONS]
						)}

						<span>{e.name}</span>
					</motion.button>
				))}
			</motion.div>
		</motion.div>
	);
}
