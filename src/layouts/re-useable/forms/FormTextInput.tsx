import * as React from "react"
import { Form } from "react-bootstrap"
import { FormInputProps } from "./FormInputProps"

interface FormTextInputProps extends FormInputProps {
	maxInputWidth?: string
	placeholder?: string
	pattern?: string
	required?: boolean
}

const FormTextInput: React.FC<FormTextInputProps> = (props) => {
	const isValid = (value?: string) => {
		const passesRequiredCheck = props.required ? (value ? true : false) : true
		const passesPattern = value && props.pattern ? RegExp(props.pattern).test(value) : true
		const passesValidityCheck = value && props.customValidityCheck ? props.customValidityCheck(value) : true
		return passesRequiredCheck && passesPattern && passesValidityCheck
	}

	return (
		<Form.Group id={props.id}>
			{props.label && <Form.Label>{props.label}</Form.Label>}
			<Form.Control
				style={{ maxWidth: props.maxInputWidth }}
				type="text"
				name={props.name}
				value={props.value}
				placeholder={props.placeholder}
				onChange={(e) => props.onChange(props.name, e.target.value, isValid(e.target.value))}
				isValid={props.validationWasAttempted ? isValid(props.value) : undefined}
				isInvalid={props.validationWasAttempted ? !isValid(props.value) : undefined}
				onKeyDown={(e) => {
					if (e.key == "Enter") {
						e.preventDefault()
					}
				}}
			/>
			<Form.Control.Feedback type="invalid">{props.error}</Form.Control.Feedback>
		</Form.Group>
	)
}

export default FormTextInput
