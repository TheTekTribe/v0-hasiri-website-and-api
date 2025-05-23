"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordForm() {
  const { resetPassword } = useAuth()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setIsLoading(true)
      const { error } = await resetPassword(data.email)
      
      if (error) {
        toast({
          title: 'Password reset failed',
          description: error.message || 'Please check your email and try again.',
          variant: 'destructive',
        })
        return
      }
      
      setIsSubmitted(true)
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for a link to reset your password.',
      })
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="space-\
