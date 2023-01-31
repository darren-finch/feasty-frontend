import React, { useEffect, useState } from "react"
import { Accordion, Button, Col, Form, Row, Spinner } from "react-bootstrap"
import { Food } from "../../data/food/Food"
import FoodCard from "../view-foods/components/FoodCard"
import ErrorDisplay from "./misc/ErrorDisplay"
import NoResultsDisplay from "./misc/NoResultsDisplay"

interface SearchableFoodsListProps {
	foodsList: Food[]
	searchQuery: string
	isLoading: boolean
	error: string | null
	onSearchQueryChange: (newSearchQuery: string) => void
	onSearchClicked: () => void
	onEditFoodClicked: (selectedFood: Food) => void
	onDeleteFoodClicked: (selectedFoodId: number) => void
}

const SearchableFoodsList: React.FC<SearchableFoodsListProps> = (props) => {
	const {
		foodsList,
		searchQuery,
		error,
		isLoading,
		onSearchQueryChange,
		onSearchClicked,
		onEditFoodClicked,
		onDeleteFoodClicked,
	} = props

	const isError = error != null && error != ""

	return (
		<div>
			<Form>
				<Row>
					<Col className="col-12 col-lg-8 d-flex align-items-center">
						<p className="h5">Search</p>
					</Col>
					<Col className="col col-lg-4 gap-4 d-flex align-items-center">
						<Form.Control
							style={{ minWidth: "150px" }}
							className="flex-shrink-1"
							type="text"
							name="searchTextInput"
							id="searchTextInput"
							placeholder="Enter food name..."
							value={searchQuery}
							onChange={(e) => onSearchQueryChange(e.target.value)}
							onKeyDown={(e) => {
								if (e.key == "Enter") {
									e.preventDefault()
									onSearchClicked()
								}
							}}
						/>
						<Button variant="outline-primary" onClick={onSearchClicked}>
							<i className="bi bi-search"></i>
						</Button>
					</Col>
				</Row>
			</Form>
			<Accordion>
				{isLoading && <Spinner className="my-2" />}
				{isError && (
					<div className="my-2">
						<ErrorDisplay error={error} />
					</div>
				)}
				{!isLoading && !isError && foodsList.length < 1 && (
					<div className="my-2">
						<NoResultsDisplay />
					</div>
				)}
				{!isLoading &&
					!isError &&
					foodsList.length > 0 &&
					foodsList.map((food) => {
						return (
							<FoodCard
								key={food.id}
								food={food}
								onEditFoodClicked={onEditFoodClicked}
								onDeleteFoodClicked={onDeleteFoodClicked}
							/>
						)
					})}
			</Accordion>
		</div>
	)
}

export default SearchableFoodsList
