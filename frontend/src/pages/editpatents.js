import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditPatentsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const pub = location.state.patents; // Get the publication data passed via state

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
            const formDataToSend = new FormData();
    
            // Append only defined and non-empty values
            for (const [key, value] of Object.entries(formData)) {
                if (value !== undefined && value !== null) {
                    formDataToSend.append(key, value);
                }
            }
    
            const response = await fetch(`http://localhost:5001/update-patent/${pub.patent_id}`, {
                method: 'PUT',
                body: formDataToSend,
            });
    
            if (!response.ok) {
                const errorDetails = await response.json(); // If server provides error details
                console.error('Error details:', errorDetails);
                throw new Error('Failed to update patent');
            }
    
            const result = await response.json();
            console.log(result.message); // Log the success message
            navigate('/viewpatents'); // Redirect on success
        } catch (error) {
            console.error('Error updating patent:', error);
            alert(error.message || 'Failed to update patent');
        }
    };
    
    const handleCancel = () => {
        navigate('/viewpatents'); // Navigate to view publications page on cancel
    };

    return (
        <div className="container my-4">
            <h2>Edit Patent</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    {pub.category && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Category</label>
                            <input
                                type="text"
                                className="form-control"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.iprType && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Type of IPR</label>
                            <input
                                type="text"
                                className="form-control"
                                name="iprType"
                                value={formData.iprType}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.applicationNumber && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Application Number</label>
                            <input
                                type="text"
                                className="form-control"
                                name="applicationNumber"
                                value={formData.applicationNumber}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.applicantName && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Applicant Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="applicantName"
                                value={formData.applicantName}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.department && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Department</label>
                            <input
                                type="text"
                                className="form-control"
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.filingDate && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Filing Date</label>
                            <input
                                type="text"
                                className="form-control"
                                name="filingDate"
                                value={formData.filingDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.inventionTitle && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Invention Title</label>
                            <input
                                type="text"
                                className="form-control"
                                name="inventionTitle"
                                value={formData.inventionTitle}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.numOfInventors && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Num Of Inventors</label>
                            <input
                                type="text"
                                className="form-control"
                                name="numOfInventors"
                                value={formData.numOfInventors}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.inventors && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Inventors</label>
                            <input
                                type="text"
                                className="form-control"
                                name="inventors"
                                value={formData.inventors}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.status && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Status</label>
                            <input
                                type="text"
                                className="form-control"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.dateOfPublished && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Date Of Published</label>
                            <input
                                type="text"
                                className="form-control"
                                name="dateOfPublished"
                                value={formData.dateOfPublished}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pub.dateOfGranted && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Date Of Granted</label>
                            <input
                                type="text"
                                className="form-control"
                                name="dateOfGranted"
                                value={formData.dateOfGranted}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                   
                    {pub.proofOfPatent && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Proof of Patent</label>
                            <div>
                                <small>Existing file:</small>
                            <a href={`http://localhost:5001/${pub.proofOfPatent}`} target="_blank" rel="noopener noreferrer">View Proof</a>
                            </div>
                            <input
                                type="file"
                                className="form-control"
                                name="proofOfPatent"
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

export default EditPatentsPage;
