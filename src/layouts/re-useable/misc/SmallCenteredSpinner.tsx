import { Spinner } from "react-bootstrap"

const CenteredSpinner = () => {
	return (
		<div className="d-flex align-items-center justify-content-center" style={{ width: "100%", height: "100%" }}>
			<Spinner className="m-2" size="sm" />
		</div>
	)
}

export default CenteredSpinner
