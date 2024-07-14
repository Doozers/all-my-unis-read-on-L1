import { AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import WalletModal from "./WalletModal";

type WalletProps = {
	className?: string;
};

export default function Wallet({ className }: WalletProps) {
	const [showWalletSelector, setShowWalletSelector] = useState(false);
	const { address } = useAccount();
	const { disconnect } = useDisconnect();

	const onClose = useCallback(() => setShowWalletSelector(false), []);

	return (
		<>
			<AnimatePresence>
				{showWalletSelector && <WalletModal onClose={onClose} />}
			</AnimatePresence>

			<div className={`${className} flex items-center h-12`}>
				{address ? (
					<>
						<div className="p-3 text-white bg-primary/20 rounded-l-lg border border-r-0 border-primary/20">
							{address.slice(0, 6)}...{address.slice(-4)}
						</div>
						<button
							type="button"
							onClick={() => disconnect()}
							className="p-3 text-error bg-error/20 rounded-r-lg border border-l-0 border-error/20
								focus:outline-none focus:ring-2 focus:ring-error/40	"
						>
							logout
						</button>
					</>
				) : (
					<button
						type="button"
						onClick={() => setShowWalletSelector(true)}
						className="p-3 text-white bg-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
					>
						Connect wallet
					</button>
				)}
			</div>
		</>
	);
}
