import React, { PropsWithChildren } from "react"
import { Button, Modal } from "react-bootstrap"
import ErrorDisplay from "../misc/ErrorDisplay"

interface EditEntityModalTemplateProps {
	show: boolean
	title: string
	closeMsg?: string
	saveMsg?: string
	footerError?: any | null
	onExited?: () => void
	onClose?: () => void
	onSaveClicked?: () => void
}

const EditEntityModalTemplate: React.FC<PropsWithChildren<EditEntityModalTemplateProps>> = (props) => {
	const { show, title, closeMsg, saveMsg, footerError, onExited, onClose, onSaveClicked } = props

	return (
		<Modal show={show} onExited={onExited} onHide={onClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>

			<Modal.Body>{props.children}</Modal.Body>

			<Modal.Footer className="d-flex align-items-center">
				{footerError && (
					<div className="w-25 flex-grow-1">
						<ErrorDisplay error={footerError} />
					</div>
				)}
				<Button variant="secondary" onClick={onClose}>
					{closeMsg ?? "Close"}
				</Button>
				<Button variant="primary" onClick={onSaveClicked}>
					{saveMsg ?? "Save Changes"}
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default EditEntityModalTemplate
