const bar = "rounded bg-zinc-700";

/** Placeholder for SectionGrid while songs load: a title bar and four empty cards. */
export default function SectionGridSkeleton() {
	return (
		<div className='mb-8' aria-busy>
			<div className='mb-4 h-8 w-48 animate-pulse rounded bg-zinc-800' />
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				{Array.from({ length: 4 }, (_, i) => (
					<div key={i} className='animate-pulse space-y-2 rounded-md bg-zinc-800/40 p-4'>
						<div className='mb-4 aspect-square rounded-md bg-zinc-700' />
						<div className={`h-4 w-3/4 ${bar}`} />
						<div className={`h-4 w-1/2 ${bar}`} />
					</div>
				))}
			</div>
		</div>
	);
}
