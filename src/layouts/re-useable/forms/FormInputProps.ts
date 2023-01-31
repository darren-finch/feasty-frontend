export interface FormInputProps {
	id: string
	name: string
	value: string
	onChange: (inputName: string, newInputValue: string, newInputValueIsValid: boolean) => void
	label?: string
	validationWasAttempted?: boolean
	customValidityCheck?: (inputValue: string) => boolean
	error?: string
}
