import { RepositoryResponse } from "../RepositoryResponse"
import { MealPlan } from "./MealPlan"
import { MealPlanMetaData } from "./MealPlanMetaData"

export class MealPlanRepository {
	private _baseMealPlansUrlString = process.env.REACT_APP_API_SERVER_URL + "/api/mealplans"

	async fetchMetaDataOfAllMealPlans(accessToken: string): Promise<RepositoryResponse<MealPlanMetaData[]>> {
		const finalMealPlansUrl = new URL(this._baseMealPlansUrlString)

		const loadedMealPlanMetaData: MealPlanMetaData[] = []
		let error = null

		try {
			const response = await fetch(finalMealPlansUrl, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})

			if (!response.ok) {
				throw new Error(response.statusText)
			}

			const responseJson = await response.json()

			for (const key in responseJson) {
				loadedMealPlanMetaData.push(MealPlanMetaData.fromJSONSchema(responseJson[key]))
			}
		} catch (err: any) {
			error = err
		}

		return { value: loadedMealPlanMetaData, error: error }
	}

	async fetchMealPlanById(mealPlanId: number, accessToken: string): Promise<RepositoryResponse<MealPlan | null>> {
		const finalMealPlansUrl = new URL(`${this._baseMealPlansUrlString}/${mealPlanId}`)

		let loadedMealPlan: MealPlan | null = null
		let error = null

		try {
			const response = await fetch(finalMealPlansUrl, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})

			if (!response.ok) {
				throw new Error(response.statusText)
			}

			const responseJson = await response.json()

			loadedMealPlan = MealPlan.fromJSONSchema(responseJson)
		} catch (err: any) {
			error = err
		}

		return { value: loadedMealPlan, error: error }
	}

	async saveMealPlanMetaData(
		mealPlanMetaData: MealPlanMetaData,
		accessToken: string
	): Promise<RepositoryResponse<number>> {
		const finalMealPlansUrl = new URL(this._baseMealPlansUrlString)

		let id = -1
		let error = null

		const mealPlanMetaDataJSONSchema = MealPlanMetaData.toJSONSchema(mealPlanMetaData)

		try {
			const response = await fetch(finalMealPlansUrl, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(mealPlanMetaDataJSONSchema),
			})

			if (!response.ok) {
				throw new Error(response.statusText)
			}

			const responseJson = await response.json()
			id = responseJson
		} catch (err: any) {
			error = err
		}

		return { value: id, error: error }
	}

	async deleteMealPlanById(mealPlanId: number, accessToken: string): Promise<RepositoryResponse<void>> {
		let error = null

		try {
			const finalUrl = new URL(`${this._baseMealPlansUrlString}/${mealPlanId.toString()}`)
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
