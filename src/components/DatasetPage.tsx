import { useState, useMemo } from "react";
import type { Schema, RecordItem, SetRecordsFunction } from "../App";
import { makeId } from "../App";
import { CRUDForm } from "./CRUDForm";
import { DataTable } from "./DataTable";

import "./DatasetPage.css";

export function DatasetPage({
  schema, 
  records, 
  setRecords
}: { 
  schema: Schema; 
  records: RecordItem[];
  setRecords: SetRecordsFunction;
  onDeleteSchema?: (id: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddRecord = (r: Omit<RecordItem, "id">) => {
    const existingRecords = records || [];
    const maxId = existingRecords.length > 0 ? Math.max(...existingRecords.map(rec => rec.ID || 0)) : 0;
    const newRecord = { ...r, id: makeId(), ID: maxId + 1 };
    setRecords(prev => ({
      ...prev,
      [schema.id]: [...(prev[schema.id] || []), newRecord]
    }));
  };

  const handleUpdateRecord = (id: string, updates: Partial<RecordItem>) => {
    setEditingId(null);
    setRecords(prev => ({
      ...prev,
      [schema.id]: (prev[schema.id] || []).map((r: RecordItem) => r.id === id ? { ...r, ...updates } : r)
    }));
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      setRecords(prev => ({
        ...prev,
        [schema.id]: (prev[schema.id] || []).filter((r: RecordItem) => r.id !== id)
      }));
    }
  };

  return (
    <div className="dataset-page">
      <h2>{schema.title}</h2>
      <div className="dataset-header">
        <div className="dataset-controls">
          <h3>CRUD Form</h3>
        </div>
      </div>

      <CRUDForm 
        schema={schema} 
        onSubmit={handleAddRecord} 
        editingRecord={useMemo(() => editingId ? records.find(r => r.id === editingId) : undefined, [editingId, records])} 
        onUpdate={handleUpdateRecord} 
        onCancelEdit={() => setEditingId(null)}
      />
      <DataTable 
        schema={schema} 
        records={records} 
        onDelete={handleDeleteRecord} 
        onEdit={setEditingId} 
      />
    </div>
  );
}