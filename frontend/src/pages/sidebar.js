import React from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { Link } from "react-router-dom";

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
            <li key={index} className="mb-2">
              <Link
                to={`/${item.replace(/\s+/g, "").toLowerCase()}`}
                className="text-dark text-decoration-none"
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

const Sidebar = () => {
  const sections = [
    { title: "Publications", items: ["Add Publication", "View Publications"] },
    { title: "Patents", items: ["Add Patent", "View Patents"] },
    { title: "Seed Money", items: ["Add Seed Money", "View Seed Money"] },
    { title: "External Funded Projects", items: ["Add Project", "View Projects"] },
    { title: "Consultancy", items: ["Add Consultant", "View Consultants"] },
    { title: "Research Scholars", items: ["Add Scholar", "View Scholars"] },
    { title: "Proposals Submitted", items: ["Add Proposal", "View Proposals"] },
  ];

  return (
    <div className="bg-primary bg-opacity-25 min-vh-100 p-3">
      <ul className="list-unstyled m-0">
        {sections.map((section, index) => (
          <CollapsibleSection key={index} title={section.title} items={section.items} />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
