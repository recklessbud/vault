import { useQuery } from "@tanstack/react-query";
import {getUserInfo} from '@/api/auth.api'
import React from 'react'


export const UserQuery = () => {
    const userQuery = useQuery({
        queryKey: ['users'],
        queryFn: () => getUserInfo()
    })

    const userDetails = userQuery.data ?? []
  return (
    <>
   <span className="bg-gradient-to-r from-cosmic-400 to-nebula-400 bg-clip-text text-transparent">{userDetails?.username}</span>
   {/* <span className="bg-gradient-to-r from-cosmic-400 to-nebula-400 bg-clip-text text-transparent">{userDetails?}</span> */}

   </>
  )
}

 