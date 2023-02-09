import { Meal, MealJSONSchema } from "../meal/Meal"

export interface MealPlanMealCombinedIdJSONSchema {
	mealPlanId: number
	mealId: number
}

export class MealPlanMealCombinedId {
	private _mealPlanId: number
	private _mealId: number

	public static fromJSONSchema(
		mealPlanMealCombinedIdJSONSchema: MealPlanMealCombinedIdJSONSchema
	): MealPlanMealCombinedId {
		return new MealPlanMealCombinedId(
			mealPlanMealCombinedIdJSONSchema.mealPlanId,
			mealPlanMealCombinedIdJSONSchema.mealId
		)
	}

	public static toJSONSchema(mealFoodCombinedId: MealPlanMealCombinedId): MealPlanMealCombinedIdJSONSchema {
		return {
			mealPlanId: mealFoodCombinedId.mealPlanId,
			mealId: mealFoodCombinedId.mealId,
		}
	}

	constructor(mealPlanId: number, mealId: number) {
		this._mealPlanId = mealPlanId
		this._mealId = mealId
	}

	public get mealPlanId(): number {
		return this._mealPlanId
	}

	public get mealId(): number {
		return this._mealId
	}

	public toString(): string {
		return `{ mealPlanId: ${this._mealPlanId}, mealId: ${this._mealId} }`
	}
}

export interface MealPlanMealJSONSchema {
	combinedId: MealPlanMealCombinedIdJSONSchema
	meal: MealJSONSchema
}

export class MealPlanMeal {
	private _combinedId: MealPlanMealCombinedId

	private _meal: Meal

	public static fromJSONSchema(mealPlanMealJSONSchema: MealPlanMealJSONSchema): MealPlanMeal {
		return new MealPlanMeal(
			MealPlanMealCombinedId.fromJSONSchema(mealPlanMealJSONSchema.combinedId),
			Meal.fromJSONSchema(mealPlanMealJSONSchema.meal)
		)
	}

	public static toJSONSchema(mealPlanMeal: MealPlanMeal): MealPlanMealJSONSchema {
		return {
			combinedId: MealPlanMealCombinedId.toJSONSchema(mealPlanMeal.combinedId),
			meal: Meal.toJSONSchema(mealPlanMeal.meal),
		}
	}

	constructor(combinedId: MealPlanMealCombinedId, meal: Meal) {
		this._combinedId = combinedId
		this._meal = meal
	}

	public get combinedId(): MealPlanMealCombinedId {
		return this._combinedId
	}

	public get meal(): Meal {
		return this._meal
	}
}
