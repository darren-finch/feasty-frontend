export class Food {
	private _id: string

	private _title: string

	private _quantity: number

	private _unit: string

	private _calories: number

	private _fats: number

	private _carbs: number

	private _proteins: number

	constructor(
		id: string,
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

	public get id(): string {
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
