import { RepositoryResponse } from "../RepositoryResponse"
import { MealPlanMeal, MealPlanMealCombinedId } from "./MealPlanMeal"

export class MealPlanMealRepository {
	private _baseMealPlanMealsUrlString = process.env.REACT_APP_API_SERVER_URL + "/api/mealplanmeals"

	async saveMealPlanMeal(
		mealPlanMeal: MealPlanMeal,
		accessToken: string
	): Promise<RepositoryResponse<MealPlanMealCombinedId>> {
		let id = new MealPlanMealCombinedId(-1, -1)
		let error = null

		const mealPlanMealData = MealPlanMeal.toJSONSchema(mealPlanMeal)

		try {
			const finalUrl = new URL(`${this._baseMealPlanMealsUrlString}`)
			const response = await fetch(finalUrl, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(mealPlanMealData),
			})

			if (response.ok) {
				const responseJson = await response.json()
				id = MealPlanMealCombinedId.fromJSONSchema(responseJson)
			} else {
				throw new Error(response.statusText)
			}
		} catch (err: any) {
			error = err
		}

		return { value: id, error: error }
	}

	async deleteMealPlanMeal(
		combinedId: MealPlanMealCombinedId,
		accessToken: string
	): Promise<RepositoryResponse<void>> {
		let error = null

		try {
			const finalUrl = new URL(`${this._baseMealPlanMealsUrlString}`)
			const response = await fetch(finalUrl, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: `${JSON.stringify(MealPlanMealCombinedId.toJSONSchema(combinedId))}`,
			})

			if (!response.ok) {
				throw new Error(response.statusText)
			}
		} catch (err: any) {
			error = err
		}

		return { value: undefined, error: error }
	}
}
