import CoverNotAvailable from "../assets/CoverNotAvailable.png";
const handleCoverError = (event) => {
  event.target.src = CoverNotAvailable;
};
export default handleCoverError;