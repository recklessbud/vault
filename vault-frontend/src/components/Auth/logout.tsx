import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/api/auth.api'
import { useToast } from '@/hooks/use-toast'
import { Button } from '../ui/button'
import { LogOut } from 'lucide-react'

const Logout = () => {
  const {toast} = useToast()
  const navigate = useNavigate()
  // const token = localStorage.getItem("accessToken");

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate('/auth')
    },
    onError: () => {
      toast({
        title: "Logout Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  })
  const handleForm = (e: React.FormEvent) => {
    e.preventDefault()
    logoutMutation.mutate()
  }
  return (
    <div>
      <form onSubmit={handleForm}>
        <input type="submit" value="Logout" />
      </form>


    </div>
  )
}

export default Logout