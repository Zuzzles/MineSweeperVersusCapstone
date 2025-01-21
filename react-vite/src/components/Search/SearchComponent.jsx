import { useState, useEffect } from 'react';
import { OpenModalMenuItem } from "../Navigation";
import FriendRequestModal from './FriendRequestModal';
import IssueChallengeFormModal from '../IssueChallengePage/IssueChallengeFormModal'
import './Search.css'

function SearchComponent({ data, friend }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const filtered = data?.filter(item => 
      item.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  return (
    <div className='search-box'>
      {friend ? (
        <h2>Search Friend by Username</h2>
      ) : (
        <h2>Search Opponent by Username</h2>
      )}
      <input
        type="text"
        placeholder="Type Username Here..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredData?.map((item, i) => (
          friend ? (
            <OpenModalMenuItem 
              key={i}
              modalComponent={<FriendRequestModal user={item}/>}
              itemText={item.username}
            />
          ) : (
            <OpenModalMenuItem 
              key={i}
              modalComponent={<IssueChallengeFormModal user={item}/>}
              itemText={item.username}
            />
          )
        ))}
      </ul>
    </div>
  );
}

export default SearchComponent;