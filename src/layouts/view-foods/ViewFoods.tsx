import React from "react"
import SearchableFoodsList from "../re-useable/SearchableFoodsList"

const ViewFoods: React.FC = () => {
	return (
		<div className="container">
			<div className="row my-4">
				<div className="col">
					<h1>Foods</h1>
				</div>
				<div className="col d-flex align-items-center justify-content-end">
					<div className="btn btn-primary">
						<i className="bi bi-plus-lg"></i>
					</div>
				</div>
			</div>
			<SearchableFoodsList />
		</div>
	)
}

export default ViewFoods
