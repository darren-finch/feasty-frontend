import { useAuth0 } from "@auth0/auth0-react"
import { useState, useEffect } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { Food } from "../../data/food/Food"
import { getMacroNutrientsString } from "../../services/GetMacroNutrientsString"
import { foodRepository } from "../../global/Dependencies"
import EditFoodModal from "./components/EditFoodModal"
import SearchableAccordionList from "../re-useable/lists/SearchableAccordionList"
import SearchableAccordionListElement from "../re-useable/lists/SearchableAccordionListElement"

/*
Data for this screen:
- initial foods list from db (not state)
- whether we had an error when trying to load the initial foods list
- foods list that the front-end modifies to match the database operations
and filters based on the search text
- search text
- whether the edit food modal is visible
- what the currently selected food is
- all the form fields for the edit food modal
- whether there was an error when trying to save a food
*/
const ViewFoods: React.FC = () => {
	const { getAccessTokenSilently } = useAuth0()
	const [foodsList, setFoodsList] = useState<Food[]>([])
	const [isFoodsListLoading, setIsFoodsListLoading] = useState(true)
	const [getFoodsListError, setGetFoodsListError] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState("")
	const [showEditFoodModal, setShowEditFoodModal] = useState(false)
	const [currentlySelectedFood, setSelectedFood] = useState<Food | null>(null)

	const fetchFoods = async () => {
		setIsFoodsListLoading(true)

		try {
			const accessToken = await getAccessTokenSilently()
			const response = await foodRepository.fetchFoodsByTitle(searchQuery, accessToken)

			if (response.error) {
				throw response.error
			} else {
				setIsFoodsListLoading(false)
				setGetFoodsListError(null)
				setFoodsList(response.value)
			}
		} catch (err: any) {
			setIsFoodsListLoading(false)
			setGetFoodsListError(err)
		}
	}

	useEffect(() => {
		fetchFoods()
	}, [])

	const handleAddFoodClicked = () => {
		setSelectedFood(null)
		setShowEditFoodModal(true)
	}
	const handleSearchQueryChange = (newSearchQuery: string) => {
		setSearchQuery(newSearchQuery)
	}
	const handleSearchClicked = () => {
		fetchFoods()
	}
	const handleEditFoodClicked = (selectedFood: Food) => {
		setSelectedFood(selectedFood)
		setShowEditFoodModal(true)
	}
	const handleDeleteFoodClicked = async (selectedFoodId: number) => {
		setIsFoodsListLoading(true)
		const accessToken = await getAccessTokenSilently()
		await foodRepository.deleteFood(selectedFoodId, accessToken)
		fetchFoods()
	}
	const handleEditFoodModalClose = () => setShowEditFoodModal(false)
	const handleEditFoodModalSuccessfulSave = () => {
		fetchFoods()
		setShowEditFoodModal(false)
	}

	return (
		<Container>
			<Row className="my-4">
				<Col className="d-flex align-items-center justify-content-start">
					<h1>Foods</h1>
				</Col>
				<Col className="d-flex align-items-center justify-content-end">
					<Button onClick={handleAddFoodClicked}>
						<i className="bi bi-plus-lg"></i>
					</Button>
				</Col>
			</Row>
			<SearchableAccordionList
				elementList={foodsList.map((food) => {
					const macroNutrientsString = getMacroNutrientsString(
						food.calories,
						food.fats,
						food.carbs,
						food.proteins
					)
					return (
						<SearchableAccordionListElement
							key={food.id}
							headerElements={
								<>
									<div className="d-lg-none fw-bold">
										<p>{`${food.title}`}</p>
										<p>{`${food.quantity} ${food.unit}`}</p>
									</div>
									<div className="d-none d-lg-block">
										<p className="mb-0 fw-bold">{`${food.title} | ${food.quantity} ${food.unit}`}</p>
										<p>{macroNutrientsString}</p>
									</div>
								</>
							}
							bodyElements={macroNutrientsString}
							entityId={food.id}
							entity={food}
							showDropdownAtLargeScreenSize={false}
							onEditEntityClicked={handleEditFoodClicked}
							onDeleteEntityClicked={handleDeleteFoodClicked}
						/>
					)
				})}
				isLoading={isFoodsListLoading}
				error={getFoodsListError}
				searchQuery={searchQuery}
				onSearchQueryChange={handleSearchQueryChange}
				onSearchClicked={handleSearchClicked}
			/>
			{/* We need the key prop below in order to re-mount the modal if the selected food changes.
			Otherwise, the initial state of the modal will not change when we update the currently selected food, 
			so the previously selected food will show in the modal instead of the newly selected one. */}
			<EditFoodModal
				key={currentlySelectedFood?.id}
				food={currentlySelectedFood}
				show={showEditFoodModal}
				onCloseClicked={handleEditFoodModalClose}
				onSuccessfulSave={handleEditFoodModalSuccessfulSave}
			/>
		</Container>
	)
}

export default ViewFoods
