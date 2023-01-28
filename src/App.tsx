import { Navigate, Route, Routes } from "react-router-dom"
import MealPlan from "./layouts/MealPlan"
import NavBar from "./layouts/re-useable/NavBar"
import ViewFoods from "./layouts/view-foods/ViewFoods"
import ViewMeals from "./layouts/ViewMeals"

function App() {
	return (
		<div>
			<NavBar loggedIn={true} />
			<Routes>
				<Route path="/" element={<Navigate replace to="/mealplan" />} />
				<Route path="/mealplan" element={<MealPlan />} />
				<Route path="/meals" element={<ViewMeals />} />
				<Route path="/foods" element={<ViewFoods />} />
			</Routes>
		</div>
	)
}

export default App
