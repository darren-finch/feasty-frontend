import { feastyAxiosInstance } from "../../App"
import { isOk } from "../../util/GeneralUtils"
import { RepositoryResponse } from "../RepositoryResponse"
import { MealPlan } from "./MealPlan"
import { MealPlanMetaData } from "./MealPlanMetaData"

const MEAL_PLAN_PATH = "/mealplans"

export class MealPlanRepository {
	async fetchMetaDataOfAllMealPlans(): Promise<RepositoryResponse<MealPlanMetaData[]>> {
		const loadedMealPlanMetaData: MealPlanMetaData[] = []
		let error = null

		try {
			const response = await feastyAxiosInstance.get(MEAL_PLAN_PATH)

			if (!isOk(response)) {
				throw new Error(response.statusText)
			}

			for (const key in response.data) {
				loadedMealPlanMetaData.push(MealPlanMetaData.fromJSONSchema(response.data[key]))
			}
		} catch (err: any) {
			error = err
		}

		return { value: loadedMealPlanMetaData, error: error }
	}

	async fetchMealPlanById(mealPlanId: number): Promise<RepositoryResponse<MealPlan | null>> {
		let loadedMealPlan: MealPlan | null = null
		let error = null

		try {
			const response = await feastyAxiosInstance.get(MEAL_PLAN_PATH + `/${mealPlanId}`)

			if (!isOk(response)) {
				throw new Error(response.statusText)
			}

			loadedMealPlan = MealPlan.fromJSONSchema(response.data)
		} catch (err: any) {
			error = err
		}

		return { value: loadedMealPlan, error: error }
	}

	async saveMealPlanMetaData(mealPlanMetaData: MealPlanMetaData): Promise<RepositoryResponse<number>> {
		let id = -1
		let error = null

		const mealPlanMetaDataJSONSchema = MealPlanMetaData.toJSONSchema(mealPlanMetaData)

		try {
			const response = await feastyAxiosInstance.put(MEAL_PLAN_PATH, JSON.stringify(mealPlanMetaDataJSONSchema))

			if (!isOk(response)) {
				throw new Error(response.statusText)
			}

			id = response.data
		} catch (err: any) {
			error = err
		}

		return { value: id, error: error }
	}

	async deleteMealPlanById(mealPlanId: number): Promise<RepositoryResponse<void>> {
		let error = null

		try {
			const response = await feastyAxiosInstance.delete(MEAL_PLAN_PATH + `/${mealPlanId}`)

			if (!isOk(response)) {
				throw new Error(response.statusText)
			}
		} catch (err: any) {
			error = err
		}

		return { value: undefined, error: error }
	}
}
