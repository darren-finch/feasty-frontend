import { MealPlanMeal, MealPlanMealJSONSchema } from "./MealPlanMeal"

export interface MealPlanJSONSchema {
	id: number
	title: string
	requiredCalories: number
	requiredFats: number
	requiredCarbs: number
	requiredProteins: number
	mealPlanMeals: MealPlanMealJSONSchema[]
}

export class MealPlan {
	private _id: number

	private _title: string

	private _requiredCalories: number

	private _requiredFats: number

	private _requiredCarbs: number

	private _requiredProteins: number

	private _mealPlanMeals: MealPlanMeal[]

	public static fromJSONSchema(mealPlanJSONSchema: MealPlanJSONSchema): MealPlan {
		return new MealPlan(
			mealPlanJSONSchema.id,
			mealPlanJSONSchema.title,
			mealPlanJSONSchema.requiredCalories,
			mealPlanJSONSchema.requiredFats,
			mealPlanJSONSchema.requiredCarbs,
			mealPlanJSONSchema.requiredProteins,
			mealPlanJSONSchema.mealPlanMeals.map((mealPlanMealJSONSchema) =>
				MealPlanMeal.fromJSONSchema(mealPlanMealJSONSchema)
			)
		)
	}

	public static toJSONSchema(mealPlan: MealPlan): MealPlanJSONSchema {
		return {
			id: mealPlan.id,
			title: mealPlan.title,
			requiredCalories: mealPlan.requiredCalories,
			requiredFats: mealPlan.requiredFats,
			requiredCarbs: mealPlan.requiredCarbs,
			requiredProteins: mealPlan.requiredProteins,
			mealPlanMeals: mealPlan.mealPlanMeals.map((mealPlanMeal) => MealPlanMeal.toJSONSchema(mealPlanMeal)),
		}
	}

	constructor(
		id: number,
		title: string,
		requiredCalories: number,
		requiredFats: number,
		requiredCarbs: number,
		requiredProteins: number,
		mealPlanMeals: MealPlanMeal[]
	) {
		this._id = id
		this._title = title
		this._requiredCalories = requiredCalories
		this._requiredFats = requiredFats
		this._requiredCarbs = requiredCarbs
		this._requiredProteins = requiredProteins
		this._mealPlanMeals = mealPlanMeals
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

	public get mealPlanMeals(): MealPlanMeal[] {
		return this._mealPlanMeals
	}
}
