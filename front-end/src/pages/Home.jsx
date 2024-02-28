import { PhotosList } from "../components/PhotosList";
import TheFooter from "../components/TheFooter";
import TheNavbar from "../components/TheNavbar";

import GuestMessage from "../components/GuestMessage";

export default function Home() {
  return (
    <>
      <PhotosList></PhotosList>
      <GuestMessage></GuestMessage>
    </>
  );
}
