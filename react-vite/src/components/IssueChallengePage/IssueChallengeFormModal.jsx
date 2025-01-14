// import { useModal } from "../../context/Modal";

// Colors:
//    #4D9DE0 Celestial blue
//    #E15554 Indian red
//    #E1BC29 Saffron
//    #3BB273 Jade
//    #7768AE Royal purple

//TODO: set up route to make game challenge
//TODO: CSS styling
//TODO: fix radio input colors

function IssueFormModal({ user }) {
  // const { closeModal } = useModal();
  const colors = ['#4D9DE0', '#E15554', '#E1BC29', '#3BB273', '#7768AE']

  const handleSubmit = async (e) => {
    e.preventDefault();
    // add game request
    // close modal
    // navigate to
  }

  return (
    <div>
      <h2>{`Issue Challenge to ${user?.username}?`}</h2>
      <form onSubmit={handleSubmit}>
        <label>
        Choose Color
        {colors.map((color, i) => (
          <input key={i} type="radio" value={color} name="colorPick" style={{'accent-color': `${color}`, 'outline': `5px solid ${color}`}}/>
        ))}
        </label>
        <button type="submit">Challenge</button>
      </form>
    </div>
  )
}

export default IssueFormModal