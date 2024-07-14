import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { scroll } from "viem/chains";
import { metaMask, walletConnect } from "wagmi/connectors";

declare module "wagmi" {
	interface Register {
		config: typeof config;
	}
}

const config = createConfig({
	chains: [scroll],
	connectors: [
		metaMask(),
		walletConnect({ projectId: "2d44ea82196fba51d44f37aa9f363d0e" }),
	],
	transports: {
		[scroll.id]: http(),
	},
});

const queryClient = new QueryClient();

export default function WagmiWrapper({
	children,
}: { children: React.ReactNode }) {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	);
}
