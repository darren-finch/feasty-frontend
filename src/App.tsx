import { useAuth0 } from "@auth0/auth0-react"
import axios from "axios"
import { Navigate, Route, Routes } from "react-router-dom"
import { FoodRepository } from "./data/food/FoodRepository"
import { MealRepository } from "./data/meal/MealRepository"
import { MealPlanMealRepository } from "./data/mealplan/MealPlanMealRepository"
import { MealPlanRepository } from "./data/mealplan/MealPlanRepository"
import CenteredSpinner from "./layouts/re-useable/misc/CenteredSpinner"
import NavBar from "./layouts/re-useable/NavBar"
import ViewFoods from "./layouts/view-foods/ViewFoods"
import ViewMealPlan from "./layouts/view-meal-plan/ViewMealPlan"
import ViewMeals from "./layouts/view-meals/ViewMeals"

export const feastyAxiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_SERVER_URL + "/api",
	timeout: 10000,
})

export const foodRepository: FoodRepository = new FoodRepository()
export const mealRepository: MealRepository = new MealRepository()
export const mealPlanRepository: MealPlanRepository = new MealPlanRepository()
export const mealPlanMealRepository: MealPlanMealRepository = new MealPlanMealRepository()

const App: React.FC = () => {
	const { loginWithRedirect, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()

	// Add the access token to all api requests, or re-direct to logout page if that returns an error.
	// And all requests to and from the API are in JSON, so we will set that as the content type for all requests.
	feastyAxiosInstance.interceptors.request.use(
		async (config) => {
			try {
				const accessToken = await getAccessTokenSilently()
				config.headers.Authorization = `Bearer ${accessToken}`
				config.headers["Content-Type"] = "application/json"
			} catch (err: any) {
				loginWithRedirect({ appState: { returnTo: window.location.pathname } })
			}
			return config
		},
		(error) => {
			return Promise.reject(error)
		}
	)

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
						<Route path="/mealplan" element={<ViewMealPlan />} />
						<Route path="/meals" element={<ViewMeals />} />
						<Route path="/foods" element={<ViewFoods />} />
					</Routes>
				</>
			)}
		</>
	)
}

export default App
