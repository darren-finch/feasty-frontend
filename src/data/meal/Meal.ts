import { MealFood } from "./MealFood"

export class Meal {
	private _id: number

	private _title: string

	private _mealFoods: MealFood[]

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
}
