// Shared look for Clerk's <UserButton>: a 40px avatar (Clerk's default is 28px) with a soft ring.
// Style objects (not Tailwind classes) so they reliably override Clerk's built-in sizing.
export const userButtonAppearance = {
	elements: {
		userButtonAvatarBox: {
			width: "2.5rem",
			height: "2.5rem",
			boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.15)",
			transition: "box-shadow 150ms ease",
			"&:hover": { boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.45)" },
		},
	},
};
