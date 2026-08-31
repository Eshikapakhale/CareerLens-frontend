import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { useTheme } from '../../../context/theme.context'
import ReportsModal from '../components/ReportsModal'
import axios from 'axios'
import "../style/interview.scss"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

const Interview = () => {
    const { interviewId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const { user, handleLogout } = useAuth()
    const { theme, toggleTheme } = useTheme()

    const [report, setReport] = useState(location.state?.report || null)
    const [loading, setLoading] = useState(!location.state?.report)
    const [error, setError] = useState("")
    const [reportsModalOpen, setReportsModalOpen] = useState(false)
    const [downloadingResume, setDownloadingResume] = useState(false)

    // Active tab state: 'technical' | 'behavioral' | 'roadmap'
    const [activeTab, setActiveTab] = useState('technical')
    const [selectedSkill, setSelectedSkill] = useState(null)

    // Expanded question accordion state (set of expanded indices)
    const [expandedTechQs, setExpandedTechQs] = useState({})
    const [expandedBehavQs, setExpandedBehavQs] = useState({})

    const toggleTechQ = (idx) => {
        setExpandedTechQs(prev => ({ ...prev, [idx]: !prev[idx] }))
    }

    const toggleBehavQ = (idx) => {
        setExpandedBehavQs(prev => ({ ...prev, [idx]: !prev[idx] }))
    }

    useEffect(() => {
        if (!interviewId || interviewId === ":interviewId") {
            setError("Invalid Report ID. Please generate a new report from the main page.")
            setLoading(false)
            return
        }

        if (!report && interviewId) {
            setLoading(true)
            api.get(`/api/interview/${interviewId}`)
                .then(res => {
                    setReport(res.data.interviewReport)
                })
                .catch(err => {
                    setError(err.response?.data?.message || "Failed to load interview report")
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [interviewId, report])

    const handleDownloadResume = async () => {
        if (!interviewId) return
        setDownloadingResume(true)
        try {
            const response = await api.get(`/api/interview/${interviewId}/resume-pdf`, {
                responseType: 'blob'
            })
            const blob = new Blob([response.data], { type: 'application/pdf' })
            const downloadUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.setAttribute('download', `${(report?.title || "Tailored").replace(/\s+/g, '_')}_AI_Resume.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(downloadUrl)
        } catch (err) {
            alert("Failed to generate and download resume PDF. Please try again.")
        } finally {
            setDownloadingResume(false)
        }
    }

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case "high": return "#ff6b6b"
            case "medium": return "#ffd43b"
            case "low": return "#69db7c"
            default: return "#a78bfa"
        }
    }

    if (loading) {
        return (
            <main className='interview-page loading-state'>
                <div className='orb orb-1'></div>
                <div className='orb orb-2'></div>
                <div className='loading-box'>
                    <span className='spinner'></span>
                    <p>Loading AI Interview Strategy...</p>
                </div>
            </main>
        )
    }

    if (error || !report) {
        return (
            <main className='interview-page error-state'>
                <div className='orb orb-1'></div>
                <div className='error-box glass-card'>
                    <h2>Report Not Found</h2>
                    <p>{error || "Unable to locate requested interview report."}</p>
                    <Link to="/" className='back-btn'>← Back to Generator</Link>
                </div>
            </main>
        )
    }

    // Normalized data arrays
    const technicalQs = report.technicalQuestions || report.technical_questions || []
    const behavioralQs = report.behaviouralQuestions || report.behavioralQuestions || report.behavioral_questions || []
    const prepPlan = report.preparationPlan || report.preparation_plan || report.roadMap || []
    const skillGaps = report.skillGap || report.skillGaps || report.skill_gap || []
    const reportTitle = report.title || "Interview Preparation Strategy"

    return (
        <main className='interview-page'>
            {/* Ambient background orbs */}
            <div className='orb orb-1'></div>
            <div className='orb orb-2'></div>
            <div className='orb orb-3'></div>

            {/* Top Navigation */}
            <nav className='glass-nav'>
                <div className='nav-brand'>
                    <Link to="/" className='brand-link'>
                        <img src="/logo.png" alt="CareerLens AI Logo" className='nav-logo-img' />
                        <span>CareerLens AI</span>
                    </Link>
                    <span className='nav-divider'>/</span>
                    <span className='nav-subtitle'>{reportTitle}</span>
                </div>
                <div className='nav-actions'>
                    {/* Back to Generator */}
                    <Link to="/" className='back-generator-btn' title="Back to Report Generator">
                        ← Generator
                    </Link>

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

            {/* 3-Column Wireframe Dashboard Layout */}
            <div className='dashboard-container'>
                {/* Column 1: Left Navigation Menu */}
                <aside className='left-sidebar glass-card'>
                    <div className='score-badge-card'>
                        <div className='score-circle' style={{
                            borderColor: (report.matchScore ?? 80) >= 70 ? '#69db7c' : (report.matchScore ?? 80) >= 40 ? '#ffd43b' : '#ff6b6b'
                        }}>
                            <span className='score-val'>{report.matchScore ?? 85}%</span>
                        </div>
                        <div className='score-meta'>
                            <span className='score-label'>Match Fit</span>
                            <span className='score-status'>
                                {(report.matchScore ?? 80) >= 70 ? "High Alignment" : "Gaps Detected"}
                            </span>
                        </div>
                    </div>

                    <nav className='sidebar-menu'>
                        <button
                            className={`menu-item ${activeTab === 'technical' ? 'active' : ''}`}
                            onClick={() => setActiveTab('technical')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="16 18 22 12 16 6" />
                                <polyline points="8 6 2 12 8 18" />
                            </svg>
                            <span>Technical questions</span>
                            <span className='count-pill'>{technicalQs.length}</span>
                        </button>

                        <button
                            className={`menu-item ${activeTab === 'behavioral' ? 'active' : ''}`}
                            onClick={() => setActiveTab('behavioral')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <span>Behavioral questions</span>
                            <span className='count-pill'>{behavioralQs.length}</span>
                        </button>

                        <button
                            className={`menu-item ${activeTab === 'roadmap' ? 'active' : ''}`}
                            onClick={() => setActiveTab('roadmap')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                                <polyline points="2 17 12 22 22 17" />
                                <polyline points="2 12 12 17 22 12" />
                            </svg>
                            <span>Road Map</span>
                            <span className='count-pill'>{prepPlan.length}d</span>
                        </button>
                    </nav>

                    {/* Sidebar Action Buttons */}
                    <div className='sidebar-footer'>
                        {/* Download Tailored Resume PDF Button */}
                        <button
                            className='download-resume-btn'
                            onClick={handleDownloadResume}
                            disabled={downloadingResume}
                            title="Generate and Download AI Tailored Resume PDF"
                        >
                            {downloadingResume ? (
                                <>
                                    <span className='btn-spinner'></span>
                                    <span>Generating PDF...</span>
                                </>
                            ) : (
                                <>
                                    <span className='ai-spark'>✨</span>
                                    <span>Download Resume</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </>
                            )}
                        </button>

                        <button className='new-analysis-btn' onClick={() => navigate('/')}>
                            + New Strategy
                        </button>
                    </div>
                </aside>

                {/* Column 2: Center Main Content Area */}
                <main className='center-content glass-card'>
                    {activeTab === 'technical' && (
                        <div className='content-section'>
                            <div className='section-header'>
                                <h2>Technical Questions</h2>
                                <p>Click any question below to reveal the interviewer intent and model AI answer.</p>
                            </div>

                            {technicalQs.length === 0 ? (
                                <div className='empty-tab-state'>
                                    <p>No technical questions found for this report.</p>
                                </div>
                            ) : (
                                <div className='qa-stack'>
                                    {technicalQs.map((item, index) => {
                                        const isExpanded = !!expandedTechQs[index]
                                        return (
                                            <div
                                                key={index}
                                                className={`qa-card collapsible ${isExpanded ? 'expanded' : ''}`}
                                                onClick={() => toggleTechQ(index)}
                                            >
                                                <div className='qa-title-row'>
                                                    <span className='q-badge'>Q{index + 1}</span>
                                                    <h3>{item.question}</h3>
                                                    <span className='accordion-chevron'>
                                                        {isExpanded ? '▲' : '▼'}
                                                    </span>
                                                </div>

                                                {isExpanded && (
                                                    <div className='qa-accordion-body'>
                                                        <div className='qa-intent-box'>
                                                            <strong>Interviewer Intent:</strong> {item.intention}
                                                        </div>
                                                        <div className='qa-answer-box'>
                                                            <strong>Recommended AI Answer:</strong>
                                                            <p>{item.answer}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'behavioral' && (
                        <div className='content-section'>
                            <div className='section-header'>
                                <h2>Behavioral Questions</h2>
                                <p>Click any question below to view STAR method intention and recommended response.</p>
                            </div>

                            {behavioralQs.length === 0 ? (
                                <div className='empty-tab-state'>
                                    <p>No behavioral questions found for this report.</p>
                                </div>
                            ) : (
                                <div className='qa-stack'>
                                    {behavioralQs.map((item, index) => {
                                        const isExpanded = !!expandedBehavQs[index]
                                        return (
                                            <div
                                                key={index}
                                                className={`qa-card purple-accent collapsible ${isExpanded ? 'expanded' : ''}`}
                                                onClick={() => toggleBehavQ(index)}
                                            >
                                                <div className='qa-title-row'>
                                                    <span className='q-badge purple'>Q{index + 1}</span>
                                                    <h3>{item.question}</h3>
                                                    <span className='accordion-chevron'>
                                                        {isExpanded ? '▲' : '▼'}
                                                    </span>
                                                </div>

                                                {isExpanded && (
                                                    <div className='qa-accordion-body'>
                                                        <div className='qa-intent-box'>
                                                            <strong>Interviewer Intent:</strong> {item.intention}
                                                        </div>
                                                        <div className='qa-answer-box'>
                                                            <strong>Recommended AI Answer:</strong>
                                                            <p>{item.answer}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'roadmap' && (
                        <div className='content-section'>
                            <div className='section-header'>
                                <h2>Preparation Road Map</h2>
                                <p>Day-wise execution plan to master key technical requirements and bridge identified gaps.</p>
                            </div>

                            {prepPlan.length === 0 ? (
                                <div className='empty-tab-state'>
                                    <p>No preparation roadmap found for this report.</p>
                                </div>
                            ) : (
                                <div className='roadmap-timeline'>
                                    {prepPlan.map((plan, index) => (
                                        <div key={index} className='roadmap-day-card'>
                                            <div className='day-header'>
                                                <span className='day-badge'>Day {plan.day || index + 1}</span>
                                                <h3>{plan.focus}</h3>
                                            </div>
                                            <ul className='task-list'>
                                                {plan.tasks?.map((task, tIdx) => (
                                                    <li key={tIdx}>
                                                        <span className='check-icon'>✓</span>
                                                        <span>{task}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>

                {/* Column 3: Right Skill Gaps Panel */}
                <aside className='right-sidebar glass-card'>
                    <div className='skill-gaps-header'>
                        <h3>Skill Gaps</h3>
                        <span className='badge'>{skillGaps.length}</span>
                    </div>

                    <div className='skill-chips-container'>
                        {skillGaps.map((gap, index) => (
                            <button
                                key={index}
                                className={`skill-chip ${selectedSkill?.skill === gap.skill ? 'selected' : ''}`}
                                onClick={() => setSelectedSkill(selectedSkill?.skill === gap.skill ? null : gap)}
                            >
                                <span className='chip-label'>{gap.skill}</span>
                                <span
                                    className='chip-severity'
                                    style={{
                                        color: getSeverityColor(gap.severity),
                                        borderColor: getSeverityColor(gap.severity)
                                    }}
                                >
                                    {gap.severity}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Active skill hint detail */}
                    {selectedSkill && (
                        <div className='skill-detail-card'>
                            <h4>Focus: {selectedSkill.skill}</h4>
                            <p>Severity level is <strong>{selectedSkill.severity}</strong>. Prioritize reviewing this topic in your Road Map strategy.</p>
                        </div>
                    )}
                </aside>
            </div>

            {/* Reports Modal */}
            <ReportsModal
                isOpen={reportsModalOpen}
                onClose={() => setReportsModalOpen(false)}
            />
        </main>
    )
}

export default Interview