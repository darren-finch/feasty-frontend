import React, { PropsWithChildren } from "react"
import { Button, Modal } from "react-bootstrap"

interface EditEntityModalProps {
	show: boolean
	title: string
	onCloseClicked: () => void
	onSaveClicked: () => void
}

const EditEntityModal: React.FC<PropsWithChildren<EditEntityModalProps>> = (props) => {
	const { show, title, onCloseClicked, onSaveClicked } = props

	return (
		<Modal show={show} onHide={onCloseClicked} centered>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>

			<Modal.Body>{props.children}</Modal.Body>

			<Modal.Footer>
				<Button variant="secondary" onClick={onCloseClicked}>
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
