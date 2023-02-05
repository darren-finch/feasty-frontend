import { calculateMacroNutrientsForDesiredQuantity } from "../../services/CalculateMacroNutrientsForDesiredQuantity"
import { Food } from "../food/Food"

export class MealFood {
	private _id: number

	private _baseFood: Food

	private _desiredQuantity: number

	constructor(id: number, baseFood: Food, desiredQuantity: number) {
		this._id = id
		this._baseFood = baseFood
		this._desiredQuantity = desiredQuantity
	}

	public get id(): number {
		return this._id
	}

	public get baseFood(): Food {
		return this._baseFood
	}

	public get desiredQuantity(): number {
		return this._desiredQuantity
	}

	public get macroNutrientsForDesiredQuantity(): { calories: number; fats: number; carbs: number; proteins: number } {
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
