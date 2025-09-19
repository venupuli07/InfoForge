import type { Schema, RecordItem } from "../App";
import "./DataTable.css";

export function DataTable({ schema, records, onDelete, onEdit }: {
  schema: Schema;
  records: RecordItem[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  return (
    <div className="data-table-container">
      <h3>Records ({records.length})</h3>
      {records.length === 0 ? (
        <p className="no-records">No records found. Add some records above.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              {schema.fields.map((field) => (
                <th key={field.key}>{field.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                {schema.fields.map((field) => (
                  <td key={field.key}>
                    {field.kind === "DateTime" 
                      ? (() => {
                          const date = new Date(record[field.key]);
                          return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
                        })()
                      : record[field.key]?.toString() || ""
                    }
                  </td>
                ))}
                <td className="actions">
                  <button 
                    className="edit-btn" 
                    onClick={() => onEdit(record.id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => onDelete(record.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}