import { useAuth0 } from "@auth0/auth0-react"
import NiceModal from "@ebay/nice-modal-react"
import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { mealRepository } from "../../App"
import { Meal } from "../../data/meal/Meal"
import { MealFoodCombinedId } from "../../data/meal/MealFood"
import { getMacroNutrientsString as getMacrosString } from "../../services/GetMacroNutrientsString"
import AccordionList from "../re-useable/lists/AccordionList"
import AccordionListElement from "../re-useable/lists/AccordionListElement"
import SearchHeader from "../re-useable/misc/SearchHeader"
import MealFoodCard from "./components/MealFoodCard"

const ViewMeals = () => {
	const [mealsList, setMealsList] = useState<Meal[]>([])
	const [isMealsListLoading, setIsMealsListLoading] = useState(true)
	const [fetchMealsListError, setFetchMealsListError] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState("")

	const fetchMeals = async () => {
		setIsMealsListLoading(true)
		try {
			const response = await mealRepository.fetchMealsByTitle(searchQuery)

			if (response.error) {
				throw response.error
			} else {
				setIsMealsListLoading(false)
				setMealsList(response.value)
				setFetchMealsListError(null)
			}
		} catch (err: any) {
			setIsMealsListLoading(false)
			setFetchMealsListError(err)
		}
	}

	useEffect(() => {
		fetchMeals()
	}, [])

	// MEAL CARDS EVENT HANDLERS
	const handleAddMealClicked = () => {
		NiceModal.show("edit-meal-modal").then(() => {
			fetchMeals()
		})
	}
	const handleEditMealClicked = (selectedMeal: Meal) => {
		NiceModal.show("edit-meal-modal", { meal: selectedMeal }).then(() => {
			fetchMeals()
		})
	}
	const handleDeleteMealClicked = (selectedMealId: number) => {
		NiceModal.show("confirmation-modal", {
			mainMsg: "This will remove this meal from all meal plans that reference it.",
		}).then(
			async () => {
				await mealRepository.deleteMeal(selectedMealId)
				fetchMeals()
			},
			() => {}
		)
	}

	// MEAL FOOD EVENT HANDLERS
	const handleDeleteMealFoodClicked = async (selectedMealFoodId: MealFoodCombinedId) => {
		const meal = mealsList.find((meal) => meal.id == selectedMealFoodId.mealId)
		if (meal) {
			const newMeal = new Meal(
				meal.id,
				meal.title,
				meal.mealFoods.filter((mealFood) => mealFood.combinedId != selectedMealFoodId)
			)

			try {
				const response = await mealRepository.saveMeal(newMeal)

				if (response.error) {
					throw response.error
				} else {
					fetchMeals()
				}
			} catch (err: any) {
				setFetchMealsListError(err)
			}
		}
	}

	// SEARCH HEADER EVENT HANDLERS
	const handleSearchQueryChange = (newSearchQuery: string) => {
		setSearchQuery(newSearchQuery)
	}
	const handleSearchClicked = () => {
		fetchMeals()
	}

	return (
		<Container className="d-flex flex-column h-100 overflow-auto">
			<Row className="my-4">
				<Col className="d-flex align-items-center justify-content-start">
					<h1>Meals</h1>
				</Col>
				<Col className="d-flex align-items-center justify-content-end">
					<Button onClick={handleAddMealClicked}>
						<i className="bi bi-plus-lg"></i>
					</Button>
				</Col>
			</Row>
			<SearchHeader
				searchQuery={searchQuery}
				onSearchQueryChange={handleSearchQueryChange}
				onSearchClicked={handleSearchClicked}
			/>
			<div className="mb-4 overflow-auto">
				<AccordionList
					elementList={mealsList.map((meal) => {
						const aggregatedMacros = meal.aggregatedMacros

						return (
							<AccordionListElement
								key={meal.id}
								headerElements={
									<p className="fw-bold">{`${meal.title} | ${getMacrosString(
										aggregatedMacros.calories,
										aggregatedMacros.fats,
										aggregatedMacros.carbs,
										aggregatedMacros.proteins
									)}`}</p>
								}
								bodyElements={
									<div>
										<p>Foods</p>
										{meal.mealFoods.map((mealFood) => (
											<MealFoodCard
												key={mealFood.combinedId.toString()}
												mealFood={mealFood}
												onDeleteMealFoodClicked={handleDeleteMealFoodClicked}
											/>
										))}
									</div>
								}
								entityId={meal.id}
								entity={meal}
								onEditEntityClicked={handleEditMealClicked}
								onDeleteEntityClicked={handleDeleteMealClicked}
							/>
						)
					})}
					isLoading={isMealsListLoading}
					error={fetchMealsListError}
				/>
			</div>
		</Container>
	)
}

export default ViewMeals
