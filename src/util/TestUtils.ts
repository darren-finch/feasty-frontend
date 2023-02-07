import { Food } from "../data/food/Food"
import { Meal } from "../data/meal/Meal"
import { MealFood, MealFoodCombinedId } from "../data/meal/MealFood"

export const testFood1 = new Food(0, "Chicken breast", 4.0, "oz", 120, 6, 0, 24)
export const testFood2 = new Food(1, "Brown rice", 1.0, "cup", 150, 5, 40, 5)
export const testFood3 = new Food(2, "85% Lean Beef", 3.0, "oz", 213, 13, 0, 22)
export const testMealFood1 = new MealFood(new MealFoodCombinedId(1, 0), testFood1, 6.0)
export const testMealFood2 = new MealFood(new MealFoodCombinedId(2, 0), testFood1, 8.0)
export const testMealFood3 = new MealFood(new MealFoodCombinedId(1, 1), testFood2, 0.5)
export const testMealFood4 = new MealFood(new MealFoodCombinedId(2, 1), testFood2, 1.5)
export const testMealFood5 = new MealFood(new MealFoodCombinedId(2, 2), testFood3, 5.0)
export const testMeal1 = new Meal(0, "Breakfast", [testMealFood1, testMealFood3])
export const testMeal2 = new Meal(1, "Lunch", [testMealFood5, testMealFood4])

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
