import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  Database,
} from "lucide-react";

// Inline styles as a workaround
const styles = `
  .ead3-container {
    width: 100%;
    min-height: 100vh;
    background-color: #f9fafb;
    overflow: auto;
    padding: 24px;
  }
  
  .ead3-content {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .header-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 24px;
    margin-bottom: 24px;
  }
  
  .main-title {
    font-size: 30px;
    font-weight: bold;
    color: #1f2937;
    margin: 0 0 8px 0;
  }
  
  .subtitle {
    color: #6b7280;
    margin: 0 0 16px 0;
  }
  
  .button-group {
    display: flex;
    gap: 8px;
  }
  
  .view-button {
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
    background-color: #e5e7eb;
    color: #374151;
  }
  
  .view-button:hover {
    background-color: #d1d5db;
  }
  
  .view-button.active {
    background-color: #2563eb;
    color: white;
  }
  
  .content-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 24px;
  }
  
  .legend {
    display: flex;
    gap: 24px;
    margin-bottom: 16px;
    font-size: 14px;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .icon {
    width: 16px;
    height: 16px;
  }
  
  .icon-purple {
    color: #9333ea;
  }
  
  .icon-blue {
    color: #2563eb;
  }
  
  .icon-green {
    color: #16a34a;
  }
  
  .chevron {
    width: 16px;
    height: 16px;
    color: #6b7280;
  }
  
  .chevron-placeholder {
    width: 16px;
  }
  
  .node-container {
    user-select: none;
  }
  
  .node {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    margin-bottom: 4px;
    border-radius: 6px;
    border: 1px solid;
    cursor: pointer;
    transition: box-shadow 0.2s;
  }
  
  .node:hover {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  
  .node-root {
    background-color: #faf5ff;
    border-color: #e9d5ff;
  }
  
  .node-section {
    background-color: #eff6ff;
    border-color: #bfdbfe;
  }
  
  .node-class {
    background-color: #f0fdf4;
    border-color: #bbf7d0;
  }
  
  .node-name {
    font-family: 'Courier New', monospace;
    font-size: 14px;
    font-weight: 600;
  }
  
  .key-classes {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .key-class-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 24px;
  }
  
  .key-class-title {
    font-size: 20px;
    font-weight: bold;
    color: #1f2937;
    margin: 0 0 8px 0;
  }
  
  .key-class-purpose {
    color: #6b7280;
    margin: 0 0 12px 0;
  }
  
  .key-class-section {
    margin-bottom: 12px;
  }
  
  .section-title {
    font-weight: 600;
    font-size: 14px;
    color: #374151;
    margin: 0 0 8px 0;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .tag {
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .tag-property {
    background-color: #dbeafe;
    color: #1e40af;
    font-family: 'Courier New', monospace;
  }
  
  .tag-usage {
    background-color: #dcfce7;
    color: #166534;
  }
  
  .example-code {
    background-color: #f3f4f6;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 14px;
    display: inline-block;
  }
  
  .overview-card {
    background: linear-gradient(to right, #faf5ff, #eff6ff);
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 24px;
    border: 2px solid #e9d5ff;
  }
  
  .overview-title {
    font-size: 20px;
    font-weight: bold;
    color: #1f2937;
    margin: 0 0 12px 0;
  }
  
  .overview-content {
    color: #374151;
  }
  
  .overview-content p {
    margin: 0 0 8px 0;
  }
  
  .overview-content .indent-1 {
    margin-left: 16px;
  }
  
  .overview-content .indent-2 {
    margin-left: 32px;
  }
`;

type NodeType = "root" | "section" | "class" | "property";

interface ClassNodeProps {
  name: string;
  children?: ClassNodeProps[];
  level?: number;
  type?: NodeType;
}

