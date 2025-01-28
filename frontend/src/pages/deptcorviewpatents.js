import React, { useState, useEffect } from 'react';

const CorViewPatents = () => {
    const [patents, setPatents] = useState([]);
    const [visiblePatentId, setVisiblePatentId] = useState(null); // Track which publication's details are visible
    const [rejectionReason, setRejectionReason] = useState(''); // Store rejection reason
    const [patentToReject, setPatentToReject] = useState(null); // Track which publication is being rejected
    const coordinatorId = sessionStorage.getItem("coordinatorid");
    useEffect(() => {
        const fetchPatents = async () => {
            if (!coordinatorId) {
                console.error('Coordinator ID is undefined');
                return;
            }
            try {
                const response = await fetch(`http://localhost:4002/getAllPatents?coordinatorid=${coordinatorId}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error('Failed to fetch patents');
                }
                const data = await response.json();
                setPatents(data);
            } catch (error) {
                console.error('Error fetching patents:', error);
            }
        };
        fetchPatents();
    }, [coordinatorId]);
    

    // Toggle visibility of publication details
    const togglePatentDetails = (patentId) => {
        if (visiblePatentId === patentId) {
            setVisiblePatentId(null); // Hide details if the same card is clicked
        } else {
            setVisiblePatentId(patentId); // Show clicked publication's details
        }
    };

    // Approve the publication and update the database
    const approvePatent = async (patentId) => {
        try {
            const response = await fetch(`http://localhost:4002/approvePatent/${patentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('Failed to approve patent');
            }

            // Remove the publication from the list after approval
            setPatents(patents.filter(pub => pub.patent_id !== patentId));
        } catch (error) {
            console.error('Error approving patent:', error);
        }
    };

    // Reject the publication and update the database with the rejection reason
    const rejectPatent = async (patentId) => {
        if (!rejectionReason.trim()) { // Check if rejection reason is empty or just spaces
            alert('Please provide a reason for rejection');
            return;
        }

        try {
            const response = await fetch(`http://localhost:4002/rejectPatent/${patentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rejectionReason }),  // Pass rejectionReason directly
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('Failed to reject patent');
            }

            // If the rejection is successful, remove the rejected publication from the list
            setPatents(patents.filter(pub => pub.patent_id !== patentId));

            // Reset rejection reason and publication to reject state
            setRejectionReason('');
            setPatentToReject(null);
        } catch (error) {
            console.error('Error rejecting patent:', error);
        }
    };

    return (
        <div className="container my-4">
            <h1 className="text-center text-dark mb-4">Patents Pending Approval</h1>
            {patents.length > 0 ? (
                <div className="row">
                    {patents.map(pub => (
                        <div className="col-md-6 mb-4" key={pub.patent_id}>
                            <div className="card">
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="card-title">
                                            Title of Invention:&nbsp;
                                            <a
                                                href="#!"
                                                onClick={() => togglePatentDetails(pub.patent_id)}
                                                className="text-primary"
                                            >
                                                {pub.inventionTitle}
                                            </a>
                                        </h5>
                                        <span className="badge bg-info text-dark">{pub.status}</span>
                                    </div>

                                    {/* Only show details for the clicked publication */}
                                    {visiblePatentId === pub.patent_id && (
                                        <div className="overflow-auto" style={{ maxHeight: '200px' }}>
                                            <div className="card-details">
                                                {pub.category && <p><strong>Category:</strong> {pub.category}</p>}
                                                {pub.iprType && <p><strong>Type of IPR:</strong> {pub.iprType}</p>}
                                                {pub.applicationNumber && <p><strong>Application Number:</strong> {pub.applicationNumber}</p>}
                                                {pub.applicantName && <p><strong>Name of Applicant:</strong> {pub.applicantName}</p>}
                                                {pub.department && <p><strong>Department:</strong> {pub.department}</p>}
                                                {pub.filingDate && <p><strong>Date of Filing:</strong> {pub.filingDate}</p>}
                                                {pub.numOfInventors && <p><strong>Number of Inventors:</strong> {pub.numOfInventors}</p>}
                                                {pub.inventors && <p><strong>Name of Inventors:</strong> {pub.inventors}</p>}
                                                {pub.dateOfPublished && <p><strong>Date of Published:</strong> {pub.dateOfPublished}</p>}
                                                {pub.dateOfGranted && <p><strong>Date of Granted:</strong> {pub.dateOfGranted}</p>}
                                                {pub.proofOfPatent && (
                                                    <p>
                                                        <strong>Proof of Patent:</strong>&nbsp;
                                                        <a href={`http://localhost:5001/${pub.proofOfPatent}`} target="_blank" rel="noopener noreferrer">
                                                            View Proof
                                                        </a>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="text-center mt-3">
                                    <button 
                                        className="btn btn-success w-49 mb-3" 
                                        onClick={() => approvePatent(pub.patent_id)}
                                    >
                                        Approve
                                    </button>

                                    {/* Reject button */}
                                    <button 
                                        className="btn btn-danger w-49 mb-3 ms-2" 
                                        onClick={() => setPatentToReject(pub.patent_id)} // Set the publication ID to reject
                                    >
                                        Reject
                                    </button>
                                </div>

                                {/* If publication is being rejected, show a text field for rejection reason */}
                                {patentToReject === pub.patent_id && (
                                    <div className="mt-3">
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Enter reason for rejection"
                                        />
                                        <button 
                                            className="btn btn-danger w-100 mt-2" 
                                            onClick={() => rejectPatent(pub.patent_id)} // Handle rejection
                                        >
                                            Submit Rejection
                                        </button>
                                    </div>
                                )}
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

export default CorViewPatents;
