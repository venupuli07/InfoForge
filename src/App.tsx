import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { SAMPLE_DATA } from "./sampleData";
import { SCHEMAS } from "./schemas";
import { Nav } from "./components/Nav";
import { WelcomePage } from "./components/WelcomePage";
import { DatasetPage } from "./components/DatasetPage";

export type FieldKind = "Integer" | "Float" | "SmallText" | "BigText" | "DateTime";

export type SchemaField = {
  key: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
};

export type Schema = {
  id: string;
  title: string;
  fields: SchemaField[];
};

export type RecordItem = { id: string; [k: string]: any };
export type SetRecordsFunction = React.Dispatch<React.SetStateAction<{[schemaId: string]: RecordItem[]}>>;
export const makeId = () => crypto.randomUUID();

function DatasetRoute({ records, setRecords }: {
  records: {[schemaId: string]: RecordItem[]};
  setRecords: SetRecordsFunction;
}) {
  const { schemaId } = useParams();
  const schema = SCHEMAS.find(s => s.id === schemaId);
  
  if (!schema) {
    return <div><h1>Unknown dataset</h1></div>;
  }
  
  return <DatasetPage schema={schema} records={records[schemaId] || []} setRecords={setRecords} />;
}



function AppContent() {
  const [records, setRecords] = useState<{[schemaId: string]: RecordItem[]}>({});
  
  useEffect(() => {
    setRecords(SAMPLE_DATA);
  }, []);
  
  return (
    <div>
      <Nav schemas={SCHEMAS} />
      <main>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/dataset/:schemaId" element={<DatasetRoute records={records} setRecords={setRecords} />} />

        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
