interface ErrorDisplayProps {
	error: any
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = (props) => {
	// Error may actually be an error or it could be a string
	let finalErrorMsg = "Something went wrong. Check the error console."
	if (props.error) {
		if (props.error.message) {
			finalErrorMsg = props.error.message
		} else {
			finalErrorMsg = props.error
		}
	}
	return <p className="text-danger">{finalErrorMsg.toString()}</p>
}

export default ErrorDisplay
