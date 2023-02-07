import { useAuth0 } from "@auth0/auth0-react"
import NiceModal, { useModal } from "@ebay/nice-modal-react"
import { useEffect, useState } from "react"
import { Button, Card, Col, Row, Spinner } from "react-bootstrap"
import { Food } from "../../../data/food/Food"
import { Meal } from "../../../data/meal/Meal"
import { MealFood, MealFoodCombinedId } from "../../../data/meal/MealFood"
import { foodRepository, mealRepository } from "../../../global/Dependencies"
import { getMacroNutrientsString } from "../../../services/GetMacroNutrientsString"
import FormTextInput from "../../re-useable/forms/FormTextInput"
import NoResultsDisplay from "../../re-useable/misc/NoResultsDisplay"
import SearchHeader from "../../re-useable/misc/SearchHeader"
import EditEntityModal from "../../re-useable/modals/EditEntityModal"
import MealFoodCard from "./MealFoodCard"

enum EditMealModalScreen {
	EDIT_MEAL,
	LOADING,
	SELECT_MEAL_FOOD,
}

const EditMealModal = NiceModal.create(() => {
	const { getAccessTokenSilently } = useAuth0()

	const modal = useModal("edit-meal-modal")
	const meal: Meal = modal.args?.meal as Meal

	const [currentScreenValue, setCurrentScreenValue] = useState(EditMealModalScreen.EDIT_MEAL)
	const [validationWasAttempted, setValidationWasAttempted] = useState(false)
	const [footerError, setFooterError] = useState<string | null>("")
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

	const [foodsList, setFoodsList] = useState<Food[]>([])
	const [isLoadingFoodsList, setIsLoadingFoodsList] = useState(true)
	const [selectedFood, setSelectedFood] = useState<Food | null>(null)
	const [searchQuery, setSearchQuery] = useState("")

	useEffect(() => {
		fetchFoods()
	}, [])

	const fetchFoods = async () => {
		setIsLoadingFoodsList(true)
		try {
			const accessToken = await getAccessTokenSilently()
			const response = await foodRepository.fetchFoodsByTitle(searchQuery, accessToken)

			if (response.error) {
				throw response.error
			} else {
				setIsLoadingFoodsList(false)
				setFoodsList(response.value)
				setFooterError(null)
			}
		} catch (err: any) {
			setFooterError(err)
			setIsLoadingFoodsList(false)
		}
	}

	const setCurrentScreen = (nextScreen: EditMealModalScreen) => {
		if (nextScreen == EditMealModalScreen.SELECT_MEAL_FOOD) {
			fetchFoods()
		}

		setFooterError(null)

		// We delay setting the next screen so we can display a spinner for a short time
		setCurrentScreenValue(EditMealModalScreen.LOADING)
		const screenTransitionTimeMs = Math.random() * 200
		setTimeout(() => {
			setCurrentScreenValue(nextScreen)
		}, screenTransitionTimeMs)
	}

	const saveMeal = async () => {
		const newMeal = new Meal(meal?.id ?? -1, fields.title.value, fields.mealFoods.value)

		try {
			const accessToken = await getAccessTokenSilently()
			const response = await mealRepository.saveMeal(newMeal, accessToken)

			if (response.error) {
				throw response.error
			} else {
				modal.resolve()
				modal.hide()
			}
		} catch (err: any) {
			setFooterError(err)
		}
	}

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
				if (formIsValid()) {
					setFooterError(null)
					saveMeal()
				}
				// TODO: Figure out better way to get this error message
				if (fields.mealFoods.value.length < 1) {
					setFooterError("Must have more than one food.")
				}
				setValidationWasAttempted(true)
				break
			case EditMealModalScreen.SELECT_MEAL_FOOD:
				if (selectedFood != null) {
					const foodAlreadyExistsInMealFoods = fields.mealFoods.value.some(
						(mealFood) => mealFood.combinedId.foodId == selectedFood.id
					)
					if (!foodAlreadyExistsInMealFoods) {
						addFoodToMeal(selectedFood)
						setSelectedFood(null)
						setSearchQuery("")
						setCurrentScreen(EditMealModalScreen.EDIT_MEAL)
					} else {
						setFooterError("Cannot add more than one of each food type.")
					}
				}
		}
	}

	function addFoodToMeal(selectedFood: Food) {
		setFields({
			...fields,
			mealFoods: {
				value: [
					...fields.mealFoods.value,
					new MealFood(
						new MealFoodCombinedId(meal?.id ?? -1, selectedFood.id),
						selectedFood,
						selectedFood.quantity
					),
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
		setFooterError(null)
		modal.remove()
	}

	const handleFormInputChange = (inputName: string, newInputValue: string, newInputValueIsValid: boolean) => {
		setFields({ ...fields, [inputName]: { value: newInputValue, isValid: newInputValueIsValid } })
	}

	const handleAddMealFoodClicked = () => {
		setCurrentScreen(EditMealModalScreen.SELECT_MEAL_FOOD)
	}

	const handleMealFoodQuantityChange = (mealFoodId: MealFoodCombinedId, newQuantity: number) => {
		const newMealFoods = fields.mealFoods.value
		const indexOfMealFoodToUpdate = newMealFoods.findIndex((mealFood) => mealFood.combinedId == mealFoodId)
		const mealFoodToUpdate = newMealFoods[indexOfMealFoodToUpdate]
		newMealFoods[indexOfMealFoodToUpdate] = new MealFood(
			mealFoodToUpdate.combinedId,
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

	const handleDeleteMealFoodClicked = (selectedMealFoodId: MealFoodCombinedId) => {
		const newMealFoods = fields.mealFoods.value.filter((mealFood) => mealFood.combinedId != selectedMealFoodId)
		setFields({
			...fields,
			mealFoods: {
				isValid: newMealFoods.length > 0,
				value: newMealFoods,
			},
		})
	}

	const handleSearchClicked = () => {
		fetchFoods()
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
			footerErrorMsg={footerError}
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

					{fields.mealFoods.value.length > 0 && (
						<div style={{ height: "25vh" }} className="my-2 overflow-auto">
							{fields.mealFoods.value.map((mealFood) => (
								<MealFoodCard
									key={mealFood.combinedId.toString()}
									mealFood={mealFood}
									allowQuantityChange={true}
									onQuantityChange={handleMealFoodQuantityChange}
									onDeleteMealFoodClicked={handleDeleteMealFoodClicked}
								/>
							))}
						</div>
					)}

					{fields.mealFoods.value.length < 1 && <NoResultsDisplay />}
				</>
			)}
			{currentScreenValue == EditMealModalScreen.SELECT_MEAL_FOOD && (
				<>
					<SearchHeader
						searchQuery={searchQuery}
						onSearchClicked={handleSearchClicked}
						onSearchQueryChange={handleSearchQueryChange}
					/>
					{!isLoadingFoodsList && (
						<div style={{ height: "25vh" }} className="my-2 overflow-auto">
							{foodsList.map((food) => (
								<Card
									key={food.id}
									className={`${
										food.id == selectedFood?.id ? "bg-primary" : ""
									} my-2 user-select-none list-item-margin-fix card-bg-transition`}
									style={{ cursor: "pointer" }}
									onClick={() => handleCardClicked(food)}
									onBlur={() => {}}>
									<Card.Body>{food.title}</Card.Body>
								</Card>
							))}
						</div>
					)}
					{isLoadingFoodsList && <Spinner />}
				</>
			)}
			{currentScreenValue == EditMealModalScreen.LOADING && <Spinner />}
		</EditEntityModal>
	)
})

export default EditMealModal
