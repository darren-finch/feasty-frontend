import React, { FC, useEffect, useState } from "react"
import { Food } from "../../models/Food"
import FoodCard from "./components/FoodCard"

const ViewFoods: React.FC = () => {
	const [foods, setFoods] = useState<Food[]>([])
	const [isError, setIsError] = useState<Boolean>(false)

	useEffect(() => {
		const foodsUrl = "http://localhost:8080/api/foods"

		const fetchFoods = async () => {
			try {
				const response = await fetch(foodsUrl)

				if (!response.ok) {
					throw new Error("Something went wrong.")
				}

				const responseJson = await response.json()

				const responseData = responseJson._embedded.foods

				const loadedFoods: Food[] = []
				for (const key in responseData) {
					loadedFoods.push(
						new Food(
							key,
							responseData[key].title,
							responseData[key].quantity,
							responseData[key].unit,
							responseData[key].calories,
							responseData[key].fats,
							responseData[key].carbs,
							responseData[key].proteins
						)
					)
				}

				setFoods(loadedFoods)
			} catch (err: any) {
				setIsError(true)
			}
		}

		fetchFoods()
	}, [])

	if (isError) {
		return <p>Whoops, we ran into an error.</p>
	}

	return (
		<div className="container">
			<h1>Foods</h1>
			<div className="accordion accordion-flush" id="foodsAccordion">
				{foods.map((food) => {
					return <FoodCard key={food.id} food={food} />
				})}
			</div>
		</div>
	)
}

export default ViewFoods
