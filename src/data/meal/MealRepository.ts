import { sleep, testMeal1, testMeal2 } from "../../util/TestUtils"
import { Food } from "../food/Food"
import { RepositoryResponse } from "../RepositoryResponse"
import { Meal } from "./Meal"
import { MealFood, MealFoodCombinedId } from "./MealFood"

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

			const responseData = responseJson.content

			for (const key in responseData) {
				loadedMeals.push(
					new Meal(
						responseData[key].id,
						responseData[key].title,
						responseData[key].mealFoods.map((mealFoodData: any) => {
							return new MealFood(
								new MealFoodCombinedId(mealFoodData.combinedId.mealId, mealFoodData.combinedId.foodId),
								new Food(
									mealFoodData.baseFood.id,
									mealFoodData.baseFood.title,
									mealFoodData.baseFood.quantity,
									mealFoodData.baseFood.unit,
									mealFoodData.baseFood.calories,
									mealFoodData.baseFood.fats,
									mealFoodData.baseFood.carbs,
									mealFoodData.baseFood.proteins
								),
								mealFoodData.desiredQuantity
							)
						})
					)
				)
			}
		} catch (err: any) {
			error = err
		}

		return { value: loadedMeals, error: error }
	}

	async saveMeal(meal: Meal, accessToken: string): Promise<RepositoryResponse<number>> {
		let id = -1
		let error = null

		const mealData = {
			id: meal.id,
			title: meal.title,
			mealFoods: meal.mealFoods.map((mealFood) => ({
				combinedId: {
					mealId: mealFood.combinedId.mealId,
					foodId: mealFood.combinedId.foodId,
				},
				baseFood: {
					id: mealFood.baseFood.id,
					title: mealFood.baseFood.title,
					quantity: mealFood.baseFood.quantity,
					unit: mealFood.baseFood.unit,
					calories: mealFood.baseFood.calories,
					fats: mealFood.baseFood.fats,
					carbs: mealFood.baseFood.carbs,
					proteins: mealFood.baseFood.proteins,
				},
				desiredQuantity: mealFood.desiredQuantity,
			})),
		}

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
