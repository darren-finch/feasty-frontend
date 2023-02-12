import { feastyAxiosInstance } from "../../App"
import { isOk } from "../../util/GeneralUtils"
import { RepositoryResponse } from "../RepositoryResponse"
import { MealPlanMeal, MealPlanMealCombinedId } from "./MealPlanMeal"

const MEAL_PLAN_MEAL_API_PATH = "/mealplanmeals"

export class MealPlanMealRepository {
	async saveMealPlanMeal(mealPlanMeal: MealPlanMeal): Promise<RepositoryResponse<MealPlanMealCombinedId>> {
		let id = new MealPlanMealCombinedId(-1, -1)
		let error = null

		const mealPlanMealData = MealPlanMeal.toJSONSchema(mealPlanMeal)

		try {
			const response = await feastyAxiosInstance.put(MEAL_PLAN_MEAL_API_PATH, JSON.stringify(mealPlanMealData))

			if (isOk(response)) {
				id = MealPlanMealCombinedId.fromJSONSchema(response.data)
			} else {
				throw new Error(response.statusText)
			}
		} catch (err: any) {
			error = err
		}

		return { value: id, error: error }
	}

	async deleteMealPlanMeal(combinedId: MealPlanMealCombinedId): Promise<RepositoryResponse<void>> {
		let error = null

		try {
			const response = await feastyAxiosInstance(MEAL_PLAN_MEAL_API_PATH, {
				data: JSON.stringify(MealPlanMealCombinedId.toJSONSchema(combinedId)),
			})

			if (!isOk(response)) {
				throw new Error(response.statusText)
			}
		} catch (err: any) {
			error = err
		}

		return { value: undefined, error: error }
	}
}
