import React, { useEffect, useState } from "react"
import { Accordion, Button, Col, Form, Row } from "react-bootstrap"
import { Food } from "../../models/Food"
import FoodCard from "../view-foods/components/FoodCard"

const SearchableFoodsList: React.FC = () => {
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
		<div>
			<Form>
				<Row>
					<Col className="col-12 col-lg-8 d-flex align-items-center">
						<p className="h5">Search</p>
					</Col>
					<Col className="col col-lg-4 gap-4 d-flex align-items-center">
						<Form.Control
							style={{ minWidth: "150px" }}
							className="flex-shrink-1"
							type="text"
							name="searchTextInput"
							id="searchTextInput"
							placeholder="Enter food name..."
						/>
						<Button variant="outline-primary">
							<i className="bi bi-search"></i>
						</Button>
					</Col>
				</Row>
			</Form>
			<Accordion>
				{foods.map((food) => {
					return <FoodCard key={food.id} food={food} />
				})}
			</Accordion>
		</div>
	)
}

export default SearchableFoodsList
