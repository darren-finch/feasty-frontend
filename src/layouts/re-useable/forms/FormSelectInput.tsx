import * as React from "react"
import { Form } from "react-bootstrap"
import { FormInputProps } from "./FormInputProps"

interface FormSelectProps extends FormInputProps {
	options: FormSelectOption[]
}

export class FormSelectOption {
	private _id: string
	private _label: string
	private _value: string

	constructor(id: string, label: string, value: string) {
		this._id = id
		this._label = label
		this._value = value
	}

	public get id(): string {
		return this._id
	}
	public get label(): string {
		return this._label
	}
	public get value(): string {
		return this._value
	}
}

export const FormSelectInput: React.FC<FormSelectProps> = (props) => {
	const isValid = () => {
		const passesValidityCheck = props.customValidityCheck ? props.customValidityCheck(props.value) : true
		return passesValidityCheck
	}

	return (
		<Form.Group id={props.id}>
			{props.label && <Form.Label>{props.label}</Form.Label>}
			<Form.Select
				name={props.name}
				value={props.value}
				onChange={(e) => props.onChange(props.name, e.target.value, isValid())}
				isValid={props.validationWasAttempted ? isValid() : undefined}
				isInvalid={props.validationWasAttempted ? !isValid() : undefined}>
				{props.options.map((option) => (
					<option key={option.id} value={option.value}>
						{option.label}
					</option>
				))}
			</Form.Select>
			<Form.Control.Feedback type="invalid">{props.error}</Form.Control.Feedback>
		</Form.Group>
	)
}
