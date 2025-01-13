import { OpenModalMenuItem } from "../Navigation";
import IssueFormModal from "./IssueChallengeFormModal";

function IssuePage() {
  return (
    <div>
      <div className="challenge-requests">
        <h2>Choose Opponent</h2>
        <ul>
          Placeholder list
          <OpenModalMenuItem 
          modalComponent={<IssueFormModal />}
          itemText="Placeholder Text"
          /> {/*Tester*/}
        </ul>
      </div>
      <div>
        <h2>Search Opponent by Username</h2>
        <form>
          <input />
          <button type="submit">Find Friend</button>
        </form>
        <div>
          <h3>Results</h3>
          <ul>
            Placeholder list
          </ul>
        </div>
      </div>
    </div>
  )
}

export default IssuePage;