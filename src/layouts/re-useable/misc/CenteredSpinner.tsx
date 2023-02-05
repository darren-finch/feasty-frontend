import { Spinner } from "react-bootstrap"

const CenteredSpinner = () => {
	return (
		<div
			className="z-1 d-flex align-items-center justify-content-center"
			style={{ width: "100vw", height: "100vh" }}>
			<Spinner className="mx-auto my-auto" />
		</div>
	)
}

export default CenteredSpinner
