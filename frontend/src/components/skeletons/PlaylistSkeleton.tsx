/** Seven grey rows standing in for the sidebar's album list while it loads. */
export default function PlaylistSkeleton() {
	return (
		<>
			{Array.from({ length: 7 }, (_, i) => (
				<div key={i} className='flex animate-pulse items-center gap-3 rounded-md p-2'>
					<div className='h-12 w-12 flex-shrink-0 rounded-md bg-zinc-800' />
					<div className='hidden min-w-0 flex-1 space-y-2 md:block'>
						<div className='h-4 w-3/4 rounded bg-zinc-800' />
						<div className='h-3 w-1/2 rounded bg-zinc-800' />
					</div>
				</div>
			))}
		</>
	);
}
