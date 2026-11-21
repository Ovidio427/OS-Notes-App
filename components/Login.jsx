'use client'

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/firebase"

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isRegister, setIsRegister] = useState(false)
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const [authError, setAuthError] = useState('')

    const { login, signup } = useAuth()
    const router = useRouter()

    const cantAuth = !email.includes('@') || password.length < 6

    async function handleAuthUser() {
    if (cantAuth) {
        return
    }

    setIsAuthenticating(true)
    setAuthError('')

    try {
        if (isRegister) {
            await signup(email, password)
        } else {
            await login(email, password)
        }

        router.push('/notes')

    } catch (err) {
        console.error('Login error:', err)
        setAuthError(err.message)

    } finally {
        setIsAuthenticating(false)
    }
}

    async function handleForgotPassword() {
        if (!email.includes('@')) {
            alert('Please enter your email address first.')
            return
        }

        try {
            await sendPasswordResetEmail(auth, email.trim())

            alert('Password reset email sent! Check your inbox.')
        } catch (err) {
            console.error(err)
            alert('Unable to send password reset email. Please try again.')
        }
    }


    return (
        <>
            <div className="login-container">
                <h1 className="text-gradient">OSNOTES</h1>
                <h2>Organized note taking made easy</h2>
                <p>Build your very own archinve of easily navigated and indexed information and notes.</p>
                <div className="full-line"></div>
                <h6>{isRegister ? 'Create an account' : 'Log in'}</h6>
                <div>
                    <p>Email</p>
                    <input value={email} onChange={(e) => {
                        setEmail(e.target.value)
                    }} type="text" placeholder="Enter your email address" />
                </div>
                <div>
                    <p>Password</p>
                    <input value={password} onChange={(e) => {
                        setPassword(e.target.value)
                    }} type="password" placeholder="*******" />
                </div>
                <button onClick={handleAuthUser} disabled={cantAuth || isAuthenticating} className="submit-btn">
                    <h6>{isAuthenticating ? 'Submitting...' : 'Submit'}</h6>
                </button>
                {authError && ( <p style={{ color: 'red' }}>{authError}</p> )}
                <div className="secondary-btns-container">
                    <button onClick={() => {
                        setIsRegister(!isRegister)
                    }} className="card-button-secondary">
                        <small>{isRegister ? 'Log in' : 'Sign up'}</small>
                    </button>
                    {!isRegister && (
                        <button
                            onClick={handleForgotPassword}
                            className="card-button-secondary"
                        >
                            <small>Forgot password?</small>
                        </button>
                    )}
                </div>
                <div className="full-line"></div>
                <footer>
                </footer>
            </div>
        </>
    )
}