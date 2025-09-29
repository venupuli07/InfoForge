import type { Schema, RecordItem } from "../App";
import { CRUDForm } from "./CRUDForm";
import { DataTable } from "./DataTable";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setEditingId, addRecord, updateRecord, deleteRecord, selectRecordsWithAutoLoad, selectRecordsLoading } from "../store/slices/recordsSlice";

import "./DatasetPage.css";

export function DatasetPage({ schema }: { schema: Schema }) {
  const dispatch = useAppDispatch();
  const records = useAppSelector(state => selectRecordsWithAutoLoad(schema.id)(state, dispatch));
  const isLoading = useAppSelector(state => selectRecordsLoading(schema.id)(state));
  const editingId = useAppSelector(state => state.records.editingId);

  const handleAddRecord = (r: Omit<RecordItem, "id">) => {
    dispatch(addRecord({ schemaId: schema.id, record: r }));
  };

  const handleUpdateRecord = (id: string, updates: Partial<RecordItem>) => {
    dispatch(updateRecord({ schemaId: schema.id, id, updates }));
  };

  const handleDeleteRecord = (id: string) => {
    dispatch(deleteRecord({ schemaId: schema.id, id, confirm: () => confirm('Are you sure you want to delete this record?') }));
  };

  const editingRecord = editingId && records.length > 0 ? records.find((r: RecordItem) => r.id === editingId) : undefined;

  return (
    <div className="dataset-page">
      <h2>{schema.title}</h2>
      <div className="dataset-header">
        <div className="dataset-controls">
          <h3>CRUD Form</h3>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-mask">
          <div className="loading-spinner">Loading...</div>
        </div>
      ) : (
        <>
          <CRUDForm
            schema={schema}
            onSubmit={handleAddRecord}
            editingRecord={editingRecord}
            onUpdate={handleUpdateRecord}
            onCancelEdit={() => dispatch(setEditingId(null))}
          />
          <DataTable 
            schema={schema}
            records={records}
            onDelete={handleDeleteRecord}
            onEdit={(id) => dispatch(setEditingId(id))}
          />
        </>
      )}
    </div>
  );
}