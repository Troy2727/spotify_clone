import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";

const SignInOAuthButtons = () => {
	const { signIn, isLoaded } = useSignIn();

	if (!isLoaded) {
		return null;
	}

	const signInWithGoogle = () => {
		console.log("Signing in with Google...");
		signIn.authenticateWithRedirect({
			strategy: "oauth_google",
			redirectUrl: "/sso-callback",
			redirectUrlComplete: "/auth-callback",
		});
	};

	return (
		<Button
			onClick={signInWithGoogle}
			variant={"secondary"}
			size={"sm"}
			className='text-white border-zinc-200 h-8 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm'
		>
			<img src='/google.png' alt='Google' className='size-4 sm:size-5 mr-1 sm:mr-2' />
			<span>Sign in</span>
			<span className="hidden sm:inline ml-1">with Google</span>
		</Button>
	);
};
export default SignInOAuthButtons;
