import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";

/** "Sign in with Google": Clerk redirects to Google and back to /sso-callback. */
export default function SignInOAuthButtons() {
	const { signIn, isLoaded } = useSignIn();
	if (!isLoaded) return null;

	const startGoogle = () =>
		signIn.authenticateWithRedirect({ strategy: "oauth_google", redirectUrl: "/sso-callback", redirectUrlComplete: "/auth-callback" });

	return (
		<Button onClick={startGoogle} variant='secondary' size='sm' className='h-8 border-zinc-200 px-2 text-xs text-white sm:h-10 sm:px-4 sm:text-sm'>
			<img src='/google.png' alt='' className='mr-1 size-4 sm:mr-2 sm:size-5' />
			Sign in<span className='hidden sm:inline'>&nbsp;with Google</span>
		</Button>
	);
}
