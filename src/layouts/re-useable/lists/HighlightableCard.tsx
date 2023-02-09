import { Card } from "react-bootstrap"

interface HighlightableCardProps {
	id: number
	title: string
	active: boolean
	onCardClicked: (id: number) => void
}

const HighlightableCard: React.FC<HighlightableCardProps> = (props) => {
	return (
		<Card
			key={props.id}
			className={`${
				props.active ? "bg-primary" : ""
			} my-2 user-select-none list-item-margin-fix card-bg-transition`}
			style={{ cursor: "pointer" }}
			onClick={() => props.onCardClicked(props.id)}
			onBlur={() => {}}>
			<Card.Body>{props.title}</Card.Body>
		</Card>
	)
}

export default HighlightableCard
