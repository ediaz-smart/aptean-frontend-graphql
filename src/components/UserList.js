import React, { useState, useEffect } from 'react';
import usersAction from '../actions/usersAction';
export default function UserList(props) {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetchData();
        async function fetchData() {
            // You can await here
            await usersAction().then(resp => {
                let userData = resp && resp.data && resp.data.data ? resp.data.data : [];
                if (userData && userData.length > 0) {
                    setUsers(userData)
                }
            });
        }

    }, [])
    console.log('users', users, users.length)

    return (
        <div>
            hi
            <ul>
                {
                    users && users.length > 0 && users.map((item, index) => {
                        return <li key={index}>
                            {item.email}
                        </li>
                    })
                }
            </ul>
        </div>
    )
}