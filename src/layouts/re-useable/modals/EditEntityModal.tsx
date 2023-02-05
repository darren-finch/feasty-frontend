import React, { PropsWithChildren } from "react"
import { Button, Modal } from "react-bootstrap"

interface EditEntityModalProps {
	show: boolean
	title: string
	onExited?: () => void
	onClose?: () => void
	onSaveClicked?: () => void
}

const EditEntityModal: React.FC<PropsWithChildren<EditEntityModalProps>> = (props) => {
	const { show, title, onExited, onClose, onSaveClicked } = props

	return (
		<Modal show={show} onExited={onExited} onHide={onClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>

			<Modal.Body>{props.children}</Modal.Body>

			<Modal.Footer>
				<Button variant="secondary" onClick={onClose}>
					Close
				</Button>
				<Button variant="primary" onClick={onSaveClicked}>
					Save changes
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default EditEntityModal
