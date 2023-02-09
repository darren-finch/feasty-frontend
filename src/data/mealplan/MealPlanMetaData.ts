export interface MealPlanMetaDataJSONSchema {
	id: number
	title: string
	requiredCalories: number
	requiredFats: number
	requiredCarbs: number
	requiredProteins: number
}

export class MealPlanMetaData {
	private _id: number

	private _title: string

	private _requiredCalories: number

	private _requiredFats: number

	private _requiredCarbs: number

	private _requiredProteins: number

	public static fromJSONSchema(mealPlanMetaDataJSONSchema: MealPlanMetaDataJSONSchema): MealPlanMetaData {
		return new MealPlanMetaData(
			mealPlanMetaDataJSONSchema.id,
			mealPlanMetaDataJSONSchema.title,
			mealPlanMetaDataJSONSchema.requiredCalories,
			mealPlanMetaDataJSONSchema.requiredFats,
			mealPlanMetaDataJSONSchema.requiredCarbs,
			mealPlanMetaDataJSONSchema.requiredProteins
		)
	}

	public static toJSONSchema(mealPlanMetaData: MealPlanMetaDataJSONSchema): MealPlanMetaDataJSONSchema {
		return {
			id: mealPlanMetaData.id,
			title: mealPlanMetaData.title,
			requiredCalories: mealPlanMetaData.requiredCalories,
			requiredFats: mealPlanMetaData.requiredFats,
			requiredCarbs: mealPlanMetaData.requiredCarbs,
			requiredProteins: mealPlanMetaData.requiredProteins,
		}
	}

	constructor(
		id: number,
		title: string,
		requiredCalories: number,
		requiredFats: number,
		requiredCarbs: number,
		requiredProteins: number
	) {
		this._id = id
		this._title = title
		this._requiredCalories = requiredCalories
		this._requiredFats = requiredFats
		this._requiredCarbs = requiredCarbs
		this._requiredProteins = requiredProteins
	}

	public get id(): number {
		return this._id
	}

	public get title(): string {
		return this._title
	}

	public get requiredCalories(): number {
		return this._requiredCalories
	}

	public get requiredFats(): number {
		return this._requiredFats
	}

	public get requiredCarbs(): number {
		return this._requiredCarbs
	}

	public get requiredProteins(): number {
		return this._requiredProteins
	}
}
