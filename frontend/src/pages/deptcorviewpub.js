import React, { useState, useEffect } from "react";

const CorViewPublications = () => {
  const [publications, setPublications] = useState([]);
  const [visibleDocumentId, setVisibleDocumentId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [publicationToReject, setPublicationToReject] = useState(null);
  const [department, setDepartment] = useState("");
  const [error, setError] = useState(null); // State for error messages
  const coordinatorId = sessionStorage.getItem("coordinatorid");

  useEffect(() => {
    const fetchDepartmentAndPublications = async () => {
      try {
        // Fetch coordinator's department
        const departmentResponse = await fetch(
          `http://localhost:4001/getCoordinatorDepartment?coordinatorid=${coordinatorId}`
        );
        if (!departmentResponse.ok) throw new Error(await departmentResponse.text());
        const departmentData = await departmentResponse.json();
        setDepartment(departmentData.department);

        // Fetch all publications for the coordinator's department
        const publicationsResponse = await fetch(
          `http://localhost:4001/getPublicationsByDepartment?department=${departmentData.department}`
        );
        if (!publicationsResponse.ok) throw new Error(await publicationsResponse.text());
        const publicationsData = await publicationsResponse.json();
        setPublications(publicationsData);
      } catch (error) {
        setError("Error fetching data. Please try again.");
        console.error(error);
      }
    };

    if (coordinatorId) {
      fetchDepartmentAndPublications();
    }
  }, [coordinatorId]);

  const togglePublicationDetails = (documentId) => {
    setVisibleDocumentId((prevId) => (prevId === documentId ? null : documentId));
  };

  const approvePublication = async (documentId) => {
    try {
      const response = await fetch(`http://localhost:4001/approvePublication/${documentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(await response.text());
      setPublications(publications.filter((pub) => pub.documentid !== documentId));
    } catch (error) {
      setError("Error approving publication. Please try again.");
      console.error(error);
    }
  };

  const rejectPublication = async (documentId) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4001/rejectPublication/${documentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectionReason }),
      });

      if (!response.ok) throw new Error(await response.text());
      setPublications(publications.filter((pub) => pub.documentid !== documentId));
      setRejectionReason("");
      setPublicationToReject(null);
    } catch (error) {
      setError("Error rejecting publication. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="container my-4">
      <h1 className="text-center text-dark mb-4">Publications Pending Approval</h1>
      <p className="text-center text-dark mb-4">
        <strong>Department: </strong>
        {department || "Loading..."}
      </p>
      {error && <div className="alert alert-danger">{error}</div>}
      {publications.length > 0 ? (
        <div className="row">
          {publications.map((pub) => (
            <div className="col-md-6 mb-4" key={pub.documentid}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    Cite As:&nbsp;
                    <a
                      href="#!"
                      onClick={() => togglePublicationDetails(pub.documentid)}
                      className="text-primary"
                    >
                      {pub.citeAs}
                    </a>
                  </h5>
                  {visibleDocumentId === pub.documentid && (
                    <div className="card-details mt-2">
                      {/* Render publication details here */}
                    </div>
                  )}
                  <div className="mt-3">
                    <button
                      className="btn btn-success me-2"
                      onClick={() => approvePublication(pub.documentid)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => setPublicationToReject(pub.documentid)}
                    >
                      Reject
                    </button>
                  </div>
                  {publicationToReject === pub.documentid && (
                    <div className="mt-3">
                      <textarea
                        className="form-control"
                        rows="3"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter reason for rejection"
                      />
                      <button
                        className="btn btn-danger mt-2"
                        onClick={() => rejectPublication(pub.documentid)}
                      >
                        Submit Rejection
                      </button>
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

export default CorViewPublications;
