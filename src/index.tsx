import "./styles/main.scss"
import "bootstrap/dist/js/bootstrap.js"
import "bootstrap-icons/font/bootstrap-icons.scss"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { Auth0ProviderWithHistory } from "./auth/Auth0ProviderWithHistory"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
	<BrowserRouter>
		<Auth0ProviderWithHistory>
			<App />
		</Auth0ProviderWithHistory>
	</BrowserRouter>
)