const ClassNode: React.FC<ClassNodeProps> = ({
  name,
  children,
  level = 0,
  type = "class",
}) => {
  const [expanded, setExpanded] = useState(level < 2);

  const indent = level * 24;
  const hasChildren = children && children.length > 0;

  const getIcon = () => {
    if (type === "root") return <Database className="icon icon-purple" />;
    if (type === "section") return <Folder className="icon icon-blue" />;
    return <FileText className="icon icon-green" />;
  };

  const getClassName = () => {
    if (type === "root") return "node-root";
    if (type === "section") return "node-section";
    return "node-class";
  };

  return (
    <div className="node-container">
      <div
        className={`node ${getClassName()}`}
        style={{ marginLeft: `${indent}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren &&
          (expanded ? (
            <ChevronDown className="chevron" />
          ) : (
            <ChevronRight className="chevron" />
          ))}
        {!hasChildren && <div className="chevron-placeholder" />}
        {getIcon()}
        <span className="node-name">{name}</span>
      </div>

      {expanded && hasChildren && (
        <div>
          {children.map((child: ClassNodeProps, idx: number) => (
            <ClassNode key={idx} {...child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

interface KeyClass {
  name: string;
  purpose: string;
  properties: string[];
  usedIn?: string[];
  example?: string;
}

const EAD3Structure: React.FC = () => {
  const [view, setView] = useState<"hierarchy" | "key">("hierarchy");

  const structure: ClassNodeProps = {
    name: "Ead",
    type: "root" as const,
    children: [
      {
        name: "Control",
        type: "section" as const,
        children: [
          { name: "RecordId" },
          {
            name: "FileDesc",
            type: "class" as const,
            children: [
              {
                name: "TitleStmt",
                children: [
                  { name: "TitleProper" },
                  { name: "Subtitle" },
                  { name: "Author" },
                ],
              },
              {
                name: "PublicationStmt",
                children: [
                  { name: "Publisher" },
                  { name: "Date (EadDate)" },
                  {
                    name: "Address",
                    children: [{ name: "AddressLines (List<string>)" }],
                  },
                ],
              },
              {
                name: "NoteStmt",
                children: [
                  {
                    name: "ControlNote",
                    children: [
                      {
                        name: "Paragraph (ParagraphWithRef)",
                        children: [
                          { name: "Text" },
                          { name: "Ref (Reference)" },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "MaintenanceStatus",
            children: [{ name: "Value" }],
          },
          {
            name: "MaintenanceAgency",
            children: [
              { name: "CountryCode" },
              { name: "AgencyCode" },
              { name: "AgencyName" },
            ],
          },
          {
            name: "LanguageDeclaration",
            children: [
              {
                name: "Language",
                children: [{ name: "LangCode" }, { name: "Text" }],
              },
              {
                name: "Script",
                children: [{ name: "ScriptCode" }, { name: "Text" }],
              },
              {
                name: "DescriptiveNote",
                children: [{ name: "Paragraph" }],
              },
            ],
          },
          {
            name: "LocalTypeDeclaration",
            children: [
              { name: "Abbreviation" },
              {
                name: "Citation",
                children: [
                  { name: "Href" },
                  { name: "LinkTitle" },
                  { name: "Text" },
                ],
              },
            ],
          },
          {
            name: "MaintenanceHistory",
            children: [
              {
                name: "MaintenanceEvents (List)",
                children: [
                  {
                    name: "MaintenanceEvent",
                    children: [
                      { name: "EventType" },
                      { name: "EventDateTime" },
                      { name: "AgentType" },
                      { name: "Agent" },
                      { name: "EventDescription" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "ArchDesc",
        type: "section" as const,
        children: [
          { name: "Level" },
          { name: "LocalType" },
          {
            name: "Did",
            type: "class" as const,
            children: [
              { name: "Head" },
              { name: "UnitTitle" },
              {
                name: "UnitId",
                children: [{ name: "Identifier" }, { name: "Text" }],
              },
              {
                name: "UnitDate",
                children: [
                  { name: "Calendar" },
                  { name: "Era" },
                  { name: "Normal" },
                  { name: "Text" },
                ],
              },
              {
                name: "Repository",
                children: [
                  {
                    name: "CorpName",
                    children: [{ name: "Parts (List<Part>)" }],
                  },
                ],
              },
              {
                name: "LangMaterial",
                children: [
                  {
                    name: "LanguageSet",
                    children: [{ name: "Language" }, { name: "Script" }],
                  },
                ],
              },
              {
                name: "Origination",
                children: [
                  {
                    name: "PersName",
                    children: [
                      { name: "Identifier" },
                      { name: "Relator" },
                      { name: "Parts (List<Part>)" },
                    ],
                  },
                ],
              },
              {
                name: "Abstract",
                children: [{ name: "Lang" }, { name: "Text" }],
              },
            ],
          },
          {
            name: "Dsc (Description of Subordinate Components)",
            type: "class" as const,
            children: [
              { name: "DscType" },
              { name: "Head" },
              {
                name: "Components (List<Component>)",
                children: [
                  {
                    name: "Component",
                    children: [
                      { name: "Level" },
                      {
                        name: "Did (ComponentDid)",
                        children: [
                          { name: "UnitId" },
                          {
                            name: "UnitTitle",
                            children: [
                              { name: "Text" },
                              {
                                name: "GenreForm",
                                children: [{ name: "Parts (List<Part>)" }],
                              },
                            ],
                          },
                          { name: "UnitDate" },
                          {
                            name: "DaoSet",
                            children: [
                              {
                                name: "Daos (List<Dao>)",
                                children: [
                                  {
                                    name: "Dao (Digital Archive Object)",
                                    children: [
                                      { name: "DaoType" },
                                      { name: "Coverage" },
                                      { name: "Actuate" },
                                      { name: "Show" },
                                      { name: "LinkTitle" },
                                      { name: "LocalType" },
                                      { name: "Href" },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        name: "ScopeContent",
                        children: [
                          {
                            name: "ChronList",
                            children: [
                              {
                                name: "ChronItems (List)",
                                children: [
                                  {
                                    name: "ChronItem",
                                    children: [
                                      {
                                        name: "DateSingle",
                                        children: [
                                          { name: "StandardDate" },
                                          { name: "Text" },
                                        ],
                                      },
                                      {
                                        name: "Event",
                                        children: [
                                          { name: "LocalType" },
                                          {
                                            name: "PersonNames (List<PersName>)",
                                          },
                                          {
                                            name: "CorporateNames (List<CorpName>)",
                                          },
                                          {
                                            name: "GeographicNames (List<GeogName>)",
                                            children: [
                                              {
                                                name: "GeogName",
                                                children: [
                                                  { name: "Identifier" },
                                                  { name: "Part" },
                                                  {
                                                    name: "GeographicCoordinates",
                                                    children: [
                                                      {
                                                        name: "CoordinateSystem",
                                                      },
                                                      {
                                                        name: "Text (coordinates)",
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                          {
                                            name: "Subjects (List<Subject>)",
                                            children: [
                                              {
                                                name: "Subject",
                                                children: [
                                                  {
                                                    name: "Parts (List<Part>)",
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const keyClasses: KeyClass[] = [
    {
      name: "Part",
      purpose: "Reusable component for structured name parts",
      properties: ["LocalType", "Rules", "Lang", "Text"],
      usedIn: ["PersName", "CorpName", "GenreForm", "Subject"],
    },
    {
      name: "PersName",
      purpose: "Person name with structured parts",
      properties: ["Identifier", "Relator", "Rules", "Parts (List<Part>)"],
      example: "Christoffel Johan Meindert Heufke",
    },
    {
      name: "Component",
      purpose: "Individual archive item/record",
      properties: ["Level", "Did", "ScopeContent"],
      example: "Notary record, testament, inventory",
    },
    {
      name: "Event",
      purpose: "Historical event with actors and subjects",
      properties: [
        "LocalType",
        "PersonNames",
        "CorporateNames",
        "GeographicNames",
        "Subjects",
      ],
      example: "Testament, sale, inventory",
    },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="ead3-container">
        <div className="ead3-content">
          <div className="header-card">
            <h1 className="main-title">EAD3 Class Structure</h1>
            <p className="subtitle">Archives Portal Europe Foundation Format</p>

            <div className="button-group">
              <button
                onClick={() => setView("hierarchy")}
                className={`view-button ${
                  view === "hierarchy" ? "active" : ""
                }`}
              >
                Hierarchy View
              </button>
              <button
                onClick={() => setView("key")}
                className={`view-button ${view === "key" ? "active" : ""}`}
              >
                Key Classes
              </button>
            </div>
          </div>

          {view === "hierarchy" && (
            <div className="content-card">
              <div className="legend">
                <div className="legend-item">
                  <Database className="icon icon-purple" />
                  <span>Root Element</span>
                </div>
                <div className="legend-item">
                  <Folder className="icon icon-blue" />
                  <span>Main Section</span>
                </div>
                <div className="legend-item">
                  <FileText className="icon icon-green" />
                  <span>Class/Property</span>
                </div>
              </div>

              <ClassNode {...structure} />
            </div>
          )}

          {view === "key" && (
            <div className="key-classes">
              {keyClasses.map((cls: KeyClass, idx: number) => (
                <div key={idx} className="key-class-card">
                  <h3 className="key-class-title">{cls.name}</h3>
                  <p className="key-class-purpose">{cls.purpose}</p>

                  <div className="key-class-section">
                    <h4 className="section-title">Properties:</h4>
                    <div className="tags">
                      {cls.properties.map((prop: string, i: number) => (
                        <span key={i} className="tag tag-property">
                          {prop}
                        </span>
                      ))}
                    </div>
                  </div>

                  {cls.usedIn && (
                    <div className="key-class-section">
                      <h4 className="section-title">Used in:</h4>
                      <div className="tags">
                        {cls.usedIn.map((usage: string, i: number) => (
                          <span key={i} className="tag tag-usage">
                            {usage}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {cls.example && (
                    <div className="key-class-section">
                      <h4 className="section-title">Example:</h4>
                      <code className="example-code">{cls.example}</code>
                    </div>
                  )}
                </div>
              ))}

              <div className="overview-card">
                <h3 className="overview-title">Structure Overview</h3>
                <div className="overview-content">
                  <p>
                    <strong>Control:</strong> Metadata about the archive
                    document itself (who created it, when, maintenance history)
                  </p>
                  <p>
                    <strong>ArchDesc:</strong> Description of the archive
                    content
                  </p>
                  <p className="indent-1">
                    <strong>Did:</strong> Descriptive identification (title,
                    dates, creator, location)
                  </p>
                  <p className="indent-1">
                    <strong>Dsc:</strong> Description of subordinate components
                    (the actual archive items/records)
                  </p>
                  <p className="indent-2">
                    <strong>Component:</strong> Individual archive item with
                    events, people, places, and digital scans
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EAD3Structure;
