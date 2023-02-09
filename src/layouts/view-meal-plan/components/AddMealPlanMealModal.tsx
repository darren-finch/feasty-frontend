import { useAuth0 } from "@auth0/auth0-react"
import NiceModal, { NiceModalHocProps, useModal } from "@ebay/nice-modal-react"
import { useEffect, useState } from "react"
import { Spinner } from "react-bootstrap"
import { Meal } from "../../../data/meal/Meal"
import { MealPlanMeal, MealPlanMealCombinedId } from "../../../data/mealplan/MealPlanMeal"
import { mealPlanMealRepository, mealRepository } from "../../../global/Dependencies"
import HighlightableCard from "../../re-useable/lists/HighlightableCard"
import ErrorDisplay from "../../re-useable/misc/ErrorDisplay"
import NoResultsDisplay from "../../re-useable/misc/NoResultsDisplay"
import SearchHeader from "../../re-useable/misc/SearchHeader"
import EditEntityModalTemplate from "../../re-useable/modals/EditEntityModalTemplate"

const AddMealPlanMealModal = NiceModal.create<NiceModalHocProps>(() => {
	const modal = useModal("add-meal-plan-meal-modal")
	const mealPlanId = (modal.args?.mealPlanId as number) ?? -1

	const [isSavingMealPlanMeal, setIsSavingMealPlanMeal] = useState(false)

	const { getAccessTokenSilently } = useAuth0()

	const [searchQuery, setSearchQuery] = useState("")
	const [isMealsListLoading, setIsMealsListLoading] = useState(true)
	const [mealsList, setMealsList] = useState<Meal[]>([])
	const [fetchMealsListError, setFetchMealsListError] = useState<string | null>()
	const [footerError, setFooterError] = useState<string | null>()

	const [selectedMealId, setSelectedMealId] = useState(-1)

	useEffect(() => {
		fetchMeals()
	}, [])

	const fetchMeals = async () => {
		setIsMealsListLoading(true)
		try {
			const accessToken = await getAccessTokenSilently()
			const response = await mealRepository.fetchMealsByTitle(searchQuery, accessToken)
			if (response.error) {
				throw response.error
			} else {
				setIsMealsListLoading(false)
				setMealsList(response.value)
				setFetchMealsListError(null)
			}
		} catch (err: any) {
			setIsMealsListLoading(false)
			setFetchMealsListError(err)
		}
	}

	const handleClose = () => {
		modal.hide()
	}

	const handleExited = () => {
		modal.remove()
	}

	const handleSaveClicked = async () => {
		try {
			const selectedMeal = mealsList.find((meal) => meal.id == selectedMealId)
			if (selectedMeal && mealPlanId) {
				setIsSavingMealPlanMeal(true)
				const newMealPlanMeal = new MealPlanMeal(
					new MealPlanMealCombinedId(mealPlanId, selectedMealId),
					selectedMeal
				)

				const accessToken = await getAccessTokenSilently()
				const response = await mealPlanMealRepository.saveMealPlanMeal(newMealPlanMeal, accessToken)

				if (response.error) {
					throw response.error
				} else {
					setIsSavingMealPlanMeal(false)
					modal.resolve()
					modal.hide()
				}
			} else {
				setFooterError("The selected meal id was not valid or the meal plan id passed as arg was not valid.")
			}
		} catch (err: any) {
			setIsSavingMealPlanMeal(false)
			setFooterError(err)
		}
	}

	const handleSearchQueryChange = (newSearchQuery: string) => {
		setSearchQuery(newSearchQuery)
	}

	const handleSearchClicked = () => {
		fetchMeals()
	}

	const handleSelectMeal = (newMealId: number) => {
		setSelectedMealId(newMealId)
	}

	return (
		<EditEntityModalTemplate
			show={modal.visible}
			title={"Add Meal To Meal Plan"}
			isLoading={isSavingMealPlanMeal}
			footerError={footerError}
			onClose={handleClose}
			onExited={handleExited}
			onSaveClicked={handleSaveClicked}>
			<SearchHeader
				searchQuery={searchQuery}
				onSearchQueryChange={handleSearchQueryChange}
				onSearchClicked={handleSearchClicked}
			/>
			{isMealsListLoading && !fetchMealsListError && <Spinner />}
			{!isMealsListLoading && fetchMealsListError && <ErrorDisplay error={fetchMealsListError} />}
			{!isMealsListLoading && !fetchMealsListError && mealsList.length < 1 && <NoResultsDisplay />}
			{!isMealsListLoading && !fetchMealsListError && mealsList.length > 0 && (
				<div style={{ height: "25vh" }} className="my-2 overflow-auto">
					{mealsList.map((meal) => (
						<HighlightableCard
							key={meal.id}
							id={meal.id}
							title={meal.title}
							active={meal.id == selectedMealId}
							onCardClicked={handleSelectMeal}
						/>
					))}
				</div>
			)}
		</EditEntityModalTemplate>
	)
})

export default AddMealPlanMealModal
