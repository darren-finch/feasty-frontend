import { MealFood, MealFoodJSONSchema } from "./MealFood"

export interface MealJSONSchema {
	id: number
	title: string
	mealFoods: MealFoodJSONSchema[]
}

export class Meal {
	private _id: number

	private _title: string

	private _mealFoods: MealFood[]

	public static fromJSONSchema(jsonSchema: MealJSONSchema): Meal {
		return new Meal(
			jsonSchema.id,
			jsonSchema.title,
			jsonSchema.mealFoods.map((mealFoodJSONSchema) => MealFood.fromJSONSchema(mealFoodJSONSchema))
		)
	}

	public static toJSONSchema(meal: Meal): MealJSONSchema {
		return {
			id: meal.id,
			title: meal.title,
			mealFoods: meal.mealFoods.map((mealFood) => MealFood.toJSONSchema(mealFood)),
		}
	}

	constructor(id: number, title: string, mealFoods: MealFood[]) {
		this._id = id
		this._title = title
		this._mealFoods = mealFoods
	}

	public get id(): number {
		return this._id
	}

	public get title(): string {
		return this._title
	}

	public get mealFoods(): MealFood[] {
		return this._mealFoods
	}

	public get aggregatedMacros(): { calories: number; fats: number; carbs: number; proteins: number } {
		const aggregatedMacros = {
			calories: 0,
			fats: 0,
			carbs: 0,
			proteins: 0,
		}

		this._mealFoods.forEach((mealFood) => {
			const mealFoodMacros = mealFood.macrosForDesiredQuantity
			aggregatedMacros.calories += mealFoodMacros.calories
			aggregatedMacros.fats += mealFoodMacros.fats
			aggregatedMacros.carbs += mealFoodMacros.carbs
			aggregatedMacros.proteins += mealFoodMacros.proteins
		})

		return aggregatedMacros
	}
}
