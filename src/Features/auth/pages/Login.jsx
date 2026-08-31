import React, { useState } from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../../../context/theme.context'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [authError, setAuthError] = useState("")
    const navigate = useNavigate()

    const validate = () => {
        const errs = {}
        const trimmedEmail = email.trim()

        if (!trimmedEmail) {
            errs.email = "Email address is required"
        } else if (!EMAIL_REGEX.test(trimmedEmail)) {
            errs.email = "Please enter a valid email address (e.g. name@domain.com)"
        }

        if (!password) {
            errs.password = "Password is required"
        } else if (password.length < 6) {
            errs.password = "Password must be at least 6 characters"
        }

        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setAuthError("")

        if (!validate()) return

        try {
            const user = await handleLogin({ email: email.trim(), password })
            if (user) {
                navigate('/')
            }
        } catch (err) {
            setAuthError(err.response?.data?.message || "Invalid email or password. Please try again.")
        }
    }

    return (
        <main className="auth-page">
            {/* Ambient background orbs */}
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>

            <div className="auth-container">
                {/* Left Showcase Hero */}
                <div className="auth-hero">
                    <div className="hero-header">
                        <div className="brand-tag">
                            <img src="/logo.png" alt="CareerLens AI" className="hero-logo-img" />
                            <span>CAREERLENS AI</span>
                        </div>
                        <h1>
                            Prepare Smarter. <span className="solar-gradient">Land Your Dream Job</span> with AI
                        </h1>
                        <p className="hero-subtitle">
                            AI-Powered Job Preparation & Career Assistant. Practice mock interviews, get a tailored resume, and close the gap between you and your goal.
                        </p>
                    </div>

                    {/* Live Career HUD / Terminal */}
                    <div className="hero-hud">
                        <div className="hud-terminal">
                            <div className="terminal-bar">
                                <div className="terminal-dots">
                                    <span></span><span></span><span></span>
                                </div>
                                <div className="terminal-title">careerlens://session/interview-prep</div>
                            </div>
                            <div className="terminal-content">
                                <div className="hud-prompt">
                                    <span className="prompt-sym">&gt;</span> careerlens.evaluate_readiness(&#123; role: "Marketing Manager" &#125;)
                                </div>
                                <div className="hud-output">
                                    "Strong communication skills identified. Resume tailored. Interview roadmap ready — focus on data-driven campaign examples."
                                </div>
                                <div className="hud-stats-grid">
                                    <div className="hud-stat-box">
                                        <div className="stat-label">Your Data</div>
                                        <div className="stat-val-highlight">100% PRIVATE 🔒</div>
                                    </div>
                                    <div className="hud-stat-box">
                                        <div className="stat-label">AI Resume PDF</div>
                                        <div className="stat-val-highlight">ENABLED ✨</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hud-badges">
                            <span>// GEMINI AI</span>
                            <span>// RESUME PDF</span>
                            <span>// ANY ROLE</span>
                        </div>
                    </div>

                    <div className="hero-footer-info">
                        <div className="engine-ver">
                            <span>●</span> 100% SECURE & FREE
                        </div>
                        <div>Your Data is Always Private</div>
                    </div>
                </div>

                {/* Right Form Card */}
                <div className="auth-form-card">
                    <div className="card-header">
                        <div className="header-top-row">
                            <div className="mobile-brand-pill">
                                <img src="/logo.png" alt="CareerLens AI" className="pill-logo-img" />
                                <span>CareerLens AI</span>
                            </div>
                            {/* Theme toggle switch */}
                            <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
                                {theme === 'dark' ? (
                                    <>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="5" />
                                            <line x1="12" y1="1" x2="12" y2="3" />
                                            <line x1="12" y1="21" x2="12" y2="23" />
                                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                            <line x1="1" y1="12" x2="3" y2="12" />
                                            <line x1="21" y1="12" x2="23" y2="12" />
                                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                        </svg>
                                        <span>Light</span>
                                    </>
                                ) : (
                                    <>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                        </svg>
                                        <span>Dark</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <h2>Welcome Back</h2>
                        <p>Sign in to access your interview reports and AI-tailored resume</p>
                    </div>

                    {authError && (
                        <div className="auth-error-banner">
                            <span>⚠</span>
                            <span>{authError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className={`input-group ${errors.email ? 'has-error' : ''}`}>
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        if (errors.email) setErrors(prev => ({ ...prev, email: "" }))
                                    }}
                                />
                            </div>
                            {errors.email && <span className="field-error-text">{errors.email}</span>}
                        </div>

                        <div className={`input-group ${errors.password ? 'has-error' : ''}`}>
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        if (errors.password) setErrors(prev => ({ ...prev, password: "" }))
                                    }}
                                />
                                <button
                                    type="button"
                                    className="toggle-pwd-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                            <line x1="2" x2="22" y1="2" y2="22"></line>
                                        </svg>
                                    ) : (
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <span className="field-error-text">{errors.password}</span>}
                        </div>

                        <button
                            type="submit"
                            className="solar-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="btn-loader"></span>
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M5 12h14"></path>
                                        <path d="m12 5 7 7-7 7"></path>
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="card-footer">
                        Don't have an account?
                        <Link to="/register">Create one for free</Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login