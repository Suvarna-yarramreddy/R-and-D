import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PatentsPage = () => {
    const [patents, setPatents] = useState([]);
    const [visibleDetails, setVisibleDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const faculty_id = sessionStorage.getItem("faculty_id");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatents = async () => {
            try {
                const response = await fetch(`http://localhost:5001/getpatents/${faculty_id}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to fetch patents');
                }
                const data = await response.json();
                setPatents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPatents();
    }, [faculty_id]);

    const handleToggleDetails = (patentId) => {
        setVisibleDetails(visibleDetails === patentId ? null : patentId);
    };

    const handleEditClick = (patent) => {
        navigate('/editpatents', { state: { patents: patent } });
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    return (
        <div className="container my-4">
            <h1 className="text-center text-dark mb-4">Your Patents</h1>
            {patents.length > 0 ? (
                <div className="row">
                    {patents.map((pat) => (
                        <div className="col-md-6 mb-4" key={pat.patentId}>
                            <div className="card">
                                <div className="card-body d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title">
                                        Title of Invention:&nbsp;
                                        <a
                                            href="#!"
                                            onClick={() => handleToggleDetails(pat.patentId)}
                                            aria-expanded={visibleDetails === pat.patentId}
                                            className="text-primary"
                                        >
                                            {pat.inventionTitle}
                                        </a>
                                    </h5>
                                    <div className="text-right">
                                            <strong>Status:</strong>
                                            <span className="text-dark ms-2">{pat.status}</span>

                                            {/* Conditionally display rejection reason */}
                                            {pat.status === 'Rejected by Department R&D Coordinator' && pat.rejection_reason && (
                                                <div className="mt-2">
                                                    <strong>Reason:</strong> {pat.rejection_reason}
                                                </div>
                                            )}
                                            
                                            {/* Show "Edit" button only for rejected publications */}
                                            {pat.status === 'Rejected by Department R&D Coordinator' && (
                                                <button
                                                    className="btn btn-warning mt-2"
                                                    onClick={() => handleEditClick(pat)} // Handle edit button click
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                        </div>
                                    {visibleDetails === pat.patentId && (
                                        <div className="card-details overflow-auto" style={{ maxHeight: '200px' }}>
                                                {pat.category && <p><strong>Category:</strong> {pat.category}</p>}
                                                {pat.iprType && <p><strong>Type of IPR:</strong> {pat.iprType}</p>}
                                                {pat.applicationNumber && <p><strong>Application Number:</strong> {pat.applicationNumber}</p>}
                                                {pat.applicantName && <p><strong>Name of Applicant:</strong> {pat.applicantName}</p>}
                                                {pat.department && <p><strong>Department:</strong> {pat.department}</p>}
                                                {pat.filingDate && <p><strong>Date of Filing:</strong> {pat.filingDate}</p>}
                                                {pat.numOfInventors && <p><strong>Number of Inventors:</strong> {pat.numOfInventors}</p>}
                                                {Array.isArray(pat.inventors) && pat.inventors.length > 0 && (
                                                    <p><strong>Name of Inventors:</strong> {pat.inventors.join(', ')}</p>
                                                )}

                                                {pat.dateOfPublished && <p><strong>Date of Published:</strong> {pat.dateOfPublished}</p>}
                                                {pat.dateOfGranted && <p><strong>Date of Granted:</strong> {pat.dateOfGranted}</p>}
                                                {pat.proofOfPatent && (
                                                    <p>
                                                        <strong>Proof of Patent:</strong>&nbsp;
                                                        <a href={`http://localhost:5001/${pat.proofOfPatent}`} target="_blank" rel="noopener noreferrer">
                                                            View Proof
                                                        </a>
                                                    </p>
                                                )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted">No patents available for approval.</p>
            )}
        </div>
    );
};

export default PatentsPage;
