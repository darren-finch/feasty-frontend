interface ErrorDisplayProps {
	error: any
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = (props) => {
	return (
		<div>
			{props.error?.message ? `Error: ${props.error?.message}` : "Something went wrong. Check the error console."}
		</div>
	)
}

export default ErrorDisplay
