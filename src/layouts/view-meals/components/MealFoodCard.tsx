import React, { useState } from "react"
import { Button, Card, Col, Row } from "react-bootstrap"
import { POSITIVE_FLOAT_PATTERN } from "../../../constants"
import { MealFood } from "../../../data/meal/MealFood"
import { getMacroNutrientsString } from "../../../services/GetMacroNutrientsString"
import FormTextInput from "../../re-useable/forms/FormTextInput"

interface MealFoodCardProps {
	mealFood: MealFood
	// Will only fire when the input changes to a valid number
	onQuantityChange: (mealFoodId: number, newQuantity: number) => void
	onDeleteMealFoodClicked: (selectedMealFoodId: number) => void
}

const MealFoodCard: React.FC<MealFoodCardProps> = (props) => {
	const { mealFood, onQuantityChange, onDeleteMealFoodClicked } = props
	const [desiredQuantity, setDesiredQuantity] = useState(mealFood.desiredQuantity.toString())

	const mealFoodMacroNutrients = mealFood.macroNutrientsForDesiredQuantity

	const handleQuantityChange = (inputName: string, newInputValue: string, newInputValueIsValid: boolean) => {
		setDesiredQuantity(newInputValue)

		if (newInputValueIsValid) {
			onQuantityChange(mealFood.id, Number.parseFloat(newInputValue))
		}
	}

	return (
		<Card className="my-2 list-item-margin-fix">
			<Card.Header>
				<div className="d-flex gap-4 align-items-center justify-content-between">
					<div>
						<p>{mealFood.baseFood.title}</p>
						<p className="d-none d-lg-block">
							{`Macros - 
					${getMacroNutrientsString(
						mealFoodMacroNutrients.calories,
						mealFoodMacroNutrients.fats,
						mealFoodMacroNutrients.carbs,
						mealFoodMacroNutrients.proteins
					)}`}
						</p>
					</div>
					<div className="d-flex align-items-center gap-2">
						<FormTextInput
							id="0"
							placeholder="Enter desired quantity..."
							maxInputWidth="100px"
							name="desiredQuantity"
							value={desiredQuantity}
							onChange={handleQuantityChange}
							customValidityCheck={(inputValue) => {
								try {
									return Number.parseFloat(inputValue) > 0
								} catch {
									return false
								}
							}}
							pattern={POSITIVE_FLOAT_PATTERN}
							required
							error="Invalid quantity."
							validationWasAttempted={true}
						/>
						<p>{mealFood.baseFood.unit}</p>
						<Button variant="outline-primary" onClick={() => onDeleteMealFoodClicked(mealFood.id)}>
							<i className="bi bi-trash"></i>
						</Button>
					</div>
				</div>
			</Card.Header>
			<Card.Body className="d-lg-none">
				<p>
					{`Macros - 
					${getMacroNutrientsString(
						mealFoodMacroNutrients.calories,
						mealFoodMacroNutrients.fats,
						mealFoodMacroNutrients.carbs,
						mealFoodMacroNutrients.proteins
					)}`}
				</p>
			</Card.Body>
		</Card>
	)
}

export default MealFoodCard
