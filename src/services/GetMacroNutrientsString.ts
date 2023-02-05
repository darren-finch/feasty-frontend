export const getMacroNutrientsString = (calories: number, fats: number, carbs: number, proteins: number): string => {
	return `${Math.round(calories)} cal - ${Math.round(fats)}F - ${Math.round(carbs)}C - ${Math.round(proteins)}P`
}
