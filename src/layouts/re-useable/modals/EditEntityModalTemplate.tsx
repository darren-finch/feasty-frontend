import React, { PropsWithChildren } from "react"
import { Button, Modal, Spinner } from "react-bootstrap"
import CenteredSpinner from "../misc/CenteredSpinner"
import ErrorDisplay from "../misc/ErrorDisplay"

interface EditEntityModalTemplateProps {
	show: boolean
	title: string
	isLoading?: boolean
	footerError?: any | null
	closeMsg?: string
	saveMsg?: string
	// These default to true
	disableCancelWhileLoading?: boolean
	disableSaveWhileLoading?: boolean
	disableCancelWhileError?: boolean
	disableSaveWhileError?: boolean
	onClose?: () => void
	onSaveClicked?: () => void
	onExited?: () => void
}

const EditEntityModalTemplate: React.FC<PropsWithChildren<EditEntityModalTemplateProps>> = (props) => {
	const {
		show,
		title,
		closeMsg,
		saveMsg,
		isLoading,
		footerError,
		onExited,
		onClose,
		onSaveClicked,
		disableCancelWhileLoading,
		disableSaveWhileLoading,
		disableCancelWhileError,
		disableSaveWhileError,
	} = props

	const closeButtonIsDisabled =
		((disableCancelWhileLoading ?? true) && isLoading) || ((disableCancelWhileError ?? true) && footerError)

	const saveButtonIsDisabled =
		((disableSaveWhileLoading ?? true) && isLoading) || ((disableSaveWhileLoading ?? true) && footerError)

	return (
		<Modal show={show} onExited={onExited} onHide={onClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>

			{isLoading && <CenteredSpinner />}
			{!isLoading && <Modal.Body>{props.children}</Modal.Body>}

			<Modal.Footer className="d-flex align-items-center">
				{footerError && (
					<div className="w-25 flex-grow-1">
						<ErrorDisplay error={footerError} />
					</div>
				)}
				<Button variant="secondary" onClick={onClose} disabled={closeButtonIsDisabled}>
					{closeMsg ?? "Close"}
				</Button>
				<Button variant="primary" onClick={onSaveClicked} disabled={saveButtonIsDisabled}>
					{saveMsg ?? "Save Changes"}
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default EditEntityModalTemplate
