import { useAuth0 } from "@auth0/auth0-react"
import NiceModal from "@ebay/nice-modal-react"
import { useEffect, useRef, useState } from "react"
import { Button, Col, Container, Dropdown, ProgressBar, Row, Spinner } from "react-bootstrap"
import DropdownMenu from "react-bootstrap/esm/DropdownMenu"
import DropdownToggle from "react-bootstrap/esm/DropdownToggle"
import { mealPlanMealRepository, mealPlanRepository } from "../../App"
import { MealPlan } from "../../data/mealplan/MealPlan"
import { MealPlanMealCombinedId } from "../../data/mealplan/MealPlanMeal"
import { MealPlanMetaData, MealPlanMetaDataJSONSchema } from "../../data/mealplan/MealPlanMetaData"
import { getMacroNutrientsString } from "../../services/GetMacroNutrientsString"
import AccordionList from "../re-useable/lists/SearchableAccordionList"
import AccordionListElement from "../re-useable/lists/SearchableAccordionListElement"
import ErrorDisplay from "../re-useable/misc/ErrorDisplay"
import MealFoodCard from "../view-meals/components/MealFoodCard"

// Needs number between 0 and 1
const getVariantForProgress = (progress: number) => {
	if (progress <= 0.25) {
		return "danger"
	} else if (progress <= 0.75) {
		return "warning"
	} else {
		return "primary"
	}
}

