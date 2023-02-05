import { sleep, testMeal1, testMeal2 } from "../../util/TestUtils"
import { RepositoryResponse } from "../RepositoryResponse"
import { Meal } from "./Meal"

export class MealRepository {
	async fetchMealsByTitle(title: string): Promise<RepositoryResponse<Meal[]>> {
		await sleep(500)
		return { value: [testMeal1, testMeal2], error: null }
	}

	async saveMeal(meal: Meal): Promise<RepositoryResponse<number>> {
		await sleep(500)
		return { value: -1, error: null }
	}

	// TODO: Deal with foreign key constraints
	async deleteMeal(mealId: number): Promise<RepositoryResponse<void>> {
		await sleep(500)
		return { value: undefined, error: null }
	}
}
