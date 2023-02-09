import NiceModal, { NiceModalHocProps, useModal } from "@ebay/nice-modal-react"
import { Button, Modal } from "react-bootstrap"

export interface ConfirmationModalProps {
	title?: string
	mainMsg?: string
	confirmationButtonMsg?: string
	cancelButtonMsg?: string
	onConfirmation?: () => void
	onCancel?: () => void
}

export const ConfirmationModal = NiceModal.create<NiceModalHocProps>(() => {
	const modal = useModal("confirmation-modal")
	const args = modal.args
	const title = (args?.title as string) ?? "Are you sure?"
	const mainMsg = (args?.mainMsg as string) ?? ""
	const confirmationButtonMsg = (args?.confirmationButtonMsg as string) ?? "Okay"
	const cancelButtonMsg = (args?.cancelButtonMsg as string) ?? "Cancel"

	const handleExited = () => {
		modal.remove()
	}

	const handleCancel = () => {
		modal.reject()
		modal.hide()
	}

	const handleConfirm = () => {
		modal.resolve()
		modal.hide()
	}

	return (
		<Modal show={modal.visible} onExited={handleExited} onHide={handleCancel} centered>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>

			{mainMsg && <Modal.Body>{mainMsg}</Modal.Body>}

			<Modal.Footer>
				<Button variant="secondary" onClick={handleCancel}>
					{cancelButtonMsg}
				</Button>
				<Button variant="primary" onClick={handleConfirm}>
					{confirmationButtonMsg}
				</Button>
			</Modal.Footer>
		</Modal>
	)
})
