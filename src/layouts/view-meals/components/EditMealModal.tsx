import NiceModal, { useModal } from "@ebay/nice-modal-react"
import { useState } from "react"
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap"
import { Food } from "../../../data/food/Food"
import { Meal } from "../../../data/meal/Meal"
import { MealFood } from "../../../data/meal/MealFood"
import { getMacroNutrientsString } from "../../../services/GetMacroNutrientsString"
import { testFood1, testFood2, testFood3 } from "../../../util/TestUtils"
import FormTextInput from "../../re-useable/forms/FormTextInput"
import ErrorDisplay from "../../re-useable/misc/ErrorDisplay"
import SearchHeader from "../../re-useable/misc/SearchHeader"
import EditEntityModal from "../../re-useable/modals/EditEntityModal"
import MealFoodCard from "./MealFoodCard"

enum EditMealModalScreen {
	EDIT_MEAL,
	LOADING,
	ERROR,
	SELECT_MEAL_FOOD,
}

const EditMealModal = NiceModal.create(() => {
	const modal = useModal("edit-meal-modal")
	const meal: Meal = modal.args?.meal as Meal

	const [currentScreenValue, setCurrentScreenValue] = useState(EditMealModalScreen.EDIT_MEAL)
	const [validationWasAttempted, setValidationWasAttempted] = useState(false)
	const [error, setError] = useState<string | null>("")
	const [fields, setFields] = useState({
		title: {
			value: meal?.title ?? "",
			isValid: meal != null,
		},
		mealFoods: {
			value: meal?.mealFoods ?? [],
			isValid: meal != null,
		},
	})

	const [selectedFood, setSelectedFood] = useState<Food | null>(null)
	const [searchQuery, setSearchQuery] = useState("")

	const setCurrentScreen = (nextScreen: EditMealModalScreen) => {
		// We delay setting the next screen so we can display a spinner for a short time
		setCurrentScreenValue(EditMealModalScreen.LOADING)
		const screenTransitionTimeMs = Math.random() * 200
		setTimeout(() => {
			setCurrentScreenValue(nextScreen)
		}, screenTransitionTimeMs)
	}

	const saveMeal = () => {}

	const formIsValid = () => {
		// Assume the form is valid and when we find a field that is invalid, we will make the form invalid.
		let valid = true

		type fieldKeyType = keyof typeof fields
		Object.keys(fields).forEach((key) => {
			const field = fields[key as fieldKeyType]
			if (!field.isValid) {
				valid = false
			}
		})

		return valid
	}

	const handleSaveClicked = () => {
		switch (currentScreenValue) {
			case EditMealModalScreen.EDIT_MEAL:
				try {
					if (formIsValid()) {
						console.log("Form is valid")
						saveMeal()
					} else {
						console.log("Form is invalid")
					}
					setValidationWasAttempted(true)
				} catch (e) {
					console.log(e)
				}
				break
			case EditMealModalScreen.SELECT_MEAL_FOOD:
				if (selectedFood != null) {
					addFoodToMeal(selectedFood)
					setSelectedFood(null)
					setSearchQuery("")
					setCurrentScreen(EditMealModalScreen.EDIT_MEAL)
				}
		}
	}

	function addFoodToMeal(selectedFood: Food) {
		setFields({
			...fields,
			mealFoods: {
				value: [
					...fields.mealFoods.value,
					new MealFood(fields.mealFoods.value.length + 1, selectedFood, selectedFood.quantity),
				],
				isValid: true,
			},
		})
	}

	const handleClose = () => {
		switch (currentScreenValue) {
			case EditMealModalScreen.EDIT_MEAL:
				modal.hide()
				break
			case EditMealModalScreen.SELECT_MEAL_FOOD:
				setSelectedFood(null)
				setSearchQuery("")
				setCurrentScreen(EditMealModalScreen.EDIT_MEAL)
				break
		}
	}

	const handleExited = () => {
		setError(null)
		modal.remove()
	}

	const handleFormInputChange = (inputName: string, newInputValue: string, newInputValueIsValid: boolean) => {
		setFields({ ...fields, [inputName]: { value: newInputValue, isValid: newInputValueIsValid } })
	}

	const handleAddMealFoodClicked = () => {
		setCurrentScreen(EditMealModalScreen.SELECT_MEAL_FOOD)
	}

	const handleMealFoodQuantityChange = (mealFoodId: number, newQuantity: number) => {
		const newMealFoods = fields.mealFoods.value
		const indexOfMealFoodToUpdate = newMealFoods.findIndex((mealFood) => mealFood.id == mealFoodId)
		const mealFoodToUpdate = newMealFoods[indexOfMealFoodToUpdate]
		newMealFoods[indexOfMealFoodToUpdate] = new MealFood(
			mealFoodToUpdate.id,
			mealFoodToUpdate.baseFood,
			newQuantity
		)
		setFields({
			...fields,
			mealFoods: {
				value: newMealFoods,
				isValid: true,
			},
		})
	}

	const handleDeleteMealFoodClicked = () => {
		console.log("Delete meal food")
	}

	const handleSearchClicked = () => {
		console.log("Search clicked")
	}

	const handleSearchQueryChange = (newSearchQuery: string) => {
		setSearchQuery(newSearchQuery)
	}

	const handleCardClicked = (selectedFood: Food) => {
		setSelectedFood(selectedFood)
	}

	let modalTitle = ""
	let modalCloseMsg = "Close"
	let modalSaveMsg = "Save Changes"

	switch (currentScreenValue) {
		case EditMealModalScreen.EDIT_MEAL:
			modalTitle = meal == null ? "Add Meal" : "Edit Meal"
			break
		case EditMealModalScreen.SELECT_MEAL_FOOD:
			modalTitle = "Select Food"
			modalCloseMsg = "Cancel"
			modalSaveMsg = "Add"
			break
	}

	const aggregatedMacroNutrients = {
		calories: 0,
		fats: 0,
		carbs: 0,
		proteins: 0,
	}

	fields.mealFoods.value.forEach((mealFood) => {
		const mealFoodMacroNutrients = mealFood.macroNutrientsForDesiredQuantity
		aggregatedMacroNutrients.calories += mealFoodMacroNutrients.calories
		aggregatedMacroNutrients.fats += mealFoodMacroNutrients.fats
		aggregatedMacroNutrients.carbs += mealFoodMacroNutrients.carbs
		aggregatedMacroNutrients.proteins += mealFoodMacroNutrients.proteins
	})

	return (
		<EditEntityModal
			show={modal.visible}
			title={modalTitle}
			closeMsg={modalCloseMsg}
			saveMsg={modalSaveMsg}
			onClose={handleClose}
			onExited={handleExited}
			onSaveClicked={handleSaveClicked}>
			{currentScreenValue == EditMealModalScreen.EDIT_MEAL && (
				<>
					<Row className="mb-4">
						<Col>
							<FormTextInput
								id="0"
								name="title"
								label="Title"
								placeholder="Enter title..."
								value={fields.title.value}
								onChange={handleFormInputChange}
								required
								error="Title must not be empty."
								validationWasAttempted={validationWasAttempted}
							/>
						</Col>
					</Row>

					<Row className="mb-4">
						<p className="fw-bold">{`Macros: ${getMacroNutrientsString(
							aggregatedMacroNutrients.calories,
							aggregatedMacroNutrients.fats,
							aggregatedMacroNutrients.carbs,
							aggregatedMacroNutrients.proteins
						)}`}</p>
					</Row>

					<Row>
						<Col className="d-flex align-items-center justify-content-start">
							<p>Foods</p>
						</Col>
						<Col className="d-flex align-items-center justify-content-end">
							<Button onClick={handleAddMealFoodClicked}>
								<i className="bi bi-plus-lg"></i>
							</Button>
						</Col>
					</Row>

					<div style={{ height: "25vh" }} className="my-2 overflow-auto">
						{fields.mealFoods.value.map((mealFood) => (
							<MealFoodCard
								key={mealFood.id}
								mealFood={mealFood}
								onQuantityChange={handleMealFoodQuantityChange}
								onDeleteMealFoodClicked={handleDeleteMealFoodClicked}
							/>
						))}
					</div>
				</>
			)}
			{currentScreenValue == EditMealModalScreen.SELECT_MEAL_FOOD && (
				<>
					<SearchHeader
						searchQuery={searchQuery}
						onSearchClicked={handleSearchClicked}
						onSearchQueryChange={handleSearchQueryChange}
					/>
					<div style={{ height: "25vh" }} className="my-2 overflow-auto">
						{[testFood1, testFood2, testFood3].map((food) => (
							<Card
								key={food.id}
								className={`${
									food.id == selectedFood?.id ? "bg-primary" : ""
								} my-2 user-select-none list-item-margin-fix card-bg-transition`}
								style={{ cursor: "pointer" }}
								onClick={() => handleCardClicked(food)}
								onBlur={() => console.log(`Card #${food.id} is blurred`)}>
								<Card.Body>{food.title}</Card.Body>
							</Card>
						))}
					</div>
				</>
			)}
			{currentScreenValue == EditMealModalScreen.LOADING && <Spinner />}
			{currentScreenValue == EditMealModalScreen.ERROR && (
				<Row>
					<Col>
						<ErrorDisplay error={error} />
					</Col>
					<Col>
						<Button onClick={() => saveMeal()}>Retry</Button>
					</Col>
				</Row>
			)}
		</EditEntityModal>
	)
})

export default EditMealModal
