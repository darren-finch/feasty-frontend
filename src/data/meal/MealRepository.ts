import { feastyAxiosInstance } from "../../App"
import { isOk } from "../../util/GeneralUtils"
import { RepositoryResponse } from "../RepositoryResponse"
import { Meal } from "./Meal"

const MEALS_API_PATH = "/meals"

export class MealRepository {
	async fetchMealsByTitle(title: string): Promise<RepositoryResponse<Meal[]>> {
		const loadedMeals: Meal[] = []
		let error = null

		try {
			const params =
				title == ""
					? null
					: {
							title: title,
					  }
			const response = await feastyAxiosInstance.get(MEALS_API_PATH)

			if (!isOk(response)) {
				throw new Error(response.statusText)
			}

			for (const key in response.data) {
				loadedMeals.push(Meal.fromJSONSchema(response.data[key]))
			}
		} catch (err: any) {
			error = err
		}

		return { value: loadedMeals, error: error }
	}

	async saveMeal(meal: Meal): Promise<RepositoryResponse<number>> {
		let id = -1
		let error = null

		const mealData = Meal.toJSONSchema(meal)

		try {
			const response = await feastyAxiosInstance.put(MEALS_API_PATH, JSON.stringify(mealData))

			if (isOk(response)) {
				id = response.data.id
			} else {
				throw new Error(response.statusText)
			}
		} catch (err: any) {
			error = err
		}

		return { value: id, error: error }
	}

	// TODO: Deal with foreign key constraints
	async deleteMeal(mealId: number): Promise<RepositoryResponse<void>> {
		let error = null

		try {
			const response = await feastyAxiosInstance.delete(MEALS_API_PATH + `/${mealId}`)

			if (!isOk(response)) {
				throw new Error(response.statusText)
			}
		} catch (err: any) {
			error = err
		}

		return { value: undefined, error: error }
	}
}
