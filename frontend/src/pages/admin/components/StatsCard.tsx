const ACCENTS = {
	emerald: { chip: "bg-emerald-500/15 text-emerald-400", glow: "from-emerald-500/25" },
	violet: { chip: "bg-violet-500/15 text-violet-300", glow: "from-violet-500/25" },
	orange: { chip: "bg-orange-500/15 text-orange-300", glow: "from-orange-500/25" },
	sky: { chip: "bg-sky-500/15 text-sky-300", glow: "from-sky-500/25" },
};

type StatsCardProps = {
	icon: React.ElementType;
	label: string;
	value: string;
	caption: string;
	accent: keyof typeof ACCENTS;
};

const StatsCard = ({ icon: Icon, label, value, caption, accent }: StatsCardProps) => {
	const { chip, glow } = ACCENTS[accent];
	return (
		<div className='relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.06]'>
			<div
				aria-hidden='true'
				className={`pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-gradient-to-br ${glow} to-transparent blur-2xl`}
			/>
			<div className='relative flex items-start justify-between'>
				<p className='text-sm font-medium text-zinc-300'>{label}</p>
				<span className={`rounded-lg p-2 ${chip}`}>
					<Icon className='size-5' aria-hidden='true' />
				</span>
			</div>
			<p className='relative mt-2 text-3xl font-bold tabular-nums tracking-tight'>{value}</p>
			<p className='relative mt-1 text-xs text-zinc-400'>{caption}</p>
		</div>
	);
};
export default StatsCard;
