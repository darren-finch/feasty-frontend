import { Row, Col, Button, Form } from "react-bootstrap"

interface SearchHeaderProps {
	searchQuery: string
	onSearchQueryChange: (newSearchQuery: string) => void
	onSearchClicked: () => void
}

const SearchHeader: React.FC<SearchHeaderProps> = (props) => {
	const { searchQuery, onSearchQueryChange, onSearchClicked } = props

	return (
		<div className="d-flex align-items-center gap-2 pb-2 mb-2 border-bottom">
			<p className="d-none d-sm-block mb-0 fw-bold fs-5 flex-grow-1">Search</p>
			<div className="d-flex flex-grow-1 justify-content-between justify-content-sm-end gap-2">
				<Form.Control
					style={{ minWidth: "100px", maxWidth: "400px" }}
					type="text"
					name="searchTextInput"
					id="searchTextInput"
					placeholder="Enter a search..."
					value={searchQuery}
					onChange={(e) => onSearchQueryChange(e.target.value)}
					onKeyDown={(e) => {
						if (e.key == "Enter") {
							e.preventDefault()
							onSearchClicked()
						}
					}}
				/>
				<Button variant="outline-primary" onClick={onSearchClicked}>
					<i className="bi bi-search"></i>
				</Button>
			</div>
		</div>
	)
}

export default SearchHeader
