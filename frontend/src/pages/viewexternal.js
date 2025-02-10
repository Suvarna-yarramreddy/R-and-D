import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FundedProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [visibleDetails, setVisibleDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const faculty_id = sessionStorage.getItem("faculty_id");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFundedProjects = async () => {
            try {
                const response = await fetch(`http://localhost:5003/getFundedProjects/${faculty_id}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to fetch funded projects');
                }
                const data = await response.json();
                setProjects(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFundedProjects();
    }, [faculty_id]);

    const handleToggleDetails = (projectId) => {
        setVisibleDetails(visibleDetails === projectId ? null : projectId);
    };

    const handleEditClick = (project) => {
        navigate('/editFundedProject', { state: { project } });
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    return (
        <div className="container my-4">
            <h1 className="text-center text-dark mb-4">Externally Funded Projects</h1>
            {projects.length > 0 ? (
                <div className="row">
                    {projects.map((proj) => (
                        <div className="col-md-6 mb-4" key={proj.projectId}>
                            <div className="card">
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="card-title">
                                            Project Title:&nbsp;
                                            <a
                                                href="#!"
                                                onClick={() => handleToggleDetails(proj.projectId)}
                                                aria-expanded={visibleDetails === proj.projectId}
                                                className="text-primary"
                                            >
                                                {proj.title}
                                            </a>
                                        </h5>
                                        <div className="text-right">
                                            <strong>Status:</strong>
                                            <span className="text-dark ms-2">{proj.status}</span>

                                            {proj.status === 'Rejected' && proj.rejection_reason && (
                                                <div className="mt-2">
                                                    <strong>Reason:</strong> {proj.rejection_reason}
                                                </div>
                                            )}

                                            {proj.status === 'Rejected' && (
                                                <button
                                                    className="btn btn-warning mt-2"
                                                    onClick={() => handleEditClick(proj)}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {visibleDetails === proj.projectId && (
                                        <div className="card-details overflow-auto" style={{ maxHeight: '250px' }}>
                                            {proj.financialYear && <p><strong>Financial Year:</strong> {proj.financialYear}</p>}
                                            {proj.applicationNumber && <p><strong>Application Number:</strong> {proj.applicationNumber}</p>}
                                            {proj.agency && <p><strong>Funding Agency:</strong> {proj.agency}</p>}
                                            {proj.scheme && <p><strong>Scheme:</strong> {proj.scheme}</p>}
                                            {proj.piName && <p><strong>Principal Investigator:</strong> {proj.piName}</p>}
                                            {proj.piDept && <p><strong>PI Department:</strong> {proj.piDept}</p>}
                                            {proj.piContact && <p><strong>PI Contact:</strong> {proj.piContact}</p>}
                                            {proj.piEmail && <p><strong>PI Email:</strong> {proj.piEmail}</p>}
                                            {proj.copiName && <p><strong>Co-PI Name:</strong> {proj.copiName}</p>}
                                            {proj.copiDept && <p><strong>Co-PI Department:</strong> {proj.copiDept}</p>}
                                            {proj.copiContact && <p><strong>Co-PI Contact:</strong> {proj.copiContact}</p>}
                                            {proj.copiEmail && <p><strong>Co-PI Email:</strong> {proj.copiEmail}</p>}
                                            {proj.duration && <p><strong>Duration:</strong> {proj.duration}</p>}
                                            {proj.startDate && <p><strong>Start Date:</strong> {proj.startDate}</p>}
                                            {proj.objectives && <p><strong>Objectives:</strong> {proj.objectives}</p>}
                                            {proj.outcomes && <p><strong>Expected Outcomes:</strong> {proj.outcomes}</p>}
                                            {proj.amountApplied && <p><strong>Amount Applied:</strong> ₹{proj.amountApplied}</p>}
                                            {proj.amountReceived && <p><strong>Amount Received:</strong> ₹{proj.amountReceived}</p>}
                                            {proj.amountSanctioned && <p><strong>Amount Sanctioned:</strong> ₹{proj.amountSanctioned}</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted">No funded projects available.</p>
            )}
        </div>
    );
};

export default FundedProjectsPage;
