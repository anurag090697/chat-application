import React, { useState } from 'react'
import './Home.css';
import FriendsList from './FriendsList.jsx';
import OthersList from './OthersList.jsx';
import SentRequestList from './SentRequestList.jsx'
import ReceivedRequestedList from './ReceivedRequestedList.jsx';
import Chat from './Chat.jsx';

const Home = ({user}) => {
  const [tabName, setTabName] = useState('friends');
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  return (
    <div className="container">
      <div className="left-side">
        <div className="tool-bar">
          <h3 className={'friends' == tabName ? 'selected-tab tools' : 'tools'} onClick={() => setTabName('friends')}>Friends</h3>
          <h3 className={'sent-request' == tabName ? 'selected-tab tools' : 'tools'} onClick={() => setTabName('sent-request')}>Sent Request</h3>
          <h3 className={'received-request' == tabName ? 'selected-tab tools' : 'tools'} onClick={() => setTabName('received-request')}>Received Request</h3>
          <h3 className={'others' == tabName ? 'selected-tab tools' : 'tools'} onClick={() => setTabName('others')}>Others</h3>
        </div>
        <div>
          {tabName === 'friends' && <FriendsList setSelectedFriendId={setSelectedFriendId} user={user} selectedFriendId={selectedFriendId} />}
        </div>
      </div>
      <div className="right-side">
        {
          tabName === 'friends' ? <Chat selectedFriendId={selectedFriendId} user={user}/> :
            tabName === 'sent-request' ? <SentRequestList /> :
              tabName === 'received-request' ? <ReceivedRequestedList /> :
                <OthersList />
        }
      </div>
    </div>
  )
}

export default Home