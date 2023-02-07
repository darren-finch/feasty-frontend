import React, { PropsWithChildren } from "react"
import { Button, Modal } from "react-bootstrap"

interface EditEntityModalProps {
	show: boolean
	title: string
	closeMsg?: string
	saveMsg?: string
	footerErrorMsg?: string | null
	onExited?: () => void
	onClose?: () => void
	onSaveClicked?: () => void
}

const EditEntityModal: React.FC<PropsWithChildren<EditEntityModalProps>> = (props) => {
	const { show, title, closeMsg, saveMsg, footerErrorMsg, onExited, onClose, onSaveClicked } = props

	return (
		<Modal show={show} onExited={onExited} onHide={onClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>

			<Modal.Body>{props.children}</Modal.Body>

			<Modal.Footer>
				{footerErrorMsg && <p className="text-danger flex-grow-1">{footerErrorMsg}</p>}
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

export default EditEntityModal
