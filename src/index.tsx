import "./styles/main.scss"
import "bootstrap/dist/js/bootstrap.js"
import "bootstrap-icons/font/bootstrap-icons.scss"
import "./global/Modals"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { Auth0ProviderWithHistory } from "./auth/Auth0ProviderWithHistory"
import NiceModal from "@ebay/nice-modal-react"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
	<BrowserRouter>
		<Auth0ProviderWithHistory>
			<NiceModal.Provider>
				<App />
			</NiceModal.Provider>
		</Auth0ProviderWithHistory>
	</BrowserRouter>
)
