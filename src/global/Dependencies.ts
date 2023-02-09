import { FoodRepository } from "../data/food/FoodRepository"
import { MealRepository } from "../data/meal/MealRepository"
import { MealPlanMealRepository } from "../data/mealplan/MealPlanMealRepository"
import { MealPlanRepository } from "../data/mealplan/MealPlanRepository"

export const foodRepository: FoodRepository = new FoodRepository()
export const mealRepository: MealRepository = new MealRepository()
export const mealPlanRepository: MealPlanRepository = new MealPlanRepository()
export const mealPlanMealRepository: MealPlanMealRepository = new MealPlanMealRepository()
