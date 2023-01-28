import * as React from "react"
import { Food } from "../../../models/Food"

interface FoodCardProps {
	food: Food
}

const FoodCard: React.FC<FoodCardProps> = (props) => {
	const { food } = props

	return (
		<div className="accordion-item border-0 my-4">
			<div
				className="accordion-header border border-primary border-width-2 rounded"
				id={`flush-food-item-heading-${food.id}`}>
				<div className="py-3 px-4 gap-4 d-flex align-items-center">
					<p className="flex-grow-1 my-0">{food.title}</p>
					<button className="btn btn-outline-primary py-1 px-2 py-lg-3 px-lg-4">
						<span className="bi bi-pencil-fill"></span>
					</button>
					<button className="btn btn-outline-primary py-1 px-2 py-lg-3 px-lg-4">
						<span className="bi bi-trash"></span>
					</button>
					<button
						style={{ width: "auto" }}
						className="accordion-button py-1 px-2 py-lg-3 px-lg-4 collapsed"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target={`#flush-food-item-${food.id}`}
						aria-expanded="false"
						aria-controls={`#flush-food-item-${food.id}`}></button>
				</div>
			</div>
			<div
				id={`flush-food-item-${food.id}`}
				className="border-width-2 border-primary border-bottom border-start border-end rounded-bottom accordion-collapse collapse"
				aria-labelledby={`#flush-food-item-heading-${food.id}`}
				data-bs-parent="#foodsAccordion">
				<div className="accordion-body">
					{`${food.calories} calories - ${food.fats} fats - ${food.carbs} carbs - ${food.proteins} proteins`}
				</div>
			</div>
		</div>
	)
}

export default FoodCard
