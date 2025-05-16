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
			className='text-white border-zinc-200 h-11'
		>
			<img src='/google.png' alt='Google' className='size-5 mr-2' />
			Sign in with Google
		</Button>
	);
};
export default SignInOAuthButtons;
