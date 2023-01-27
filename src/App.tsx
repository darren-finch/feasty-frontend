import { Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import Dashboard from "./layouts/Dashboard"
import NavBar from "./layouts/NavBar"
import ViewFoods from "./layouts/ViewFoods"
import ViewMeals from "./layouts/ViewMeals"

function App() {
	return (
		<div>
			<NavBar />
			<Routes>
				<Route path="/" element={<Navigate replace to="/home" />} />
				<Route path="/home" element={<Dashboard />} />
				<Route path="/foods" element={<ViewFoods />} />
				<Route path="/meals" element={<ViewMeals />} />
			</Routes>
		</div>
	)
}

export default App
