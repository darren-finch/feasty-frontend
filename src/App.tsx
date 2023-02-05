import { useAuth0 } from "@auth0/auth0-react"
import { Navigate, Route, Routes } from "react-router-dom"
import MealPlan from "./layouts/MealPlan"
import CenteredSpinner from "./layouts/re-useable/misc/CenteredSpinner"
import NavBar from "./layouts/re-useable/NavBar"
import ViewFoods from "./layouts/view-foods/ViewFoods"
import ViewMeals from "./layouts/ViewMeals"

const App: React.FC = () => {
	const { loginWithRedirect, isLoading, isAuthenticated, user } = useAuth0()

	if (isLoading) {
		return <CenteredSpinner />
	}

	if (!isAuthenticated) {
		loginWithRedirect({
			appState: {
				returnTo: window.location.pathname,
			},
		})
	}

	return (
		<>
			{isAuthenticated && (
				<>
					<NavBar />
					<Routes>
						<Route path="/" element={<Navigate replace to="/mealplan" />} />
						<Route path="/mealplan" element={<MealPlan />} />
						<Route path="/meals" element={<ViewMeals />} />
						<Route path="/foods" element={<ViewFoods />} />
					</Routes>
				</>
			)}
		</>
	)
}

export default App
