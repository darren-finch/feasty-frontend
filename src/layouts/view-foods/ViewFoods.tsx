import { useAuth0 } from "@auth0/auth0-react"
import NiceModal from "@ebay/nice-modal-react"
import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { foodRepository } from "../../App"
import { Food } from "../../data/food/Food"
import { getMacroNutrientsString } from "../../services/GetMacroNutrientsString"
import AccordionList from "../re-useable/lists/AccordionList"
import AccordionListElement from "../re-useable/lists/AccordionListElement"
import SearchHeader from "../re-useable/misc/SearchHeader"

const ViewFoods: React.FC = () => {
	const { getAccessTokenSilently } = useAuth0()
	const [foodsList, setFoodsList] = useState<Food[]>([])
	const [isFoodsListLoading, setIsFoodsListLoading] = useState(true)
	const [fetchFoodsListError, setFetchFoodsListError] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState("")

	const fetchFoods = async () => {
		setIsFoodsListLoading(true)

		try {
			const response = await foodRepository.fetchFoodsByTitle(searchQuery)

			if (response.error) {
				throw response.error
			} else {
				setIsFoodsListLoading(false)
				setFetchFoodsListError(null)
				setFoodsList(response.value)
			}
		} catch (err: any) {
			setIsFoodsListLoading(false)
			setFetchFoodsListError(err)
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
	const handleDeleteFoodClicked = (selectedFoodId: number) => {
		NiceModal.show("confirmation-modal", {
			mainMsg: "This will remove this food from all meals that reference it.",
		}).then(
			async () => {
				await foodRepository.deleteFood(selectedFoodId)
				fetchFoods()
			},
			() => {}
		)
	}
	const handleEditFoodModalSuccessfulSave = () => {
		fetchFoods()
	}

	return (
		<Container className="d-flex flex-column h-100 overflow-auto">
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
			<SearchHeader
				searchQuery={searchQuery}
				onSearchQueryChange={handleSearchQueryChange}
				onSearchClicked={handleSearchClicked}
			/>
			<div className="mb-4 overflow-auto">
				<AccordionList
					elementList={foodsList.map((food) => {
						const macroNutrientsString = getMacroNutrientsString(
							food.calories,
							food.fats,
							food.carbs,
							food.proteins
						)
						return (
							<AccordionListElement
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
					error={fetchFoodsListError}
				/>
			</div>
		</Container>
	)
}

export default ViewFoods
