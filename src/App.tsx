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
				<Route path="/" element={<Navigate replace to="/mymealplan" />} />
				<Route path="/mymealplan" element={<MealPlan />} />
				<Route path="/foods" element={<ViewFoods />} />
				<Route path="/meals" element={<ViewMeals />} />
			</Routes>
		</div>
	)
}

export default App
