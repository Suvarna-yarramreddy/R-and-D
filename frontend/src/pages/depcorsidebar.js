import React from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { Link } from "react-router-dom";

// Collapsible Section Component
const CollapsibleSection = ({ title, items }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <li>
      <div
        className="d-flex justify-content-between align-items-center w-100 p-2 border-bottom"
        style={{ cursor: "pointer" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span>{isOpen ? <BsChevronUp /> : <BsChevronDown />}</span>
      </div>
      {isOpen && (
        <ul className="list-unstyled ms-3">
          {items.map((item, index) => (
            <li key={index} style={{ marginBottom: "8px" }}>
              <Link
                to={`/cor${item.replace(/\s+/g, "").toLowerCase()}`}  // Adding 'cor' prefix to the route
                style={{ textDecoration: "none", color: "#333" }}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

// Corsidebar Component for Coordinator
const Corsidebar = () => {
  const sections = [
    { title: "Publications", items: ["View Publications"] },
    { title: "Patents", items: ["View Patents"] },
    { title: "Seed Money", items: ["View Seed Money"] },
    { title: "External Funded Projects", items: ["View Projects"] },
    { title: "Consultancy", items: ["View Consultants"] },
    { title: "Research Scholars", items: ["View Scholars"] },
    { title: "Proposals Submitted", items: ["View Proposals"] },
  ];

  // Only display the sections for coordinator role
  return (
    <div className="bg-light p-3">
      <ul className="list-unstyled m-0">
        {sections.map((section, index) => (
          <CollapsibleSection key={index} title={section.title} items={section.items} />
        ))}
      </ul>
    </div>
  );
};

export default Corsidebar;
