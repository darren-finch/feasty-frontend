import { ReactNode, useContext } from "react"
import { Accordion, AccordionContext, Button, Card, useAccordionButton } from "react-bootstrap"

interface SearchableAccordionListElementProps<T> {
	entityId: number
	entity: T
	headerElements: ReactNode | ReactNode[]
	bodyElements: ReactNode | ReactNode[]
	showDropdownAtLargeScreenSize?: boolean
	onEditEntityClicked: (selectedEntity: T) => void
	onDeleteEntityClicked: (selectedEntityId: number) => void
}

const SearchableAccordionListElement = <T extends object>(props: SearchableAccordionListElementProps<T>) => {
	const {
		entityId,
		entity,
		headerElements,
		bodyElements,
		showDropdownAtLargeScreenSize,
		onEditEntityClicked,
		onDeleteEntityClicked,
	} = props
	const { activeEventKey } = useContext(AccordionContext)
	const onAccordionButtonClicked = useAccordionButton(entityId.toString(), () => {})

	const isCurrentlyOpen = activeEventKey === entityId.toString()

	return (
		<Card className="my-4">
			<Card.Header className="d-flex">
				<div className="w-100 py-2 gap-3 gap-lg-4 d-flex align-items-center">
					<div className="flex-grow-1">{headerElements}</div>
					<Button onClick={() => onEditEntityClicked(entity)} variant="outline-primary">
						<i className="bi bi-pencil-fill"></i>
					</Button>
					<Button onClick={() => onDeleteEntityClicked(entityId)} variant="outline-primary">
						<i className="bi bi-trash"></i>
					</Button>
					<Button
						className={`${
							showDropdownAtLargeScreenSize == null || showDropdownAtLargeScreenSize == true
								? ""
								: "d-lg-none"
						}`}
						onClick={onAccordionButtonClicked}
						variant="outline-primary">
						<i className={`bi bi-chevron-${isCurrentlyOpen ? "up" : "down"}`}></i>
					</Button>
				</div>
			</Card.Header>
			<Accordion.Collapse eventKey={entityId.toString()}>
				<Card.Body
					className={`${
						showDropdownAtLargeScreenSize == null || showDropdownAtLargeScreenSize == true
							? ""
							: "d-lg-none"
					}`}>
					{bodyElements}
				</Card.Body>
			</Accordion.Collapse>
		</Card>
	)
}

export default SearchableAccordionListElement
