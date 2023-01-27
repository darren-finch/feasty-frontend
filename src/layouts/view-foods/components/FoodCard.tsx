import * as React from "react"
import { Food } from "../../../models/Food"

interface FoodCardProps {
	food: Food
}

const FoodCard: React.FC<FoodCardProps> = (props) => {
	const { food } = props

	return (
		<div className="accordion-item">
			<h2 className="accordion-header" id={`flush-food-item-heading-${food.id}`}>
				<button
					className="accordion-button collapsed"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target={`flush-food-item-${food.id}`}
					aria-expanded="false"
					aria-controls={`flush-food-item-${food.id}`}>
					{`${food.title}`}
				</button>
			</h2>
			<div
				id={`flush-food-item-${food.id}`}
				className="accordion-collapse collapse"
				aria-labelledby={`flush-food-item-heading-${food.id}`}
				data-bs-parent="#foodsAccordion">
				<div className="accordion-body">
					{`${food.calories} calories - ${food.fats} fats - ${food.carbs} carbs - ${food.proteins} proteins`}
				</div>
			</div>
		</div>
	)
}

export default FoodCard
