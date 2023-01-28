import React from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import SearchableFoodsList from "../re-useable/SearchableFoodsList"

const ViewFoods: React.FC = () => {
	return (
		<Container>
			<Row className="my-4">
				<Col>
					<h1>Foods</h1>
				</Col>
				<Col className="d-flex align-items-center justify-content-end">
					<Button>
						<i className="bi bi-plus-lg"></i>
					</Button>
				</Col>
			</Row>
			<SearchableFoodsList />
		</Container>
	)
}

export default ViewFoods
