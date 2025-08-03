import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    ModalContent
} from "@heroui/react";

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Xác nhận",
    message = "Bạn có chắc chắn muốn thực hiện hành động này?",
}) {
    return (
        <Modal
            isOpen={isOpen}
            scrollBehavior={"inside"}
            size="2xl"
            onOpenChange={onClose}
        >

            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>{title}</ModalHeader>
                        <ModalBody>
                            <p>{message}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="flat" color="gray" onPress={onClose}>
                                Hủy
                            </Button>
                            <Button variant="solid" color="danger" onPress={onConfirm}>
                                Xác nhận
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
