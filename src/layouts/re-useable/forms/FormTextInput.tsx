import * as React from "react"
import { Form } from "react-bootstrap"
import { FormInputProps } from "./FormInputProps"

interface FormTextInputProps extends FormInputProps {
	placeholder?: string
	pattern?: string
	required?: boolean
}

const FormTextInput: React.FC<FormTextInputProps> = (props) => {
	const isValid = () => {
		const passesRequiredCheck = props.required ? (props.value ? true : false) : true
		const passesPattern = props.pattern ? RegExp(props.pattern).test(props.value) : true
		const passesValidityCheck = props.customValidityCheck ? props.customValidityCheck(props.value) : true
		return passesRequiredCheck && passesPattern && passesValidityCheck
	}

	return (
		<Form.Group id={props.id}>
			{props.label && <Form.Label>{props.label}</Form.Label>}
			<Form.Control
				type="text"
				name={props.name}
				value={props.value}
				placeholder={props.placeholder}
				onChange={(e) => props.onChange(props.name, e.target.value, isValid())}
				isValid={props.validationWasAttempted ? isValid() : undefined}
				isInvalid={props.validationWasAttempted ? !isValid() : undefined}
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
