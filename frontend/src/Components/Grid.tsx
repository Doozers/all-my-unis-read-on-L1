export default function Grid() {
	return (
		<div
			className="absolute -z-[1] left-0 right-0 top-0 bottom-0 w-full h-dvh"
			style={{
				backgroundRepeat: "repeat",
				backgroundSize: "38px 38px",
				backgroundImage: `linear-gradient(to right, #FFFFFE08 1px, transparent 1px),
                          linear-gradient(to bottom, #FFFFFE08 1px, transparent 1px)`,
			}}
		/>
	);
}
