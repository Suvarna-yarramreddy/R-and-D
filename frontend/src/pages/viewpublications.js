import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import

const PublicationsPage = () => {
    const [publications, setPublications] = useState([]);
    const faculty_id = sessionStorage.getItem("faculty_id");

    // State to track which publication's details should be visible
    const [visibleDetails, setVisibleDetails] = useState({});
    const navigate = useNavigate(); // Updated hook for navigation

    useEffect(() => {
        const fetchPublications = async () => {
            try {
                const response = await fetch(`http://localhost:5002/getPublications/${faculty_id}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error('Failed to fetch publications');
                }

                const data = await response.json();
                setPublications(data);
            } catch (error) {
                console.error('Error fetching publications:', error);
            }
        };

        fetchPublications();
    }, [faculty_id]);

    const handleToggleDetails = (publicationId) => {
        setVisibleDetails(prevState => ({
            ...prevState, // Keep the existing state
            [publicationId]: !prevState[publicationId] // Toggle the specific publication's details
        }));
    };

    // Navigate to the Edit Publication page and pass the publication data
    const handleEditClick = (pub) => {
        navigate('/editpublications', { state: { publication: pub } }); // Updated navigation
    };

    return (
        <div className="container my-4">
            <h1 className="text-center text-dark mb-4"> Your Publications</h1>
            {publications.length > 0 ? (
                <div className="row">
                    {publications.map(pub => (
                        <div className="col-md-6 mb-4" key={pub.publicationId}>
                            <div className="card">
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="card-title">
                                            Cite As:&nbsp;
                                            <a
                                                href="#!"
                                                onClick={() => handleToggleDetails(pub.publicationId)}
                                                className="text-primary"
                                            >
                                                {pub.citeAs}
                                            </a>
                                        </h5>
                                        <div className="text-right">
                                            <strong>Status:</strong>
                                            <span className="text-dark ms-2">{pub.status}</span>

                                            {/* Conditionally display rejection reason */}
                                            {pub.status === 'Rejected by department RandD Coordinator' && pub.rejectionReason && (
                                                <div className="mt-2">
                                                    <strong>Reason:</strong> {pub.rejectionReason}
                                                </div>
                                            )}
                                            
                                            {/* Show "Edit" button only for rejected publications */}
                                            {pub.status === 'Rejected by department RandD Coordinator' && (
                                                <button
                                                    className="btn btn-warning mt-2"
                                                    onClick={() => handleEditClick(pub)} // Handle edit button click
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Only show details for the clicked publication */}
                                    {visibleDetails[pub.publicationId] && (
                                        <div className="overflow-auto" style={{ maxHeight: '200px' }}>
                                            <div className="card-details">
                                                <div>
                                                    {pub.natureOfPublication && <p><strong>Nature of Publication:</strong> {pub.natureOfPublication}</p>}
                                                    {pub.typeOfPublication && <p><strong>Type of Publication:</strong> {pub.typeOfPublication}</p>}
                                                    {pub.titleOfPaper && <p><strong>Title of Paper:</strong> {pub.titleOfPaper}</p>}
                                                    {pub.nameOfJournalConference && <p><strong>Journal/Conference:</strong> {pub.nameOfJournalConference}</p>}
                                                    {pub.titleofChapter && <p><strong>Title of Chapter:</strong> {pub.titleofChapter}</p>}
                                                    {pub.nameofbook && <p><strong>Name of Book:</strong> {pub.nameofbook}</p>}
                                                    {pub.nameOfPublisher && <p><strong>Publisher:</strong> {pub.nameOfPublisher}</p>}
                                                    {pub.quartile && <p><strong>Quartile:</strong> {pub.quartile}</p>}
                                                    {pub.issnIsbn && <p><strong>ISSN/ISBN:</strong> {pub.issnIsbn}</p>}
                                                    {pub.authorStatus && <p><strong>Author Status:</strong> {pub.authorStatus}</p>}
                                                    {pub.firstAuthorName && <p><strong>First Author Name:</strong> {pub.firstAuthorName}</p>}
                                                    {pub.firstAuthorAffiliation && <p><strong>First Author Affiliation:</strong> {pub.firstAuthorAffiliation}</p>}
                                                    {pub.coAuthors && <p><strong>Co-Authors:</strong> {pub.coAuthors}</p>}
                                                    {pub.indexed && <p><strong>Indexed:</strong> {pub.indexed}</p>}
                                                    {pub.impactFactor && <p><strong>Impact Factor:</strong> {pub.impactFactor}</p>}
                                                    {pub.doi && <p><strong>DOI:</strong> {pub.doi}</p>}
                                                    {pub.linkOfPaper && (
                                                        <p><strong>Link to Paper:</strong> <a href={pub.linkOfPaper} target="_blank" rel="noopener noreferrer">{pub.linkOfPaper}</a></p>
                                                    )}
                                                    {pub.scopusLink && (
                                                        <p><strong>Scopus Link:</strong> <a href={pub.scopusLink} target="_blank" rel="noopener noreferrer">{pub.scopusLink}</a></p>
                                                    )}
                                                    {pub.volume && <p><strong>Volume:</strong> {pub.volume}</p>}
                                                    {pub.pageNo && <p><strong>Page Number:</strong> {pub.pageNo}</p>}
                                                    {pub.monthYear && <p><strong>Year & Month:</strong> {pub.monthYear}</p>}
                                                    {pub.citeAs && <p><strong>Cite As:</strong> {pub.citeAs}</p>}
                                                    {pub.proofOfPublication && (
                                                        <p><strong>Proof of Publication:</strong>
                                                        <a href={`http://localhost:5002${pub.proofOfPublication}`} target="_blank" rel="noopener noreferrer">View Proof</a>
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
                <p className="text-center text-muted">No publications available for approval.</p>
            )}
        </div>
    );
};

export default PublicationsPage;