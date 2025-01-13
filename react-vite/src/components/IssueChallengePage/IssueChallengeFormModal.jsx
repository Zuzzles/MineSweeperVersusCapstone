// import { useModal } from "../../context/Modal";

function IssueFormModal() {
  // const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // add game request
    // close modal
    // navigate to
  }

  // Colors:
  //    #4D9DE0 Celestial blue
  //    #E15554 Indian red
  //    #E1BC29 Saffron
  //    #3BB273 Jade
  //    #7768AE Royal purple

  return (
    <div>
      <h2>Issue Challenge to /Username/?</h2>
      <form onSubmit={handleSubmit}>
        <label>
        Choose Color
        <input type="radio"/>
        <input type="radio"/>
        <input type="radio"/>
        <input type="radio"/>
        <input type="radio"/>
        </label>
        <button type="submit">Challenge</button>
      </form>
    </div>
  )
}

export default IssueFormModal