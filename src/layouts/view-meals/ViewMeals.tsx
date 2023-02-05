import NiceModal from "@ebay/nice-modal-react"
import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { Meal } from "../../data/meal/Meal"
import { MealFood } from "../../data/meal/MealFood"
import { mealRepository } from "../../global/Dependencies"
import { getMacroNutrientsString } from "../../services/GetMacroNutrientsString"
import SearchableAccordionList from "../re-useable/lists/SearchableAccordionList"
import SearchableAccordionListElement from "../re-useable/lists/SearchableAccordionListElement"
import MealFoodCard from "./components/MealFoodCard"

const ViewMeals = () => {
	const [mealsList, setMealsList] = useState<Meal[]>([])
	const [isMealsListLoading, setIsMealsListLoading] = useState(true)
	const [getMealsListError, setGetMealsListError] = useState<string | null>(null)
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
			}
		} catch (err: any) {
			setIsMealsListLoading(false)
			setGetMealsListError(err)
		}
	}

	useEffect(() => {
		fetchMeals()
	}, [])

	// MEAL CARDS EVENT HANDLERS
	const handleAddMealClicked = () => {
		NiceModal.show("edit-meal-modal").then(() => {})
	}
	const handleEditMealClicked = (selectedMeal: Meal) => {
		NiceModal.show("edit-meal-modal", { meal: selectedMeal }).then(() => {})
	}
	const handleDeleteMealClicked = (selectedMealId: number) => {
		console.log("Delete meal #" + selectedMealId)
	}

	// MEAL FOOD EVENT HANDLERS
	const handleEditMealFoodClicked = (selectedMealFood: MealFood) => {}
	const handleDeleteMealFoodClicked = (selectedMealFoodId: number) => {
		console.log("Delete meal food #" + selectedMealFoodId)
	}

	// SEARCH HEADER EVENT HANDLERS
	const handleSearchQueryChange = (newSearchQuery: string) => {
		setSearchQuery(newSearchQuery)
	}
	const handleSearchClicked = () => {
		fetchMeals()
	}

	// EDIT MEAL MODAL EVENT HANDLERS
	const handleEditMealModalCloseClicked = () => {}
	const handleEditMealModalSuccessfulSave = () => {}

	return (
		<Container>
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
			<SearchableAccordionList
				elementList={mealsList.map((meal) => {
					const aggregatedMacroNutrients = {
						calories: 0,
						fats: 0,
						carbs: 0,
						proteins: 0,
					}

					meal.mealFoods.forEach((mealFood) => {
						const mealFoodMacroNutrients = mealFood.macroNutrientsForDesiredQuantity
						aggregatedMacroNutrients.calories += mealFoodMacroNutrients.calories
						aggregatedMacroNutrients.fats += mealFoodMacroNutrients.fats
						aggregatedMacroNutrients.carbs += mealFoodMacroNutrients.carbs
						aggregatedMacroNutrients.proteins += mealFoodMacroNutrients.proteins
					})

					return (
						<SearchableAccordionListElement
							key={meal.id}
							headerElements={
								<p className="fw-bold">{`${meal.title} | ${getMacroNutrientsString(
									aggregatedMacroNutrients.calories,
									aggregatedMacroNutrients.fats,
									aggregatedMacroNutrients.carbs,
									aggregatedMacroNutrients.proteins
								)}`}</p>
							}
							bodyElements={
								<div>
									<p>Foods</p>
									{meal.mealFoods.map((mealFood) => (
										<MealFoodCard
											key={mealFood.id}
											mealFood={mealFood}
											onQuantityChange={() => {}}
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
				error={getMealsListError}
				searchQuery={searchQuery}
				onSearchQueryChange={handleSearchQueryChange}
				onSearchClicked={handleSearchClicked}
			/>
		</Container>
	)
}

export default ViewMeals
