import { RepositoryResponse } from "../RepositoryResponse"
import { Food } from "./Food"

export class FoodRepository {
	private _baseFoodsUrlString = process.env.REACT_APP_API_SERVER_URL + "/api/foods"

	async fetchFoodsByTitle(title: string, accessToken: string): Promise<RepositoryResponse<Food[]>> {
		const finalFoodsUrl = new URL(this._baseFoodsUrlString)
		if (title != "") {
			finalFoodsUrl.searchParams.append("title", title)
		}

		const loadedFoods: Food[] = []
		let error = null

		try {
			const response = await fetch(finalFoodsUrl, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})

			if (!response.ok) {
				throw new Error(response.statusText)
			}

			const responseJson = await response.json()

			const responseData = responseJson.content

			for (const key in responseData) {
				loadedFoods.push(Food.fromJSONSchema(responseData[key]))
			}
		} catch (err: any) {
			error = err
		}

		return { value: loadedFoods, error: error }
	}

	async saveFood(food: Food, accessToken: string): Promise<RepositoryResponse<number>> {
		let id = -1
		let error = null

		// TODO: Figure out how to NOT DO THIS
		const foodData = Food.toJSONSchema(food)

		try {
			const finalUrl = new URL(`${this._baseFoodsUrlString}`)
			const response = await fetch(finalUrl, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(foodData),
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

	async deleteFood(foodId: number, accessToken: string): Promise<RepositoryResponse<void>> {
		let error = null

		try {
			const finalUrl = new URL(`${this._baseFoodsUrlString}/${foodId.toString()}`)
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
