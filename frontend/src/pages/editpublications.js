import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditPublicationsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const pub = location.state.publication; // Get the publication data passed via state

    const [formData, setFormData] = useState({
        ...pub // Set initial form data with the publication details
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0], // Update with the new file
            }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
            const formDataToSend = {};
    
            // Ensure formData is converted to an object
            for (const [key, value] of Object.entries(formData)) {
                if (value !== undefined && value !== null && value !== '') {
                    formDataToSend[key] = value; // Add key-value pairs to the object
                }
            }
    
            // Set the status to 'applied' before sending the update
            formDataToSend.status = 'Applied'; // This ensures the status is updated to 'applied'
    
            // Log to check form data before sending
            console.log("Form Data to Send:", formDataToSend);
    
            if (Object.keys(formDataToSend).length === 0) {
                alert('No fields to update');
                return;
            }
    
            const response = await fetch(`http://localhost:5002/update-publication/${pub.publicationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataToSend), // Send as JSON
            });
    
            if (!response.ok) {
                const errorDetails = await response.json();
                console.error('Error details:', errorDetails);
                throw new Error('Failed to update publication');
            }
    
            const result = await response.json();
            console.log(result.message); // Log the success message
            navigate('/viewpublications'); // Redirect on success
        } catch (error) {
            console.error('Error updating publication:', error);
            alert(error.message || 'Failed to update publication');
        }
    };
    
    const handleCancel = () => {
        navigate('/viewpublications'); // Navigate to view publications page on cancel
    };

    return (
        <div className="container my-4">
            <h2>Edit Publication</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    {pub.natureOfPublication && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Nature of Publication</label>
                            <input
                                type="text"
                                className="form-control"
                                name="natureOfPublication"
                                value={formData.natureOfPublication}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.typeOfPublication && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Type of Publication</label>
                            <input
                                type="text"
                                className="form-control"
                                name="typeOfPublication"
                                value={formData.typeOfPublication}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.titleOfPaper && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Title of Paper</label>
                            <input
                                type="text"
                                className="form-control"
                                name="titleOfPaper"
                                value={formData.titleOfPaper}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.nameOfJournalConference && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Journal/Conference</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nameOfJournalConference"
                                value={formData.nameOfJournalConference}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.titleofChapter && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Title of Chapter</label>
                            <input
                                type="text"
                                className="form-control"
                                name="titleofChapter"
                                value={formData.titleofChapter}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.nameofbook && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Name of Book</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nameofbook"
                                value={formData.nameofbook}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.nameOfPublisher && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Publisher</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nameOfPublisher"
                                value={formData.nameOfPublisher}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.quartile && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Quartile</label>
                            <input
                                type="text"
                                className="form-control"
                                name="quartile"
                                value={formData.quartile}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.issnIsbn && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">ISSN/ISBN</label>
                            <input
                                type="text"
                                className="form-control"
                                name="issnIsbn"
                                value={formData.issnIsbn}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.authorStatus && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Author Status</label>
                            <input
                                type="text"
                                className="form-control"
                                name="authorStatus"
                                value={formData.authorStatus}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.firstAuthorName && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">First Author Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="firstAuthorName"
                                value={formData.firstAuthorName}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.firstAuthorAffiliation && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">First Author Affiliation</label>
                            <input
                                type="text"
                                className="form-control"
                                name="firstAuthorAffiliation"
                                value={formData.firstAuthorAffiliation}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.coAuthors && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Co-Authors</label>
                            <input
                                type="text"
                                className="form-control"
                                name="coAuthors"
                                value={formData.coAuthors}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.indexed && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Indexed</label>
                            <input
                                type="text"
                                className="form-control"
                                name="indexed"
                                value={formData.indexed}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.impactFactor && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Impact Factor</label>
                            <input
                                type="text"
                                className="form-control"
                                name="impactFactor"
                                value={formData.impactFactor}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.doi && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">DOI</label>
                            <input
                                type="text"
                                className="form-control"
                                name="doi"
                                value={formData.doi}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.linkOfPaper && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Link to Paper</label>
                            <input
                                type="text"
                                className="form-control"
                                name="linkOfPaper"
                                value={formData.linkOfPaper}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.scopusLink && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Scopus Link</label>
                            <input
                                type="text"
                                className="form-control"
                                name="scopusLink"
                                value={formData.scopusLink}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.volume && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Volume</label>
                            <input
                                type="text"
                                className="form-control"
                                name="volume"
                                value={formData.volume}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.pageNo && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Page Number</label>
                            <input
                                type="text"
                                className="form-control"
                                name="pageNo"
                                value={formData.pageNo}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.monthYear && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Year & Month</label>
                            <input
                                type="text"
                                className="form-control"
                                name="monthYear"
                                value={formData.monthYear}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.citeAs && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Cite As</label>
                            <input
                                type="text"
                                className="form-control"
                                name="citeAs"
                                value={formData.citeAs}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.proofOfPublication && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Proof of Publication</label>
                            <div>
                                <small>Existing file:</small>
                            <a href={`http://localhost:5002${pub.proofOfPublication}`} target="_blank" rel="noopener noreferrer">View Proof</a>
                            </div>
                            <input
                                type="file"
                                className="form-control"
                                name="proofOfPublication"
                                onChange={handleFileChange}
                            />
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );
};

export default EditPublicationsPage;
