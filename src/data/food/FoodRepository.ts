import { feastyAxiosInstance } from "../../App"
import { isOk } from "../../util/GeneralUtils"
import { RepositoryResponse } from "../RepositoryResponse"
import { Food } from "./Food"

const FOODS_API_PATH = "/foods"

export class FoodRepository {
	async fetchFoodsByTitle(title: string): Promise<RepositoryResponse<Food[]>> {
		const loadedFoods: Food[] = []
		let error = null

		try {
			const params =
				title == ""
					? null
					: {
							title: title,
					  }
			const response = await feastyAxiosInstance.get(FOODS_API_PATH, {
				params: params,
			})

			if (!isOk(response)) {
				throw Error(response.statusText)
			}

			for (const key in response.data) {
				loadedFoods.push(Food.fromJSONSchema(response.data[key]))
			}
		} catch (err: any) {
			error = err
		}

		return { value: loadedFoods, error: error }
	}

	async saveFood(food: Food): Promise<RepositoryResponse<number>> {
		let id = -1
		let error = null

		const foodData = Food.toJSONSchema(food)

		try {
			const response = await feastyAxiosInstance.put(FOODS_API_PATH, JSON.stringify(foodData))

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

	async deleteFood(foodId: number): Promise<RepositoryResponse<void>> {
		let error = null

		try {
			const response = await feastyAxiosInstance.delete(FOODS_API_PATH + `/${foodId}`)

			if (!isOk(response)) {
				throw new Error(response.statusText)
			}
		} catch (err: any) {
			error = err
		}

		return { value: undefined, error: error }
	}
}
