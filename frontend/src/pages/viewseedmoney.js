import React, { useState, useEffect } from 'react';

const SeedMoneyPage = () => {
    const [seedMoneyApplications, setSeedMoneyApplications] = useState([]);
    const faculty_id = sessionStorage.getItem("faculty_id");
    const [visibleDetails, setVisibleDetails] = useState(null);

    useEffect(() => {
        const fetchSeedMoneyApplications = async () => {
            try {
                const response = await fetch(`http://localhost:9000/getSeedMoney/${faculty_id}`);
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

    const handleToggleDetails = (seedMoneyId) => {
        setVisibleDetails(visibleDetails === seedMoneyId ? null : seedMoneyId);
    };

    return (
        <div className="container my-4">
            <h1 className="text-center text-dark mb-4">Your Seed Money Applications</h1>
            {seedMoneyApplications.length > 0 ? (
                <div className="row">
                    {seedMoneyApplications.map(app => (
                        <div className="col-md-6 mb-4" key={app.seedMoneyId}>
                            <div className="card">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">
                                        <strong>Project Title: </strong>
                                        <a
                                            href="#!"
                                            onClick={() => handleToggleDetails(app.seedMoneyId)}
                                            className="text-primary"
                                        >
                                            {app.projectTitle}
                                        </a>
                                    </h5>
                                    {visibleDetails === app.seedMoneyId && (
                                        <div className="overflow-auto" style={{ maxHeight: '200px' }}>
                                            <div className="card-details">
                                                <div>
                                                {app.financialYear && <p><strong>Financial Year:</strong> {app.financialYear}</p>}
                                                    {app.facultyName && <p><strong>Faculty Name:</strong> {app.facultyName}</p>}
                                                    {app.department && <p><strong>Department:</strong> {app.department}</p>}
                                                    {app.numStudents && <p><strong>Number of Students:</strong> {app.numStudents}</p>}
                                                    {app.projectTitle && <p><strong>Project Title:</strong> {app.projectTitle}</p>}
                                                    {app.amountSanctioned && <p><strong>Amount Sanctioned:</strong> {app.amountSanctioned}</p>}
                                                    {app.amountReceived && <p><strong>Amount Received:</strong> {app.amountReceived}</p>}
                                                    {app.objectives && <p><strong>Objectives:</strong> {app.objectives}</p>}
                                                    {app.outcomes && <p><strong>Expected Outcomes:</strong> {app.outcomes}</p>}
                                                    {app.proof && app.proof.length > 0 && (
                                                        <p><strong>Proof Documents:</strong> 
                                                            {app.proof.map((file, index) => (
                                                                <span key={index}>
                                                                    <a href={`http://localhost:9000/${file}`} target="_blank" rel="noopener noreferrer">
                                                                        View Proof {index + 1}
                                                                    </a>{' '}
                                                                </span>
                                                            ))}
                                                        </p>
                                                    )}
                                                    {app.students && app.students.length > 0 && (
                                                        <div>
                                                            <strong>Students Involved:</strong>
                                                            <ul>
                                                                {app.students.map((student, index) => (
                                                                    <li key={index}>{student.name} (Reg: {student.registration})</li>
                                                                ))}
                                                            </ul>
                                                        </div>
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