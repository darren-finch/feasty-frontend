import { RepositoryResponse } from "../RepositoryResponse"
import { Meal } from "./Meal"

export class MealRepository {
	private _baseMealsUrlString = process.env.REACT_APP_API_SERVER_URL + "/api/meals"

	async fetchMealsByTitle(title: string, accessToken: string): Promise<RepositoryResponse<Meal[]>> {
		const finalMealsUrl = new URL(this._baseMealsUrlString)
		if (title != "") {
			finalMealsUrl.searchParams.append("title", title)
		}

		const loadedMeals: Meal[] = []
		let error = null

		try {
			const response = await fetch(finalMealsUrl, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})

			if (!response.ok) {
				throw new Error(response.statusText)
			}

			const responseJson = await response.json()

			for (const key in responseJson) {
				loadedMeals.push(Meal.fromJSONSchema(responseJson[key]))
			}
		} catch (err: any) {
			error = err
		}

		return { value: loadedMeals, error: error }
	}

	async saveMeal(meal: Meal, accessToken: string): Promise<RepositoryResponse<number>> {
		let id = -1
		let error = null

		const mealData = Meal.toJSONSchema(meal)

		try {
			const finalUrl = new URL(`${this._baseMealsUrlString}`)
			const response = await fetch(finalUrl, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(mealData),
			})

			if (response.ok) {
				const responseJson = await response.json()
				id = responseJson.id
			} else {
				throw new Error(response.statusText)
			}
		} catch (err: any) {
			error = err
		}

		return { value: id, error: error }
	}

	// TODO: Deal with foreign key constraints
	async deleteMeal(mealId: number, accessToken: string): Promise<RepositoryResponse<void>> {
		let error = null

		try {
			const finalUrl = new URL(`${this._baseMealsUrlString}/${mealId.toString()}`)
			const response = await fetch(finalUrl, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
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
