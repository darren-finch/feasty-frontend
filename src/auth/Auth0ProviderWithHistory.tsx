import { AppState, Auth0Provider } from "@auth0/auth0-react"
import { PropsWithChildren } from "react"
import { useNavigate } from "react-router-dom"

export const Auth0ProviderWithHistory: React.FC<PropsWithChildren> = (props) => {
	const domain = process.env.REACT_APP_AUTH0_DOMAIN ?? ""
	const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID ?? ""
	const callbackUri = process.env.REACT_APP_AUTH0_CALLBACK_URL ?? ""
	const audience = process.env.REACT_APP_AUTH0_AUDIENCE ?? ""

	const navigate = useNavigate()

	const handleRedirectCallback = (appState: AppState | undefined) => {
		navigate(appState?.returnTo ?? window.location.pathname)
	}
	return (
		<Auth0Provider
			domain={domain}
			clientId={clientId}
			onRedirectCallback={handleRedirectCallback}
			authorizationParams={{
				redirect_uri: callbackUri,
				audience: audience,
			}}>
			{props.children}
		</Auth0Provider>
	)
}
