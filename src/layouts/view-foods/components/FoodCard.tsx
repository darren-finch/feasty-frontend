import { Food } from "../../../data/food/Food"
import { useContext } from "react"
import { AccordionContext, Button } from "react-bootstrap"
import Accordion from "react-bootstrap/Accordion"
import { useAccordionButton } from "react-bootstrap/AccordionButton"
import Card from "react-bootstrap/Card"

interface FoodCardProps {
	food: Food
	onEditFoodClicked: (selectedFood: Food) => void
	onDeleteFoodClicked: (selectedFoodId: number) => void
}

const FoodCard: React.FC<FoodCardProps> = (props) => {
	const { food, onEditFoodClicked, onDeleteFoodClicked } = props
	const { activeEventKey } = useContext(AccordionContext)
	const onAccordionButtonClicked = useAccordionButton(food.id.toString(), () => {})

	const isCurrentlyOpen = activeEventKey === food.id.toString()

	return (
		<Card className="my-4">
			<Card.Header className="d-flex">
				<div className="w-100 py-3 px-4 gap-4 d-flex align-items-center">
					<p className="mb-0 flex-grow-1">{food.title}</p>
					<Button onClick={() => onEditFoodClicked(food)} variant="outline-primary">
						<i className="bi bi-pencil-fill"></i>
					</Button>
					<Button onClick={() => onDeleteFoodClicked(food.id)} variant="outline-primary">
						<i className="bi bi-trash"></i>
					</Button>
					<Button onClick={onAccordionButtonClicked} variant="outline-primary">
						<i className={`bi bi-chevron-${isCurrentlyOpen ? "up" : "down"}`}></i>
					</Button>
				</div>
			</Card.Header>
			<Accordion.Collapse eventKey={food.id.toString()}>
				<Card.Body>{`${food.calories} calories - ${food.fats} fats - ${food.carbs} carbs - ${food.proteins} proteins`}</Card.Body>
			</Accordion.Collapse>
		</Card>
	)
}

export default FoodCard
