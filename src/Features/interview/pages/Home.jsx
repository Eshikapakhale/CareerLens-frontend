import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { useTheme } from '../../../context/theme.context'
import ReportsModal from '../components/ReportsModal'
import axios from 'axios'
import "../style/home.scss"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

const Home = () => {
    const navigate = useNavigate()
    const { user, handleLogout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const [title, setTitle] = useState("")
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeFile, setResumeFile] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [error, setError] = useState("")
    const [reportsModalOpen, setReportsModalOpen] = useState(false)
    const fileInputRef = useRef(null)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file && file.type === "application/pdf") {
            setResumeFile(file)
            setError("")
        } else if (file) {
            setError("Only PDF files are accepted")
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file && file.type === "application/pdf") {
            setResumeFile(file)
            setError("")
        } else if (file) {
            setError("Only PDF files are accepted")
        }
    }

    const handleGenerate = async (e) => {
        e.preventDefault()
        if (!resumeFile) return setError("Please upload your resume PDF")
        if (!jobDescription.trim()) return setError("Please enter the job description")
        if (!selfDescription.trim()) return setError("Please describe yourself")

        setLoading(true)
        setError("")
        setReport(null)

        try {
            const formData = new FormData()
            formData.append("title", title)
            formData.append("resume", resumeFile)
            formData.append("jobDescription", jobDescription)
            formData.append("selfDescription", selfDescription)

            const response = await api.post("/api/interview", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            const createdReport = response.data.interviewReport
            if (createdReport?._id) {
                navigate(`/interview/${createdReport._id}`, { state: { report: createdReport } })
            } else {
                setReport(createdReport)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate report. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const getSeverityColor = (severity) => {
        switch (severity) {
            case "high": return "#ff6b6b"
            case "medium": return "#ffd43b"
            case "low": return "#69db7c"
            default: return "#adb5bd"
        }
    }

    return (
        <main className='home'>
            {/* Ambient background orbs */}
            <div className='orb orb-1'></div>
            <div className='orb orb-2'></div>
            <div className='orb orb-3'></div>

            {/* Navbar */}
            <nav className='glass-nav'>
                <div className='nav-brand'>
                    <img src="/logo.png" alt="CareerLens AI Logo" className='nav-logo-img' />
                    <span>CareerLens AI</span>
                </div>
                <div className='nav-actions'>
                    {/* My Reports Button */}
                    <button
                        className='my-reports-nav-btn'
                        onClick={() => setReportsModalOpen(true)}
                        title="View All My Reports"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        <span>My Reports</span>
                    </button>

                    {/* Theme Toggle Button */}
                    <button
                        className='theme-toggle-btn'
                        onClick={toggleTheme}
                        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                    >
                        {theme === 'dark' ? (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                                <span>Dark</span>
                            </>
                        )}
                    </button>

                    <div className='user-pill'>
                        <div className='avatar'>{(user?.username || "U")[0].toUpperCase()}</div>
                        <span>{user?.username || "User"}</span>
                    </div>
                    <button className='logout-btn' onClick={handleLogout} title='Logout'>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <header className='hero'>
                <h1>CareerLens <span>AI</span></h1>
                <p className='hero-tagline'>AI-Powered Job Preparation & Career Assistant</p>
                <p className='hero-subtext'>Paste the job description, upload your resume & let Gemini AI prepare you for your next interview.</p>
            </header>

            {/* Error toast */}
            {error && (
                <div className='error-toast'>
                    <span>⚠ {error}</span>
                    <button onClick={() => setError("")}>✕</button>
                </div>
            )}

            {/* Form */}
            {!report && (
                <form className='glass-form' onSubmit={handleGenerate}>
                    {/* Left Column — Role Title + Job Description */}
                    <div className='left-column-stack'>
                        <div className='glass-card title-card'>
                            <div className='card-label'>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                </svg>
                                Target Job Title / Role
                            </div>
                            <input
                                type='text'
                                id='jobTitle'
                                className='title-input'
                                placeholder='e.g. Full Stack AI Engineer, Senior SDE...'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className='glass-card left-card'>
                            <div className='card-label'>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                </svg>
                                Job Description
                            </div>
                            <textarea
                                id='jobDescription'
                                placeholder='Paste the full job description here — role, responsibilities, required skills, experience...'
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Right — Resume + Self Description + Button */}
                    <div className='right-stack'>
                        {/* Resume Upload */}
                        <div className='glass-card'>
                            <div className='card-label'>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                Upload Resume
                            </div>
                            <div
                                className={`dropzone ${isDragging ? 'active' : ''} ${resumeFile ? 'uploaded' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type='file'
                                    ref={fileInputRef}
                                    accept='.pdf'
                                    onChange={handleFileChange}
                                    hidden
                                />
                                {resumeFile ? (
                                    <div className='file-selected'>
                                        <div className='file-icon'>📄</div>
                                        <div className='file-meta'>
                                            <span className='file-name'>{resumeFile.name}</span>
                                            <span className='file-size'>{(resumeFile.size / 1024).toFixed(1)} KB</span>
                                        </div>
                                        <button type='button' className='remove-btn' onClick={(e) => { e.stopPropagation(); setResumeFile(null) }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className='drop-empty'>
                                        <div className='upload-icon-ring'>
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="17 8 12 3 7 8" />
                                                <line x1="12" y1="3" x2="12" y2="15" />
                                            </svg>
                                        </div>
                                        <span>Drag & drop PDF or <u>browse</u></span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Self Description */}
                        <div className='glass-card'>
                            <div className='card-label'>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                About You
                            </div>
                            <textarea
                                id='selfDescription'
                                className='short'
                                placeholder='Your background, skills, experience & what role you are targeting...'
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                            />
                        </div>

                        {/* Generate Button with AI Icon */}
                        <button type='submit' className='generate-btn' disabled={loading}>
                            {loading ? (
                                <>
                                    <span className='spinner'></span>
                                    Generating with Gemini AI...
                                </>
                            ) : (
                                <>
                                    <span className='ai-spark-icon'>✨</span>
                                    Generate Report
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}

            {/* ========== REPORT ========== */}
            {report && (
                <section className='report'>
                    <div className='report-top'>
                        <h2>{report.title || "Your Interview Report"}</h2>
                        <button className='reset-btn' onClick={() => { setReport(null); setTitle(""); setJobDescription(""); setSelfDescription(""); setResumeFile(null) }}>
                            ↻ New Report
                        </button>
                    </div>

                    {/* Match Score */}
                    <div className='glass-card score-card'>
                        <div className='score-ring-wrap'>
                            <svg className='score-ring' viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="50" />
                                <circle
                                    cx="60" cy="60" r="50"
                                    className='score-fill'
                                    style={{
                                        strokeDasharray: `${(report.matchScore / 100) * 314} 314`,
                                        stroke: report.matchScore >= 70 ? '#69db7c' : report.matchScore >= 40 ? '#ffd43b' : '#ff6b6b'
                                    }}
                                />
                            </svg>
                            <span className='score-num'>{report.matchScore}<small>%</small></span>
                        </div>
                        <div className='score-text'>
                            <h3>Match Score</h3>
                            <p>
                                {report.matchScore >= 80 ? "Excellent fit! You're well aligned with this role." :
                                 report.matchScore >= 60 ? "Good match — a few areas to sharpen." :
                                 report.matchScore >= 40 ? "Moderate match. Focus on bridging skill gaps." :
                                 "Significant gaps found. Intensive prep recommended."}
                            </p>
                        </div>
                    </div>

                    {/* Technical Questions */}
                    {(report.technicalQuestions || report.technical_questions)?.length > 0 && (
                        <div className='glass-card report-block'>
                            <h3 className='block-title orange'>
                                <span className='dot'></span>
                                Technical Questions
                                <span className='count'>{(report.technicalQuestions || report.technical_questions).length}</span>
                            </h3>
                            <div className='qa-list'>
                                {(report.technicalQuestions || report.technical_questions).map((q, i) => (
                                    <details key={i} className='qa-item'>
                                        <summary>
                                            <span className='q-num'>Q{i + 1}</span>
                                            {q.question}
                                        </summary>
                                        <div className='qa-body'>
                                            <div className='intent'><strong>Intent:</strong> {q.intention}</div>
                                            <div className='answer'>
                                                <strong>Answer:</strong>
                                                <p>{q.answer}</p>
                                            </div>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Behavioural Questions */}
                    {(report.behaviouralQuestions || report.behavioralQuestions || report.behavioral_questions)?.length > 0 && (
                        <div className='glass-card report-block'>
                            <h3 className='block-title purple'>
                                <span className='dot'></span>
                                Behavioural Questions
                                <span className='count'>{(report.behaviouralQuestions || report.behavioralQuestions || report.behavioral_questions).length}</span>
                            </h3>
                            <div className='qa-list'>
                                {(report.behaviouralQuestions || report.behavioralQuestions || report.behavioral_questions).map((q, i) => (
                                    <details key={i} className='qa-item'>
                                        <summary>
                                            <span className='q-num purple'>Q{i + 1}</span>
                                            {q.question}
                                        </summary>
                                        <div className='qa-body'>
                                            <div className='intent'><strong>Intent:</strong> {q.intention}</div>
                                            <div className='answer'>
                                                <strong>Answer:</strong>
                                                <p>{q.answer}</p>
                                            </div>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skill Gap */}
                    {(report.skillGap || report.skillGaps || report.skill_gap)?.length > 0 && (
                        <div className='glass-card report-block'>
                            <h3 className='block-title red'>
                                <span className='dot'></span>
                                Skill Gaps
                                <span className='count'>{(report.skillGap || report.skillGaps || report.skill_gap).length}</span>
                            </h3>
                            <div className='skill-chips'>
                                {(report.skillGap || report.skillGaps || report.skill_gap).map((sg, i) => (
                                    <div key={i} className='chip' style={{ '--chip-color': getSeverityColor(sg.severity) }}>
                                        <span className='chip-name'>{sg.skill}</span>
                                        <span className='chip-sev'>{sg.severity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Preparation Plan */}
                    {(report.preparationPlan || report.preparation_plan || report.roadMap)?.length > 0 && (
                        <div className='glass-card report-block'>
                            <h3 className='block-title green'>
                                <span className='dot'></span>
                                Preparation Plan
                                <span className='count'>{(report.preparationPlan || report.preparation_plan || report.roadMap).length} days</span>
                            </h3>
                            <div className='timeline'>
                                {(report.preparationPlan || report.preparation_plan || report.roadMap).map((day, i) => (
                                    <div key={i} className='tl-item'>
                                        <div className='tl-dot-line'>
                                            <span className='tl-dot'></span>
                                            {i < (report.preparationPlan || report.preparation_plan || report.roadMap).length - 1 && <span className='tl-line'></span>}
                                        </div>
                                        <div className='tl-content'>
                                            <div className='tl-head'>
                                                <span className='tl-day'>Day {day.day}</span>
                                                <span className='tl-focus'>{day.focus}</span>
                                            </div>
                                            <ul>
                                                {day.tasks?.map((task, j) => (
                                                    <li key={j}>{task}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Reports Modal */}
            <ReportsModal
                isOpen={reportsModalOpen}
                onClose={() => setReportsModalOpen(false)}
            />
        </main>
    )
}

export default Home