// First time screen loads, I want meal plan meta data to be fetched and the selected meal plan id set from user preferences.
// If the selected meal plan still exists, it will be loaded first.
// Afterwards, meal plan meta data is only refreshed when a meal plan is added, edited, or deleted.
// And finally, only when the currently selected meal plan is deleted or a new meal plan is added will the currently selected meal plan change.
// The currently selected meal plan is refreshed from the database every time a new meal plan meal is added or deleted.
const ViewMealPlan: React.FC = () => {
	const { getAccessTokenSilently } = useAuth0()

	const [mealPlansMetaDataList, setMealPlansMetaDataList] = useState<MealPlanMetaDataJSONSchema[]>([])
	const [isLoadingMealPlansMetaDataList, setIsLoadingMealPlansMetaDataList] = useState(true)
	const [fetchMealPlansMetaDataListError, setFetchMealPlansMetaDataListError] = useState<string | null>(null)

	const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null)
	const [isLoadingSelectedMealPlan, setIsLoadingSelectedMealPlan] = useState(true)
	const [fetchSelectedMealPlanError, setFetchSelectedMealPlanError] = useState<string | null>(null)

	// This is a hack to allow the newly added meal plan to be loaded after the edit meal plan dialog closes.
	// We need to find a better solution than this.
	let tempSelectedMealIdOverride = useRef(-1)

	useEffect(() => {
		fetchMealPlansMetaDataList()
	}, [])

	useEffect(() => {
		if (mealPlansMetaDataList.length > 0) {
			try {
				let selectedMealPlanId = -1
				if (tempSelectedMealIdOverride.current > -1) {
					selectedMealPlanId = tempSelectedMealIdOverride.current
				} else {
					// Try reading in the selected meal plan id from local storage.
					selectedMealPlanId = Number.parseInt(localStorage.getItem("selectedMealPlanId") ?? "-1")
				}
				fetchSelectedMealPlanFromId(selectedMealPlanId)
			} catch (err: any) {
				setFetchSelectedMealPlanError(err)
			}
		}
	}, [mealPlansMetaDataList, tempSelectedMealIdOverride])

	const fetchMealPlansMetaDataList = async () => {
		try {
			setIsLoadingMealPlansMetaDataList(true)
			const response = await mealPlanRepository.fetchMetaDataOfAllMealPlans()
			if (response.error) {
				throw response.error
			} else {
				setIsLoadingMealPlansMetaDataList(false)
				setFetchMealPlansMetaDataListError(null)
				setMealPlansMetaDataList(response.value)
				tempSelectedMealIdOverride.current = -1
			}
		} catch (err: any) {
			setIsLoadingMealPlansMetaDataList(false)
			setFetchMealPlansMetaDataListError(err)
		}
	}

	const fetchSelectedMealPlanFromId = async (mealPlanId: number) => {
		if (mealPlansMetaDataList.length < 1) {
			setSelectedMealPlan(null)
		}

		let idOfMealPlanToFetch = mealPlanId
		const idInLoadedMealPlansMetaDataList = mealPlansMetaDataList.some(
			(mealPlanMetaData) => mealPlanMetaData.id == mealPlanId
		)

		try {
			if (!idInLoadedMealPlansMetaDataList) {
				idOfMealPlanToFetch = mealPlansMetaDataList[0].id
			}
			setIsLoadingSelectedMealPlan(true)
			const response = await mealPlanRepository.fetchMealPlanById(idOfMealPlanToFetch)

			if (response.error) {
				throw response.error
			} else {
				setIsLoadingSelectedMealPlan(false)
				setFetchSelectedMealPlanError(null)
				setSelectedMealPlan(response.value)
				if (response.value) {
					localStorage.setItem("selectedMealPlanId", response.value.id.toString())
				}
			}
		} catch (err: any) {
			setIsLoadingSelectedMealPlan(false)
			setFetchSelectedMealPlanError(err)
		}
	}

	const handleSelectedMealPlanChange = (newMealPlanId: number) => {
		fetchSelectedMealPlanFromId(newMealPlanId)
	}

	const handleAddMealPlanClicked = () => {
		NiceModal.show("edit-meal-plan-meta-data-modal").then(async (newMealPlanId) => {
			fetchMealPlansMetaDataList().then(() => {
				if (newMealPlanId) {
					tempSelectedMealIdOverride.current = newMealPlanId as number
				}
			})
		})
	}

	const handleEditMealPlanClicked = () => {
		if (selectedMealPlan) {
			NiceModal.show("edit-meal-plan-meta-data-modal", {
				mealPlanMetaData: new MealPlanMetaData(
					selectedMealPlan.id,
					selectedMealPlan.title,
					selectedMealPlan.requiredCalories,
					selectedMealPlan.requiredFats,
					selectedMealPlan.requiredCarbs,
					selectedMealPlan.requiredProteins
				),
			}).then(() => {
				fetchSelectedMealPlanFromId(selectedMealPlan.id)
			})
		}
	}

	const handleDeleteMealPlanClicked = async (mealPlanId: number) => {
		NiceModal.show("confirmation-modal").then(
			async () => {
				try {
					const response = await mealPlanRepository.deleteMealPlanById(mealPlanId)

					if (response.error) {
						throw response.error
					} else {
						fetchMealPlansMetaDataList()
					}
				} catch (err: any) {
					// Let's do a toast instead of an alert here in the future
					alert("Could not delete meal plan due to: " + err?.toString())
				}
			},
			() => {}
		)
	}

	const handleAddMealPlanMealClicked = () => {
		if (selectedMealPlan) {
			NiceModal.show("add-meal-plan-meal-modal", { mealPlanId: selectedMealPlan.id }).then(() =>
				fetchSelectedMealPlanFromId(selectedMealPlan.id)
			)
		}
	}

	const handleDeleteMealPlanMealClicked = async (mealPlanMealId: MealPlanMealCombinedId) => {
		try {
			const response = await mealPlanMealRepository.deleteMealPlanMeal(mealPlanMealId)

			if (response.error) {
				throw response.error
			} else {
				fetchSelectedMealPlanFromId(selectedMealPlan!.id)
			}
		} catch (err: any) {
			// Let's do a toast instead of an alert here in the future
			alert("Could not delete meal from meal plan due to: " + err?.toString())
		}
	}

	const aggregatedMacros = {
		calories: 0,
		fats: 0,
		carbs: 0,
		proteins: 0,
	}

	selectedMealPlan?.mealPlanMeals.forEach((mealPlanMeal) => {
		const mealMacros = mealPlanMeal.meal.aggregatedMacros
		aggregatedMacros.calories += mealMacros.calories
		aggregatedMacros.fats += mealMacros.fats
		aggregatedMacros.carbs += mealMacros.carbs
		aggregatedMacros.proteins += mealMacros.proteins
	})

	return (
		<Container>
			{isLoadingMealPlansMetaDataList && <Spinner />}
			{/* Minor bug fix, this should not show when there is an error. */}
			{!isLoadingMealPlansMetaDataList &&
				!fetchMealPlansMetaDataListError &&
				mealPlansMetaDataList.length < 1 && (
					<div className="mt-4">
						<h5>Uh-oh, it looks like you haven't created any meal plans yet. Let's fix that!</h5>
						<Button onClick={handleAddMealPlanClicked}>Create Meal Plan</Button>
					</div>
				)}
			{!isLoadingMealPlansMetaDataList && fetchMealPlansMetaDataListError && (
				<ErrorDisplay error={fetchMealPlansMetaDataListError} />
			)}
			{!isLoadingMealPlansMetaDataList &&
				!fetchMealPlansMetaDataListError &&
				mealPlansMetaDataList.length > 0 && (
					<>
						<h2 className="my-4 text-center">Macros</h2>

						<div>
							{isLoadingSelectedMealPlan && !fetchSelectedMealPlanError && <Spinner />}
							{!isLoadingSelectedMealPlan && fetchSelectedMealPlanError && (
								<ErrorDisplay error={fetchSelectedMealPlanError} />
							)}
							{!isLoadingSelectedMealPlan && selectedMealPlan && (
								<Row className="my-4 row-cols-2 row-cols-lg-4 gy-4">
									<Col>
										<ProgressBar
											now={(aggregatedMacros.calories / selectedMealPlan.requiredCalories) * 100}
											variant={getVariantForProgress(
												aggregatedMacros.calories / selectedMealPlan.requiredCalories
											)}
										/>
										<p className="text-center">
											{Math.round(aggregatedMacros.calories)}/
											{Math.round(selectedMealPlan.requiredCalories)}
										</p>
										<h4 className="mt-2 text-center">Calories</h4>
									</Col>
									<Col>
										<ProgressBar
											now={(aggregatedMacros.fats / selectedMealPlan.requiredFats) * 100}
											variant={getVariantForProgress(
												aggregatedMacros.fats / selectedMealPlan.requiredFats
											)}
										/>
										<p className="text-center">
											{Math.round(aggregatedMacros.fats)}/
											{Math.round(selectedMealPlan.requiredFats)}
										</p>
										<h4 className="mt-2 text-center">Fats</h4>
									</Col>
									<Col>
										<ProgressBar
											now={(aggregatedMacros.carbs / selectedMealPlan.requiredCarbs) * 100}
											variant={getVariantForProgress(
												aggregatedMacros.carbs / selectedMealPlan.requiredCarbs
											)}
										/>
										<p className="text-center">
											{Math.round(aggregatedMacros.carbs)}/
											{Math.round(selectedMealPlan.requiredCarbs)}
										</p>
										<h4 className="mt-2 text-center">Carbs</h4>
									</Col>
									<Col>
										<ProgressBar
											now={(aggregatedMacros.proteins / selectedMealPlan.requiredProteins) * 100}
											variant={getVariantForProgress(
												aggregatedMacros.proteins / selectedMealPlan.requiredProteins
											)}
										/>
										<p className="text-center">
											{Math.round(aggregatedMacros.proteins)}/
											{Math.round(selectedMealPlan.requiredProteins)}
										</p>
										<h4 className="mt-2 text-center">Proteins</h4>
									</Col>
								</Row>
							)}
						</div>

						<Row className="my-4 row-cols-1 row-cols-md-2 gy-2">
							<Col className="d-flex align-items-center gap-2">
								<h5 className="mb-0 flex-grow-1">Selected Meal Plan</h5>
								<Dropdown className="d-md-none">
									<DropdownToggle id="meal-plan-dropdown">
										{selectedMealPlan?.title ?? "Select Meal Plan"}
									</DropdownToggle>
									<DropdownMenu>
										{isLoadingMealPlansMetaDataList && (
											<Dropdown.Item>
												<Spinner size="sm" />
											</Dropdown.Item>
										)}
										{!isLoadingMealPlansMetaDataList &&
											mealPlansMetaDataList.map((mealPlanMetaData) => (
												<Dropdown.Item
													className="d-flex align-items-center justify-content-between py-2 gap-4"
													key={mealPlanMetaData.id}
													onClick={() => handleSelectedMealPlanChange(mealPlanMetaData.id)}>
													<p>{mealPlanMetaData.title}</p>
													<Button
														size="sm"
														variant="outline-primary"
														onClick={(e) => {
															e.preventDefault()
															e.stopPropagation()
															handleDeleteMealPlanClicked(mealPlanMetaData.id)
														}}>
														<i className="bi bi-trash"></i>
													</Button>
												</Dropdown.Item>
											))}
									</DropdownMenu>
								</Dropdown>
								<div className="d-md-none d-flex align-items-center gap-2">
									<Button onClick={() => handleEditMealPlanClicked()} variant="outline-primary">
										<i className="bi bi-pencil-fill"></i>
									</Button>
									<Button onClick={() => handleAddMealPlanClicked()} variant="outline-primary">
										<i className="bi bi-plus-lg"></i>
									</Button>
								</div>
							</Col>
							<Col className="d-none d-md-flex justify-content-end align-items-center gap-2">
								<Dropdown className="d-none d-md-block">
									<DropdownToggle id="meal-plan-dropdown">
										{selectedMealPlan?.title ?? "Select Meal Plan"}
									</DropdownToggle>
									<DropdownMenu>
										{isLoadingMealPlansMetaDataList && (
											<Dropdown.Item>
												<Spinner size="sm" />
											</Dropdown.Item>
										)}
										{!isLoadingMealPlansMetaDataList &&
											mealPlansMetaDataList.map((mealPlanMetaData) => (
												<Dropdown.Item
													className="d-flex align-items-center justify-content-between py-2 gap-4"
													key={mealPlanMetaData.id}
													onClick={() => handleSelectedMealPlanChange(mealPlanMetaData.id)}>
													<p>{mealPlanMetaData.title}</p>
													<Button
														size="sm"
														variant="outline-primary"
														onClick={(e) => {
															e.preventDefault()
															e.stopPropagation()
															handleDeleteMealPlanClicked(mealPlanMetaData.id)
														}}>
														<i className="bi bi-trash"></i>
													</Button>
												</Dropdown.Item>
											))}
									</DropdownMenu>
								</Dropdown>
								{selectedMealPlan && (
									<Button style={{ minWidth: "150px" }} onClick={handleEditMealPlanClicked}>
										Edit Meal Plan
									</Button>
								)}
								<Button style={{ minWidth: "170px" }} onClick={handleAddMealPlanClicked}>
									Add New Meal Plan
								</Button>
							</Col>
						</Row>

						<div>
							{isLoadingSelectedMealPlan && !fetchSelectedMealPlanError && <Spinner />}
							{!isLoadingSelectedMealPlan && fetchSelectedMealPlanError && (
								<ErrorDisplay error={setFetchSelectedMealPlanError} />
							)}
							{!isLoadingSelectedMealPlan && selectedMealPlan && (
								<>
									<div className="d-flex align-items-center gap-4">
										<h5 className="mb-0 flex-grow-1">Meals</h5>
										<Button onClick={handleAddMealPlanMealClicked}>
											<i className="bi bi-plus-lg"></i>
										</Button>
									</div>

									<div style={{ maxHeight: "75vh" }} className="overflow-auto">
										<AccordionList
											elementList={selectedMealPlan?.mealPlanMeals.map((mealPlanMeal) => {
												const aggregatedMacros = mealPlanMeal.meal.aggregatedMacros

												return (
													<AccordionListElement
														key={mealPlanMeal.combinedId.mealId}
														headerElements={
															<p className="fw-bold">{`${
																mealPlanMeal.meal.title
															} | ${getMacroNutrientsString(
																aggregatedMacros.calories,
																aggregatedMacros.fats,
																aggregatedMacros.carbs,
																aggregatedMacros.proteins
															)}`}</p>
														}
														bodyElements={
															<div>
																<p>Foods</p>
																{mealPlanMeal.meal.mealFoods.map((mealFood) => (
																	<MealFoodCard
																		key={mealFood.combinedId.toString()}
																		mealFood={mealFood}
																	/>
																))}
															</div>
														}
														entityId={mealPlanMeal.combinedId.mealId}
														entity={mealPlanMeal}
														onDeleteEntityClicked={() =>
															handleDeleteMealPlanMealClicked(mealPlanMeal.combinedId)
														}
													/>
												)
											})}
											isLoading={false}
											error={null}
										/>
									</div>
								</>
							)}
						</div>
					</>
				)}
		</Container>
	)
}

export default ViewMealPlan
