import { useEffect, useState } from "react";
import FabButton from "../components/FabButton";
import { NewPhotoOverlay } from "../components/NewPhotoOverlay";
import { PhotosList } from "../components/PhotosList";
import TheFooter from "../components/TheFooter";
import TheNavbar from "../components/TheNavbar";
import { PlusIcon } from "@heroicons/react/24/solid";
import GuestMessage from "../components/GuestMessage";

export default function Home() {
  const [showNewPhotoOverlay, setShowNewPhotoOverlay] = useState(false);
  const [overlayData, setOverlayData] = useState(null);

  // tolgo overflow dal body quando overlay è aperto
  useEffect(() => {
    // Devo togliere l'overflow dal body quando l'overlay è aperto
    document.body.classList.toggle("overflow-hidden", showNewPhotoOverlay);
    document.body.classList.toggle("pr-4", showNewPhotoOverlay);

    // Se il modale è stato chiuso, va resettato il overlayData
    if (!showNewPhotoOverlay) {
      setOverlayData(null);
    }
  }, [showNewPhotoOverlay]);

  function openEditOverlay(photoData) {
    setOverlayData(photoData);
    setShowNewPhotoOverlay(true);
  }

  return (
    <>
      <PhotosList onEditPhoto={openEditOverlay}></PhotosList>
      <GuestMessage></GuestMessage>
      <FabButton onClick={() => setShowNewPhotoOverlay(true)}>
        <PlusIcon className="group-hover:rotate-180 group-hover:scale-125 duration-500"></PlusIcon>
      </FabButton>

      <NewPhotoOverlay
        show={showNewPhotoOverlay}
        data={overlayData}
        onClose={() => setShowNewPhotoOverlay(false)}
      ></NewPhotoOverlay>
    </>
  );
}
