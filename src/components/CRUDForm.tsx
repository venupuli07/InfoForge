import { useState, useEffect } from "react";
import type { Schema, RecordItem, FieldKind } from "../App";
import "./CRUDForm.css";
import "../App.css";

interface CRUDFormProps {
  schema: Schema;
  onSubmit: (r: Omit<RecordItem, "id">) => void;
  editingRecord?: RecordItem;
  onUpdate?: (id: string, updates: Partial<RecordItem>) => void;
  onCancelEdit?: () => void;
}

export function CRUDForm({ schema, onSubmit, editingRecord, onUpdate, onCancelEdit }: CRUDFormProps) {
  const [form, setForm] = useState<Record<string, string | number>>({});
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (editingRecord) {
      setForm(editingRecord);
    } else {
      setForm({});
    }
  }, [editingRecord]);

  useEffect(() => {
    setForm({});
    setErrors({});
  }, [schema.id]);

  const getInputType = (kind: FieldKind) => {
    switch (kind) {
      case "Integer": return "number";
      case "Float": return "number";
      case "DateTime": return "datetime-local";
      default: return "text";
    }
  };

  const validateField = (value: any, kind: FieldKind, required?: boolean) => {
    if (required && (!value || value.toString().trim() === "")) {
      return "This field is required";
    }
    if (value && value.toString().trim() !== "") {
      if (kind === "Integer") {
        const num = Number(value);
        if (!Number.isInteger(num) || num < 0) {
          return "Must be a positive whole number";
        }
      }
      if (kind === "Float") {
        const num = Number(value);
        if (isNaN(num) || num < 0) {
          return "Must be a positive number";
        }
      }
      if (kind === "SmallText" && value.toString().length > 100) {
        return "Text must be 100 characters or less";
      }
    }
    return "";
  };

  const handleChange = (key: string, value: string, kind: FieldKind, required?: boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
    const error = validateField(value, kind, required);
    setErrors(prev => ({ ...prev, [key]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: {[key: string]: string} = {};
    schema.fields.filter(f => f.key !== 'ID').forEach(field => {
      const error = validateField(form[field.key], field.kind, field.required);
      if (error) newErrors[field.key] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingRecord && onUpdate) {
      onUpdate(editingRecord.id, form);
    } else {
      onSubmit(form);
    }
    setForm({});
    setErrors({});
  };

  const handleCancel = () => {
    setForm({});
    setErrors({});
  };

  return (
    <form className="crud-form" onSubmit={handleSubmit}>
      <h3>{editingRecord ? "Edit Record" : `Add ${schema.title} Record`}</h3>
      {schema.fields.filter(f => f.key !== 'ID').map((f) => (
        <div key={f.key} className="form-row">
          <label>{f.label} {f.required && <span className="required">*</span>}</label>
          {f.kind === "BigText" ? (
            <textarea 
              value={form[f.key] || ""} 
              onChange={(e) => handleChange(f.key, e.target.value, f.kind, f.required)}
              className={errors[f.key] ? "error" : ""}
            />
          ) : (
            <input 
              type={getInputType(f.kind)} 
              value={form[f.key] || ""} 
              onChange={(e) => handleChange(f.key, e.target.value, f.kind, f.required)}
              className={errors[f.key] ? "error" : ""}
              step={f.kind === "Float" ? "0.01" : undefined}
            />
          )}
          {errors[f.key] && <span className="error-message">{errors[f.key]}</span>}
        </div>
      ))}
      <div className="form-actions">
        <button type="submit">{editingRecord ? "Update" : "Add"} Record</button>
        {editingRecord && onCancelEdit && (
          <button type="button" onClick={onCancelEdit} className="cancel-btn">Cancel</button>
        )}
        {!editingRecord && (
          <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
        )}
      </div>
    </form>
  );
}