export const calculateMacroNutrientsForDesiredQuantity = (
	baseCalories: number,
	baseFats: number,
	baseCarbs: number,
	baseProteins: number,
	baseQuantity: number,
	desiredQuantity: number
): { calories: number; fats: number; carbs: number; proteins: number } => {
	const ratioOfBaseQuantityToDesiredQuantity = baseQuantity / desiredQuantity

	const newCalories = baseCalories / ratioOfBaseQuantityToDesiredQuantity
	const newFats = baseFats / ratioOfBaseQuantityToDesiredQuantity
	const newCarbs = baseCarbs / ratioOfBaseQuantityToDesiredQuantity
	const newProteins = baseProteins / ratioOfBaseQuantityToDesiredQuantity

	return {
		calories: newCalories,
		fats: newFats,
		carbs: newCarbs,
		proteins: newProteins,
	}
}
