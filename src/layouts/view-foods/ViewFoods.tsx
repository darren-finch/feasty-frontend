import { useAuth0 } from "@auth0/auth0-react"
import NiceModal from "@ebay/nice-modal-react"
import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { Food } from "../../data/food/Food"
import { foodRepository } from "../../global/Dependencies"
import { getMacroNutrientsString } from "../../services/GetMacroNutrientsString"
import SearchableAccordionList from "../re-useable/lists/SearchableAccordionList"
import SearchableAccordionListElement from "../re-useable/lists/SearchableAccordionListElement"

const ViewFoods: React.FC = () => {
	const { getAccessTokenSilently } = useAuth0()
	const [foodsList, setFoodsList] = useState<Food[]>([])
	const [isFoodsListLoading, setIsFoodsListLoading] = useState(true)
	const [getFoodsListError, setGetFoodsListError] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState("")

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
		NiceModal.show("edit-food-modal").then(() => {
			handleEditFoodModalSuccessfulSave()
		})
	}
	const handleSearchQueryChange = (newSearchQuery: string) => {
		setSearchQuery(newSearchQuery)
	}
	const handleSearchClicked = () => {
		fetchFoods()
	}
	const handleEditFoodClicked = (selectedFood: Food) => {
		NiceModal.show("edit-food-modal", { food: selectedFood }).then(handleEditFoodModalSuccessfulSave)
	}
	const handleDeleteFoodClicked = async (selectedFoodId: number) => {
		setIsFoodsListLoading(true)
		const accessToken = await getAccessTokenSilently()
		await foodRepository.deleteFood(selectedFoodId, accessToken)
		fetchFoods()
	}
	const handleEditFoodModalSuccessfulSave = () => {
		fetchFoods()
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
										<p>{`Macros: ${macroNutrientsString}`}</p>
									</div>
								</>
							}
							bodyElements={<p>{`Macros: ${macroNutrientsString}`}</p>}
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
		</Container>
	)
}

export default ViewFoods
