export interface FoodJSONSchema {
	id: number
	title: string
	quantity: number
	unit: string
	calories: number
	fats: number
	carbs: number
	proteins: number
}

export class Food {
	private _id: number

	private _title: string

	private _quantity: number

	private _unit: string

	private _calories: number

	private _fats: number

	private _carbs: number

	private _proteins: number

	public static fromJSONSchema(jsonObj: FoodJSONSchema): Food {
		return new Food(
			jsonObj.id,
			jsonObj.title,
			jsonObj.quantity,
			jsonObj.unit,
			jsonObj.calories,
			jsonObj.fats,
			jsonObj.carbs,
			jsonObj.proteins
		)
	}

	public static toJSONSchema(food: Food): FoodJSONSchema {
		return {
			id: food._id,
			title: food._title,
			quantity: food._quantity,
			unit: food._unit,
			calories: food._calories,
			fats: food._fats,
			carbs: food._carbs,
			proteins: food._proteins,
		}
	}

	constructor(
		id: number,
		title: string,
		quantity: number,
		unit: string,
		calories: number,
		fats: number,
		carbs: number,
		proteins: number
	) {
		this._id = id
		this._title = title
		this._quantity = quantity
		this._unit = unit
		this._calories = calories
		this._fats = fats
		this._carbs = carbs
		this._proteins = proteins
	}

	public get id(): number {
		return this._id
	}

	public get title(): string {
		return this._title
	}

	public get quantity(): number {
		return this._quantity
	}

	public get unit(): string {
		return this._unit
	}

	public get calories(): number {
		return this._calories
	}

	public get fats(): number {
		return this._fats
	}

	public get carbs(): number {
		return this._carbs
	}

	public get proteins(): number {
		return this._proteins
	}
}
