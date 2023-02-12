import NiceModal, { useModal } from "@ebay/nice-modal-react"
import { useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { mealPlanRepository } from "../../../App"
import { MealPlanMetaData } from "../../../data/mealplan/MealPlanMetaData"
import { POSITIVE_INT_PATTERN } from "../../../global/constants"
import FormTextInput from "../../re-useable/forms/FormTextInput"
import ErrorDisplay from "../../re-useable/misc/ErrorDisplay"
import EditEntityModalTemplate from "../../re-useable/modals/EditEntityModalTemplate"

const EditMealPlanMetaDataModal = NiceModal.create(() => {
	const modal = useModal("edit-meal-plan-meta-data-modal")
	const mealPlanMetaData: MealPlanMetaData = modal.args?.mealPlanMetaData as MealPlanMetaData

	const [isSavingMealPlan, setIsSavingMealPlan] = useState(false)

	const [validationWasAttempted, setValidationWasAttempted] = useState(false)
	const [footerError, setFooterError] = useState<string | null>("")
	const [fields, setFields] = useState({
		title: {
			value: mealPlanMetaData?.title ?? "",
			isValid: mealPlanMetaData != null,
		},
		desiredCalories: {
			value: mealPlanMetaData?.requiredCalories.toString() ?? "",
			isValid: mealPlanMetaData != null,
		},
		desiredCarbs: {
			value: mealPlanMetaData?.requiredCarbs.toString() ?? "",
			isValid: mealPlanMetaData != null,
		},
		desiredFats: {
			value: mealPlanMetaData?.requiredFats.toString() ?? "",
			isValid: mealPlanMetaData != null,
		},
		desiredProteins: {
			value: mealPlanMetaData?.requiredProteins.toString() ?? "",
			isValid: mealPlanMetaData != null,
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

	const saveMealPlanMetaData = async () => {
		try {
			setIsSavingMealPlan(true)
			const mealPlanMetaDataToSave = new MealPlanMetaData(
				mealPlanMetaData?.id ?? -1,
				fields.title.value,
				Number.parseFloat(fields.desiredCalories.value),
				Number.parseFloat(fields.desiredFats.value),
				Number.parseFloat(fields.desiredCarbs.value),
				Number.parseFloat(fields.desiredProteins.value)
			)
			const response = await mealPlanRepository.saveMealPlanMetaData(mealPlanMetaDataToSave)

			if (response.error) {
				throw response.error
			} else {
				setIsSavingMealPlan(false)
				modal.resolve(response.value)
				modal.hide()
			}
		} catch (err: any) {
			setIsSavingMealPlan(false)
			setFooterError(err)
		}
	}

	const handleFormInputChange = (inputName: string, newInputValue: string, newInputValueIsValid: boolean) => {
		setFields({ ...fields, [inputName]: { value: newInputValue, isValid: newInputValueIsValid } })
	}

	const handleClose = () => {
		modal.hide()
	}

	const handleExited = () => {
		setFooterError(null)
		modal.remove()
	}

	const handleSave = () => {
		try {
			if (formIsValid()) {
				saveMealPlanMetaData()
			}
			setValidationWasAttempted(true)
		} catch (err: any) {
			setFooterError(err)
		}
	}

	return (
		<EditEntityModalTemplate
			show={modal.visible}
			title={mealPlanMetaData == null ? "Add Meal Plan" : "Edit Meal Plan"}
			isLoading={isSavingMealPlan}
			footerError={footerError}
			onExited={handleExited}
			onClose={handleClose}
			onSaveClicked={handleSave}>
			{!footerError && (
				<Form id="mealPlanForm" noValidate onSubmit={(e) => e.preventDefault()}>
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

					<Row className="row-cols-2 row-col-lg-4 gy-4">
						<Col>
							<FormTextInput
								id="3"
								name="desiredCalories"
								label="Desired Calories"
								placeholder="Enter desired calories..."
								value={fields.desiredCalories.value}
								onChange={handleFormInputChange}
								pattern={POSITIVE_INT_PATTERN}
								required
								error="Desired calories must be a non-negative integer."
								validationWasAttempted={validationWasAttempted}
							/>
						</Col>
						<Col>
							<FormTextInput
								id="4"
								name="desiredCarbs"
								label="Desired Carbs"
								placeholder="Enter desired carbs..."
								value={fields.desiredCarbs.value}
								onChange={handleFormInputChange}
								pattern={POSITIVE_INT_PATTERN}
								required
								error="Desired Carbs must be a non-negative integer."
								validationWasAttempted={validationWasAttempted}
							/>
						</Col>
						<Col>
							<FormTextInput
								id="5"
								name="desiredFats"
								label="Desired Fats"
								placeholder="Enter desired fats..."
								value={fields.desiredFats.value}
								onChange={handleFormInputChange}
								pattern={POSITIVE_INT_PATTERN}
								required
								error="Desired fats must be a non-negative integer."
								validationWasAttempted={validationWasAttempted}
							/>
						</Col>
						<Col>
							<FormTextInput
								id="6"
								name="desiredProteins"
								label="Desired Proteins"
								placeholder="Enter desired proteins..."
								value={fields.desiredProteins.value}
								onChange={handleFormInputChange}
								pattern={POSITIVE_INT_PATTERN}
								required
								error="Desired proteins must be a non-negative integer."
								validationWasAttempted={validationWasAttempted}
							/>
						</Col>
					</Row>
				</Form>
			)}
			{footerError && (
				<Row>
					<Col>
						<ErrorDisplay error={footerError} />
					</Col>
					<Col>
						<Button onClick={() => saveMealPlanMetaData()}>Retry</Button>
					</Col>
				</Row>
			)}
		</EditEntityModalTemplate>
	)
})

export default EditMealPlanMetaDataModal
