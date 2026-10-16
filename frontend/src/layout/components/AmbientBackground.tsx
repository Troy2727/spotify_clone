// Full-window "Midnight" glow (indigo, blue and teal, defined in index.css) that slowly drifts
const AmbientBackground = () => (
	<div aria-hidden='true' className='pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#121212]'>
		<div className='ambient-glow absolute -inset-[15%]' />
	</div>
);

export default AmbientBackground;
