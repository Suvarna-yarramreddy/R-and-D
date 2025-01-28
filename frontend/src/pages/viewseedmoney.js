import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SeedMoneyPage = () => {
    const [seedMoneyApplications, setSeedMoneyApplications] = useState([]);
    const faculty_id = sessionStorage.getItem("faculty_id");

    // State to track which seed money application's details should be visible
    const [visibleDetails, setVisibleDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSeedMoneyApplications = async () => {
            try {
                const response = await fetch(`http://localhost:9000/getSeedMoneyApplications/${faculty_id}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error('Failed to fetch seed money applications');
                }

                const data = await response.json();
                setSeedMoneyApplications(data);
            } catch (error) {
                console.error('Error fetching seed money applications:', error);
            }
        };

        fetchSeedMoneyApplications();
    }, [faculty_id]);

    // Toggle visibility of seed money application details
    const handleToggleDetails = (applicationId) => {
        setVisibleDetails(visibleDetails === applicationId ? null : applicationId);
    };

    // Navigate to the Edit Seed Money page and pass the application data
    const handleEditClick = (app) => {
        navigate('/editseedmoney', { state: { seedMoney: app } });
    };

    return (
        <div className="container my-4">
            <h1 className="text-center text-dark mb-4">Your Seed Money Applications</h1>
            {seedMoneyApplications.length > 0 ? (
                <div className="row">
                    {seedMoneyApplications.map(app => (
                        <div className="col-md-6 mb-4" key={app.application_id}>
                            <div className="card">
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="card-title">
                                            Application ID:&nbsp;
                                            <a
                                                href="#!"
                                                onClick={() => handleToggleDetails(app.application_id)}
                                                className="text-primary"
                                            >
                                                {app.application_id}
                                            </a>
                                        </h5>
                                        <div className="text-right">
                                            <strong>Status:</strong>
                                            <span className="text-dark ms-2">{app.status}</span>

                                            {/* Conditionally display rejection reason */}
                                            {app.status === 'Rejected' && app.rejection_reason && (
                                                <div className="mt-2">
                                                    <strong>Reason:</strong> {app.rejection_reason}
                                                </div>
                                            )}
                                            
                                            {/* Show "Edit" button only for rejected applications */}
                                            {app.status === 'Rejected' && (
                                                <button
                                                    className="btn btn-warning mt-2"
                                                    onClick={() => handleEditClick(app)}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Only show details for the clicked application */}
                                    {visibleDetails === app.application_id && (
                                        <div className="overflow-auto" style={{ maxHeight: '200px' }}>
                                            <div className="card-details">
                                                <div>
                                                    {app.projectTitle && <p><strong>Project Title:</strong> {app.projectTitle}</p>}
                                                    {app.amountRequested && <p><strong>Amount Requested:</strong> {app.amountRequested}</p>}
                                                    {app.objective && <p><strong>Objective:</strong> {app.objective}</p>}
                                                    {app.startDate && <p><strong>Start Date:</strong> {app.startDate}</p>}
                                                    {app.endDate && <p><strong>End Date:</strong> {app.endDate}</p>}
                                                    {app.impact && <p><strong>Impact:</strong> {app.impact}</p>}
                                                    {app.proofOfApplication && (
                                                        <p><strong>Proof of Application:</strong>
                                                            <a href={`http://localhost:9000/${app.proofOfApplication}`} target="_blank" rel="noopener noreferrer">View Proof</a>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted">No seed money applications available.</p>
            )}
        </div>
    );
};

export default SeedMoneyPage;
