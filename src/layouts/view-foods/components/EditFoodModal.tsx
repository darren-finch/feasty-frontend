import { useAuth0 } from "@auth0/auth0-react"
import NiceModal, { NiceModalHocProps, useModal } from "@ebay/nice-modal-react"
import { useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { POSITIVE_FLOAT_PATTERN, POSITIVE_INT_PATTERN } from "../../../constants"
import { Food } from "../../../data/food/Food"
import { measurementUnits } from "../../../data/food/MeasurementUnits"
import { foodRepository } from "../../../global/Dependencies"
import { FormSelectInput, FormSelectOption } from "../../re-useable/forms/FormSelectInput"
import FormTextInput from "../../re-useable/forms/FormTextInput"
import ErrorDisplay from "../../re-useable/misc/ErrorDisplay"
import EditEntityModal from "../../re-useable/modals/EditEntityModal"

const EditFoodModal = NiceModal.create<NiceModalHocProps>(() => {
	const modal = useModal("edit-food-modal")
	const food: Food = modal.args?.food as Food

	const { getAccessTokenSilently } = useAuth0()

	const [validationWasAttempted, setValidationWasAttempted] = useState(false)
	const [error, setError] = useState<string | null>("")
	const [fields, setFields] = useState({
		title: {
			value: food?.title ?? "",
			isValid: food != null,
		},
		quantity: {
			value: food?.quantity.toString() ?? "",
			isValid: food != null,
		},
		unit: {
			value: food?.unit ?? measurementUnits[0],
			isValid: true, // unlike the other fields, the unit field defaults to being valid
		},
		calories: {
			value: food?.calories.toString() ?? "",
			isValid: food != null,
		},
		carbs: {
			value: food?.carbs.toString() ?? "",
			isValid: food != null,
		},
		fats: {
			value: food?.fats.toString() ?? "",
			isValid: food != null,
		},
		proteins: {
			value: food?.proteins.toString() ?? "",
			isValid: food != null,
		},
	})

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

	const saveFood = async () => {
		let foodToSave = new Food(
			food?.id ?? -1,
			food?.userId ?? -1,
			fields.title.value,
			Number.parseFloat(fields.quantity.value),
			fields.unit.value,
			Number.parseInt(fields.calories.value),
			Number.parseInt(fields.fats.value),
			Number.parseInt(fields.carbs.value),
			Number.parseInt(fields.proteins.value)
		)

		try {
			const accessToken = await getAccessTokenSilently()
			const response = await foodRepository.saveFood(foodToSave, accessToken)

			if (response.error) {
				throw response.error
			} else {
				modal.resolve()
				modal.hide()
			}
		} catch (err: any) {
			setError(err)
		}
	}

	const handleFormInputChange = (inputName: string, newInputValue: string, newInputValueIsValid: boolean) => {
		setFields({ ...fields, [inputName]: { value: newInputValue, isValid: newInputValueIsValid } })
	}

	const handleClose = () => {
		modal.hide()
	}

	const handleExited = () => {
		setError(null)
		modal.remove()
	}

	const handleSave = () => {
		try {
			if (formIsValid()) {
				saveFood()
			}
			setValidationWasAttempted(true)
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<EditEntityModal
			show={modal.visible}
			title={food == null ? "Add Food" : "Edit Food"}
			onExited={handleExited}
			onClose={handleClose}
			onSaveClicked={handleSave}>
			{!error && (
				<Form id="foodForm" noValidate onSubmit={(e) => e.preventDefault()}>
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
						<Col>
							<FormTextInput
								id="1"
								name="quantity"
								label="Quantity"
								placeholder="Enter quantity..."
								value={fields.quantity.value}
								onChange={handleFormInputChange}
								customValidityCheck={(inputValue) => {
									try {
										return Number.parseFloat(inputValue) > 0
									} catch {
										return false
									}
								}}
								pattern={POSITIVE_FLOAT_PATTERN}
								required
								error="Quantity must be a number greater than 0 with no more than two digits after the decimal."
								validationWasAttempted={validationWasAttempted}
							/>
						</Col>
						<Col>
							<FormSelectInput
								id="2"
								name="unit"
								label="Unit"
								value={fields.unit.value}
								onChange={handleFormInputChange}
								validationWasAttempted={validationWasAttempted}
								options={measurementUnits.map(
									(measurementUnit) =>
										new FormSelectOption(measurementUnit, measurementUnit, measurementUnit)
								)}
							/>
						</Col>
					</Row>

					<Row className="row-cols-2 row-col-lg-4 gy-4">
						<Col>
							<FormTextInput
								id="3"
								name="calories"
								label="Calories"
								placeholder="Enter calories..."
								value={fields.calories.value}
								onChange={handleFormInputChange}
								pattern={POSITIVE_INT_PATTERN}
								required
								error="Calories must be a non-negative integer."
								validationWasAttempted={validationWasAttempted}
							/>
						</Col>
						<Col>
							<FormTextInput
								id="4"
								name="carbs"
								label="Carbohydrates"
								placeholder="Enter carbohydrates..."
								value={fields.carbs.value}
								onChange={handleFormInputChange}
								pattern={POSITIVE_INT_PATTERN}
								required
								error="Carbohydrates must be a non-negative integer."
								validationWasAttempted={validationWasAttempted}
							/>
						</Col>
						<Col>
							<FormTextInput
								id="5"
								name="fats"
								label="Fats"
								placeholder="Enter fats..."
								value={fields.fats.value}
								onChange={handleFormInputChange}
								pattern={POSITIVE_INT_PATTERN}
								required
								error="Fats must be a non-negative integer."
								validationWasAttempted={validationWasAttempted}
							/>
						</Col>
						<Col>
							<FormTextInput
								id="6"
								name="proteins"
								label="Proteins"
								placeholder="Enter proteins..."
								value={fields.proteins.value}
								onChange={handleFormInputChange}
								pattern={POSITIVE_INT_PATTERN}
								required
								error="Proteins must be a non-negative integer."
								validationWasAttempted={validationWasAttempted}
							/>
						</Col>
					</Row>
				</Form>
			)}
			{error && (
				<Row>
					<Col>
						<ErrorDisplay error={error} />
					</Col>
					<Col>
						<Button onClick={() => saveFood()}>Retry</Button>
					</Col>
				</Row>
			)}
		</EditEntityModal>
	)
})

export default EditFoodModal
