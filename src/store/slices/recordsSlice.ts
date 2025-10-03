import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RecordItem } from '../../App';
import { makeId } from '../../App';
import type { RootState } from '../index';
import { useAppSelector } from '../hooks';

export const loadRecords = createAsyncThunk('records/load', async (schemaId: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);
  
  const response = await fetch(`/api/records/${schemaId}.json`, {
    signal: controller.signal
  });
  clearTimeout(timeoutId);
  
  if (!response.ok) {
    throw new Error(`Failed to load ${schemaId} records`);
  }
  
  const records = await response.json();
  return { schemaId, records };
});

const recordsSlice = createSlice({
  name: 'records',
  initialState: {
    records: {} as { [schemaId: string]: RecordItem[] },
    loading: {} as { [schemaId: string]: boolean },
    editingId: null as string | null,
    form: {} as Record<string, string | number>,
    formErrors: {} as {[key: string]: string}
  },
  reducers: {
    setEditingId: (state, { payload }: PayloadAction<string | null>) => {
      state.editingId = payload;
      if (payload === null) {
        state.form = {};
        state.formErrors = {};
      }
    },
    setForm: (state, { payload }: PayloadAction<Record<string, string | number>>) => {
      state.form = payload;
      state.formErrors = {};
    },
    updateFormField: (state, { payload: { key, value } }: PayloadAction<{ key: string; value: string | number }>) => {
      state.form[key] = value;
    },
    setFormErrors: (state, { payload }: PayloadAction<{[key: string]: string}>) => {
      state.formErrors = payload;
    },
    clearForm: (state) => {
      state.form = {};
      state.formErrors = {};
    },
    addRecord: (state, { payload: { schemaId, record } }: PayloadAction<{ schemaId: string; record: any }>) => {
      if (!state.records[schemaId]) state.records[schemaId] = [];
      const maxId = state.records[schemaId].length > 0 ? Math.max(...state.records[schemaId].map(r => r.ID || 0)) : 0;
      state.records[schemaId].push({ ...record, id: makeId(), ID: maxId + 1 });
    },
    updateRecord: (state, { payload: { schemaId, id, updates } }: PayloadAction<any>) => {
      const index = state.records[schemaId]?.findIndex(r => r.id === id);
      if (index !== -1) state.records[schemaId][index] = { ...state.records[schemaId][index], ...updates };
      state.editingId = null;
    },
    deleteRecord: (state, { payload: { schemaId, id, confirm } }: PayloadAction<any>) => {
      if (confirm()) state.records[schemaId] = state.records[schemaId]?.filter(r => r.id !== id) || [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadRecords.pending, (state, { meta: { arg: schemaId } }) => {
        state.loading[schemaId] = true;
      })
      .addCase(loadRecords.fulfilled, (state, { payload: { schemaId, records } }) => {
        state.records[schemaId] = records;
        state.loading[schemaId] = false;
      })
      .addCase(loadRecords.rejected, (state, { meta: { arg: schemaId } }) => {
        state.loading[schemaId] = false;
      });
  }
});

export const { setEditingId, setForm, updateFormField, setFormErrors, clearForm, addRecord, updateRecord, deleteRecord } = recordsSlice.actions;

export const selectForm = (state: RootState) => state.records.form;

export function useSyncedForm(editingRecord: any) {
  const form = useAppSelector(selectForm);
  return editingRecord || form;
}

export default recordsSlice.reducer;