import { useAuth0 } from "@auth0/auth0-react"
import NiceModal from "@ebay/nice-modal-react"
import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { Meal } from "../../data/meal/Meal"
import { MealFoodCombinedId } from "../../data/meal/MealFood"
import { mealRepository } from "../../global/Dependencies"
import { getMacroNutrientsString } from "../../services/GetMacroNutrientsString"
import SearchableAccordionList from "../re-useable/lists/SearchableAccordionList"
import SearchableAccordionListElement from "../re-useable/lists/SearchableAccordionListElement"
import MealFoodCard from "./components/MealFoodCard"

const ViewMeals = () => {
	const { getAccessTokenSilently } = useAuth0()

	const [mealsList, setMealsList] = useState<Meal[]>([])
	const [isMealsListLoading, setIsMealsListLoading] = useState(true)
	const [getMealsListError, setGetMealsListError] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState("")

	const fetchMeals = async () => {
		setIsMealsListLoading(true)
		try {
			const accessToken = await getAccessTokenSilently()
			const response = await mealRepository.fetchMealsByTitle(searchQuery, accessToken)

			if (response.error) {
				throw response.error
			} else {
				setIsMealsListLoading(false)
				setMealsList(response.value)
				setGetMealsListError(null)
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
		NiceModal.show("edit-meal-modal").then(() => {
			fetchMeals()
		})
	}
	const handleEditMealClicked = (selectedMeal: Meal) => {
		NiceModal.show("edit-meal-modal", { meal: selectedMeal }).then(() => {
			fetchMeals()
		})
	}
	const handleDeleteMealClicked = async (selectedMealId: number) => {
		setIsMealsListLoading(true)
		const accessToken = await getAccessTokenSilently()
		await mealRepository.deleteMeal(selectedMealId, accessToken)
		fetchMeals()
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
				const accessToken = await getAccessTokenSilently()
				const response = await mealRepository.saveMeal(newMeal, accessToken)

				if (response.error) {
					throw response.error
				} else {
					fetchMeals()
				}
			} catch (err: any) {
				setGetMealsListError(err)
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
											key={mealFood.combinedId.toString()}
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
