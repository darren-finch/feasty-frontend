import * as React from "react"
import { useEffect, useState } from "react"
import { Button, Col, Form, Modal, Row } from "react-bootstrap"
import { floatPattern } from "../../constants"
import { Food } from "../../models/Food"
import { measurementUnits } from "../../models/MeasurementUnits"

interface EditFoodModalProps {
	food: Food | null
	show: boolean
	onClose: () => void
	onSave: () => void
}

const EditFoodModal: React.FC<EditFoodModalProps> = (props) => {
	const { food, show, onClose, onSave } = props

	const [title, setTitle] = useState<string | undefined>(food?.title)

	// Because of the automatic rounding and inaccuracy with floats,
	// we will be forced to use a string to store quantity for now.
	const [quantity, setQuantity] = useState<string | undefined>(food?.quantity.toString())
	const [unit, setUnit] = useState<string>(food == null ? "" : food.unit)
	const [calories, setCalories] = useState<number | undefined>(food?.calories)
	const [carbs, setCarbs] = useState<number | undefined>(food?.carbs)
	const [fats, setFats] = useState<number | undefined>(food?.fats)
	const [proteins, setProteins] = useState<number | undefined>(food?.proteins)

	return (
		<Modal show={show} onHide={onClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>{food == null ? "Add Food" : "Edit Food"}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Form>
					<Form.Group className="mb-3" controlId="foodTitle">
						<Form.Label>Food title</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter food title..."
							value={title ?? ""}
							onChange={(event) => setTitle(event.target.value)}
						/>
					</Form.Group>

					<Form.Group className="mb-3" controlId="foodQuantity">
						<Form.Label>Quantity</Form.Label>
						<Row>
							<Col>
								<Form.Control
									type="text"
									placeholder="Enter quantity..."
									value={quantity ?? ""}
									onChange={(event) => {
										const newValue = event.target.value
										if (newValue == "") {
											setQuantity(undefined)
										} else if (floatPattern.test(newValue)) {
											setQuantity(newValue)
										}
									}}
								/>
							</Col>
							<Col>
								<Form.Select
									value={unit ?? measurementUnits[0]}
									onChange={(event) => setUnit(event.target.value)}>
									{measurementUnits.map((measurementUnit) => (
										<option key={measurementUnit} value={measurementUnit}>
											{measurementUnit}
										</option>
									))}
								</Form.Select>
							</Col>
						</Row>
					</Form.Group>

					<Form.Group className="mb-3" controlId="foodMacroNutrients">
						<Row className="row-cols-2 row-col-lg-4 gy-4">
							<Col>
								<Form.Label>Calories</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter calories..."
									value={calories?.toString() ?? ""}
									onChange={(event) => {
										const newValue = Number.parseInt(event.target.value)
										if (!Number.isNaN(newValue)) {
											setCalories(newValue)
										} else if (event.target.value == "") {
											setCalories(undefined)
										}
									}}
								/>
							</Col>
							<Col>
								<Form.Label>Carbohydrates</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter carbohydrates..."
									value={carbs?.toString() ?? ""}
									onChange={(event) => {
										const newValue = Number.parseInt(event.target.value)
										if (!Number.isNaN(newValue)) {
											setCarbs(newValue)
										} else if (event.target.value == "") {
											setCarbs(undefined)
										}
									}}
								/>
							</Col>
							<Col>
								<Form.Label>Fats</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter fats..."
									value={fats?.toString() ?? ""}
									onChange={(event) => {
										const newValue = Number.parseInt(event.target.value)
										if (!Number.isNaN(newValue)) {
											setFats(newValue)
										} else if (event.target.value == "") {
											setFats(undefined)
										}
									}}
								/>
							</Col>
							<Col>
								<Form.Label>Proteins</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter proteins..."
									value={proteins?.toString() ?? ""}
									onChange={(event) => {
										const newValue = Number.parseInt(event.target.value)
										if (!Number.isNaN(newValue)) {
											setProteins(newValue)
										} else if (event.target.value == "") {
											setProteins(undefined)
										}
									}}
								/>
							</Col>
						</Row>
					</Form.Group>
				</Form>
			</Modal.Body>

			<Modal.Footer>
				<Button variant="secondary" onClick={onClose}>
					Close
				</Button>
				<Button variant="primary" onClick={onSave}>
					Save changes
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default EditFoodModal
