import { number } from "yargs"
import { calculateMacroNutrientsForDesiredQuantity } from "../../services/CalculateMacroNutrientsForDesiredQuantity"
import { Food, FoodJSONSchema } from "../food/Food"

export interface MealFoodCombinedIdJSONSchema {
	mealId: number
	foodId: number
}

export class MealFoodCombinedId {
	private _mealId: number
	private _foodId: number

	public static fromJSONSchema(mealFoodCombinedIdJSONSchema: MealFoodCombinedIdJSONSchema): MealFoodCombinedId {
		return new MealFoodCombinedId(mealFoodCombinedIdJSONSchema.mealId, mealFoodCombinedIdJSONSchema.foodId)
	}

	public static toJSONSchema(mealFoodCombinedId: MealFoodCombinedId): MealFoodCombinedIdJSONSchema {
		return {
			mealId: mealFoodCombinedId.mealId,
			foodId: mealFoodCombinedId.foodId,
		}
	}

	constructor(mealId: number, foodId: number) {
		this._mealId = mealId
		this._foodId = foodId
	}

	public get mealId(): number {
		return this._mealId
	}

	public get foodId(): number {
		return this._foodId
	}

	public toString(): string {
		return `{ mealId: ${this._mealId}, foodId: ${this._foodId} }`
	}
}

export interface MealFoodJSONSchema {
	combinedId: MealFoodCombinedIdJSONSchema
	baseFood: FoodJSONSchema
	desiredQuantity: number
}

export class MealFood {
	private _combinedId: MealFoodCombinedId

	private _baseFood: Food

	private _desiredQuantity: number

	public static fromJSONSchema(mealFoodJSONSchema: MealFoodJSONSchema) {
		return new MealFood(
			MealFoodCombinedId.fromJSONSchema(mealFoodJSONSchema.combinedId),
			Food.fromJSONSchema(mealFoodJSONSchema.baseFood),
			mealFoodJSONSchema.desiredQuantity
		)
	}

	public static toJSONSchema(mealFood: MealFood): MealFoodJSONSchema {
		return {
			combinedId: MealFoodCombinedId.toJSONSchema(mealFood.combinedId),
			baseFood: Food.toJSONSchema(mealFood.baseFood),
			desiredQuantity: mealFood.desiredQuantity,
		}
	}

	constructor(key: MealFoodCombinedId, baseFood: Food, desiredQuantity: number) {
		this._combinedId = key
		this._baseFood = baseFood
		this._desiredQuantity = desiredQuantity
	}

	public get combinedId(): MealFoodCombinedId {
		return this._combinedId
	}

	public get baseFood(): Food {
		return this._baseFood
	}

	public get desiredQuantity(): number {
		return this._desiredQuantity
	}

	public get macrosForDesiredQuantity(): { calories: number; fats: number; carbs: number; proteins: number } {
		return calculateMacroNutrientsForDesiredQuantity(
			this.baseFood.calories,
			this.baseFood.fats,
			this.baseFood.carbs,
			this.baseFood.proteins,
			this.baseFood.quantity,
			this.desiredQuantity
		)
	}
}
