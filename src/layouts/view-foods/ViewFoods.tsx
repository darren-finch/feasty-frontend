import { useAuth0 } from "@auth0/auth0-react"
import { useState, useEffect } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { Food } from "../../data/food/Food"
import { foodRepository } from "../../global/Dependencies"
import EditFoodModal from "../modals/edit-food/EditFoodModal"
import SearchableFoodsList from "../re-useable/SearchableFoodsList"

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
				foodsList={foodsList}
				searchQuery={searchQuery}
				isLoading={isFoodsListLoading}
				error={getFoodsListError}
				onSearchQueryChange={handleSearchQueryChange}
				onSearchClicked={handleSearchClicked}
				onEditFoodClicked={handleEditFoodClicked}
				onDeleteFoodClicked={handleDeleteFoodClicked}
			/>
			{/* We need the key prop below in order to re-mount the modal if the selected food changes.
			Otherwise, the initial state of the modal will not change when we update the currently selected food, 
			so the previously selected food will show in the modal instead of the newly selected one. */}
			<EditFoodModal
				key={currentlySelectedFood?.id}
				food={currentlySelectedFood}
				show={showEditFoodModal}
				onClose={handleEditFoodModalClose}
				onSuccessfulSave={handleEditFoodModalSuccessfulSave}
			/>
		</Container>
	)
}

export default ViewFoods
