import React from 'react'

const RequestList = () => {
    const [requestList, setRequestList] = useState([]);
    useEffect(() => {
        const fetchRequestList = async () => {
            const response = await axios.get('http://localhost:3000/user/all-requests', {
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('token')
                }
            });
            setRequestList(response.data.requests);
            console.log(response.data);
        }
        fetchRequestList();
    }, []);
    return (
        <>
            {
                requestList.length == 0 ?
                    <h1>No Request Found</h1> :
                    <div>
                        {
                            requestList.map(
                                user => <h1>{user.username}</h1>
                            )
                        }
                    </div>
            }
        </>
    )
}

export default RequestList