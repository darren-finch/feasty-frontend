import { RepositoryResponse } from "../RepositoryResponse"
import { Food } from "./Food"

export class FoodRepository {
	private _baseFoodsUrlString = "http://localhost:8080/api/foods"

	async fetchFoodsByTitle(title: string): Promise<RepositoryResponse<Food[]>> {
		const finalFoodsUrl = new URL(this._baseFoodsUrlString + (title != "" ? "/search/findByTitleContaining" : ""))
		finalFoodsUrl.searchParams.append("title", title)

		const loadedFoods: Food[] = []
		let error = null

		try {
			const response = await fetch(finalFoodsUrl)

			if (!response.ok) {
				throw new Error(response.statusText)
			}

			const responseJson = await response.json()

			const responseData = responseJson._embedded.foods

			for (const key in responseData) {
				loadedFoods.push(
					new Food(
						responseData[key].id,
						responseData[key].title,
						responseData[key].quantity,
						responseData[key].unit,
						responseData[key].calories,
						responseData[key].fats,
						responseData[key].carbs,
						responseData[key].proteins
					)
				)
			}
		} catch (err: any) {
			error = err
		}

		return { value: loadedFoods, error: error }
	}

	async saveFood(food: Food): Promise<RepositoryResponse<number>> {
		let id = -1
		let error = null

		// TODO: Figure out how to NOT DO THIS
		const foodData = {
			id: food.id,
			title: food.title,
			quantity: food.quantity,
			unit: food.unit,
			calories: food.calories,
			fats: food.fats,
			carbs: food.carbs,
			proteins: food.proteins,
		}

		const foodIsNew = food.id < 0

		try {
			const finalUrl = new URL(this._baseFoodsUrlString + (foodIsNew ? "" : `/${food.id}`))
			const response = await fetch(finalUrl, {
				method: foodIsNew ? "POST" : "PUT",
				headers: {
					"Content-Type": "application/json",
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

	// TODO: Deal with foreign key constraints
	async deleteFood(foodId: number): Promise<RepositoryResponse<void>> {
		let error = null

		try {
			const finalUrl = new URL(`${this._baseFoodsUrlString}/${foodId.toString()}`)
			const response = await fetch(finalUrl, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
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
