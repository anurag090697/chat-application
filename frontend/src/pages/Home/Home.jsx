import React, { useState } from 'react'
import './Home.css';
import FriendsList from './FriendsList.jsx';
import OthersList from './OthersList.jsx';
import RequestList from './RequestList.jsx'

const Home = () => {
  const [tabName, setTabName] = useState('friends');

  return (
    <div className="container">
      <div className="left-side">
        <div className="tool-bar">
          <h3 className={'friends' == tabName ? 'selected-tab tools' : 'tools'} onClick={() => setTabName('friends')}>Friends</h3>
          <h3 className={'request' == tabName ? 'selected-tab tools' : 'tools'} onClick={() => setTabName('request')}>Request</h3>
          <h3 className={'others' == tabName ? 'selected-tab tools' : 'tools'} onClick={() => setTabName('others')}>Others</h3>
        </div>
      </div>
      <div className="right-side">
        {
          tabName === 'friends' ? <FriendsList /> :
            tabName === 'request' ? <RequestList /> :
              <OthersList />
        }
      </div>
    </div>
  )
}

export default Home