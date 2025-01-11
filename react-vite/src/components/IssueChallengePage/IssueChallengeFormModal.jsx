// import { useModal } from "../../context/Modal";

function IssueFormModal() {
  // const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // add game request
    // close modal
    // navigate to
  }

  return (
    <div>
      <h2>Issue Challenge to /Username/?</h2>
      <form onSubmit={handleSubmit}>
        <textarea placeholder='Enter Message...' rows="5"/>
        <label>
        Choose Color
        <input type="radio"/>
        <input type="radio"/>
        <input type="radio"/>
        <input type="radio"/>
        <input type="radio"/>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default IssueFormModal