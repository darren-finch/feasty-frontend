import { ReactNode } from "react"
import { Accordion } from "react-bootstrap"
import CenteredSpinner from "../misc/CenteredSpinner"
import ErrorDisplay from "../misc/ErrorDisplay"
import NoResultsDisplay from "../misc/NoResultsDisplay"

interface AccordionListProps {
	elementList: ReactNode[]
	isLoading: boolean
	error: string | null
}

const AccordionList: React.FC<AccordionListProps> = (props) => {
	const { elementList, error, isLoading } = props

	const isError = error != null && error != ""

	return (
		<div>
			<Accordion
				onScroll={(e) => {
					e.stopPropagation()
				}}>
				{isLoading && <CenteredSpinner />}
				{isError && (
					<div className="my-2">
						<ErrorDisplay error={error} />
					</div>
				)}
				{!isLoading && !isError && elementList.length < 1 && (
					<div className="my-2">
						<NoResultsDisplay />
					</div>
				)}
				{!isLoading && !isError && elementList.length > 0 && elementList}
			</Accordion>
		</div>
	)
}

export default AccordionList
