import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
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
export const makeId = () => crypto.randomUUID();

function DatasetRoute() {
  const { schemaId } = useParams();
  const schema = SCHEMAS.find(s => s.id === schemaId);
  
  if (!schema) {
    return <div><h1>Unknown dataset</h1></div>;
  }
  
  return <DatasetPage schema={schema} />;
}



export default function App() {
  return (
    <BrowserRouter>
      <div>
        <Nav schemas={SCHEMAS} />
          <main>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/dataset/:schemaId" element={<DatasetRoute />} />
            </Routes>
          </main>
      </div>
    </BrowserRouter>
  );
}
