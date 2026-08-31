import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import './ReportsModal.scss'

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

const ReportsModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate()
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (isOpen) {
            setLoading(true)
            setError("")
            api.get("/api/interview")
                .then(res => {
                    setReports(res.data.reports || [])
                })
                .catch(err => {
                    setError(err.response?.data?.message || "Failed to fetch reports")
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleSelectReport = (report) => {
        onClose()
        navigate(`/interview/${report._id}`, { state: { report } })
    }

    const formatDate = (isoStr) => {
        if (!isoStr) return ""
        const d = new Date(isoStr)
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className='reports-modal-overlay' onClick={onClose}>
            <div className='reports-modal-card glass-card' onClick={(e) => e.stopPropagation()}>
                <div className='modal-header'>
                    <div className='title-wrap'>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        <h2>Your Interview Reports</h2>
                        <span className='report-count'>{reports.length}</span>
                    </div>
                    <div className='header-actions'>
                        <button className='back-home-modal-btn' onClick={() => { onClose(); navigate('/'); }}>
                            ← Back to Generator
                        </button>
                        <button className='close-btn' onClick={onClose} title="Close">✕</button>
                    </div>
                </div>

                <div className='modal-body'>
                    {loading && (
                        <div className='loading-state'>
                            <span className='spinner'></span>
                            <p>Fetching your generated reports...</p>
                        </div>
                    )}

                    {error && (
                        <div className='error-state'>
                            <p>⚠️ {error}</p>
                        </div>
                    )}

                    {!loading && !error && reports.length === 0 && (
                        <div className='empty-state'>
                            <div className='empty-icon'>📋</div>
                            <h3>No Reports Generated Yet</h3>
                            <p>Upload a resume & paste a job description on the home page to create your first report!</p>
                        </div>
                    )}

                    {!loading && !error && reports.length > 0 && (
                        <div className='reports-list'>
                            {reports.map((item) => (
                                <div
                                    key={item._id}
                                    className='report-item-card'
                                    onClick={() => handleSelectReport(item)}
                                >
                                    <div className='item-score-badge' style={{
                                        borderColor: item.matchScore >= 70 ? '#69db7c' : item.matchScore >= 40 ? '#ffd43b' : '#ff6b6b',
                                        color: item.matchScore >= 70 ? '#69db7c' : item.matchScore >= 40 ? '#ffd43b' : '#ff6b6b'
                                    }}>
                                        <span>{item.matchScore}%</span>
                                        <small>Match</small>
                                    </div>

                                    <div className='item-info'>
                                        <h4 className='job-snippet'>
                                            {item.title || (item.jobDescription ? (item.jobDescription.slice(0, 65) + "...") : "Job Strategy Report")}
                                        </h4>
                                        <div className='item-meta'>
                                            <span>📅 {formatDate(item.createdAt)}</span>
                                            <span>• {(item.technicalQuestions || item.technical_questions)?.length || 0} Tech Qs</span>
                                            <span>• {(item.preparationPlan || item.preparation_plan || item.roadMap)?.length || 0}d Road Map</span>
                                            <span>• {(item.skillGap || item.skillGaps)?.length || 0} Skill Gaps</span>
                                        </div>
                                    </div>

                                    <div className='item-action'>
                                        <span className='view-arrow'>View Report →</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ReportsModal
