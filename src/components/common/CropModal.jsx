import { useState } from "react";
import { ModalBody, ModalFooter, Modal, ModalContent, ModalHeader } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { ImageLoading } from ".";
import getCroppedImg from "@/utils/image";
import Cropper from "react-easy-crop";

const CropModal = ({ cancelable, isOpen, aspect, onOpenChange, onChange, onDelete, imageSrc }) => {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <Modal
      isOpen={isOpen}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      onOpenChange={onOpenChange}
      hideCloseButton
      size="2xl"
      placement="center"
      classNames={{
        wrapper: "border-1",
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 backdrop-blur-md",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="border-b-1">Cắt ảnh</ModalHeader>
            <ModalBody className="flex justify-center items-center">
              <div className="w-[300px] sm:w-[600px] h-[300px] sm:h-[400px] relative">
                <ImageLoading src={imageSrc}>
                  {(loadingClassName) =>
                    loadingClassName ? (
                      <div className="w-full h-full grid place-items-center">
                        <Spinner variant="wave" />
                      </div>
                    ) : (
                      <Cropper
                        cropShape={aspect === 1 ? "round" : "rect"}
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onCropComplete={handleCropComplete}
                        onZoomChange={setZoom}
                        zoomSpeed={0.1}
                        classes={{
                          containerClassName: `rounded-xl w-full `,
                          mediaClassName: `w-auto h-full`,
                        }}
                      />
                    )
                  }
                </ImageLoading>
              </div>
            </ModalBody>
            <ModalFooter className="border-t-1">
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  if (!cancelable) onDelete();
                  onClose();
                }}
              >
                Hủy
              </Button>
              <Button
                color="primary"
                onPress={async () => {
                  const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
                  onChange(croppedImage);
                  onClose();
                }}
              >
                Lưu
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CropModal;
