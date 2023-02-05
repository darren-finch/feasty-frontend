import { ReactNode } from "react"
import { Accordion, Spinner } from "react-bootstrap"
import ErrorDisplay from "../misc/ErrorDisplay"
import NoResultsDisplay from "../misc/NoResultsDisplay"
import SearchHeader from "../misc/SearchHeader"

interface SearchableAccordionListProps {
	elementList: ReactNode[]
	isLoading: boolean
	error: string | null
	searchQuery: string
	onSearchQueryChange: (newSearchQuery: string) => void
	onSearchClicked: () => void
}

const SearchableAccordionList: React.FC<SearchableAccordionListProps> = (props) => {
	const { elementList, searchQuery, error, isLoading, onSearchQueryChange, onSearchClicked } = props

	const isError = error != null && error != ""

	return (
		<div>
			<SearchHeader
				searchQuery={searchQuery}
				onSearchQueryChange={onSearchQueryChange}
				onSearchClicked={onSearchClicked}
			/>
			<Accordion>
				{isLoading && <Spinner className="my-2" />}
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

export default SearchableAccordionList
