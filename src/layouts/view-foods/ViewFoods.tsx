import React, { useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { Food } from "../../models/Food"
import EditFoodModal from "../modals/EditFoodModal"
import SearchableFoodsList from "../re-useable/SearchableFoodsList"

const ViewFoods: React.FC = () => {
	const [showEditFoodModal, setShowEditFoodModal] = useState(false)
	const [currentlySelectedFood, setSelectedFood] = useState<Food | null>(null)

	return (
		<Container>
			<Row className="my-4">
				<Col>
					<h1>Foods</h1>
				</Col>
				<Col className="d-flex align-items-center justify-content-end">
					<Button
						onClick={() => {
							setSelectedFood(null)
							setShowEditFoodModal(true)
						}}>
						<i className="bi bi-plus-lg"></i>
					</Button>
				</Col>
			</Row>
			<SearchableFoodsList
				onEditFoodClicked={(selectedFood) => {
					setSelectedFood(selectedFood)
					setShowEditFoodModal(true)
				}}
				onDeleteFoodClicked={(selectedFoodId) => console.log("Delete food #" + selectedFoodId)}
			/>
			{/* We need the key prop below in order to re-mount the modal if the selected food changes.
			Otherwise, the initial state of the modal will not change when we update the currently selected food, 
			so the previously selected food will show in the modal instead of the newly selected one. */}
			<EditFoodModal
				key={currentlySelectedFood?.id}
				food={currentlySelectedFood}
				show={showEditFoodModal}
				onClose={() => setShowEditFoodModal(false)}
				onSave={() => setShowEditFoodModal(false)}
			/>
		</Container>
	)
}

export default ViewFoods
