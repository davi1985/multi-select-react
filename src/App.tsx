import { useState } from "react";
import { Select } from "./components/Select";
import { SelectOption } from "./components/types";

const options = [
  { label: "First", value: 1 },
  { label: "Second", value: 2 },
  { label: "Third", value: 3 },
  { label: "Fourth", value: 4 },
  { label: "Fifth", value: 5 },
];

export const App = () => {
  const [value1, setValue1] = useState<SelectOption[]>([options[0]]);
  const [value2, setValue2] = useState<SelectOption | undefined>(options[0]);

  return (
    <>
      <span style={{ fontSize: "13px" }}>Select Multiple</span>
      <Select
        multiple
        options={options}
        value={value1}
        onChange={(ev) => setValue1(ev)}
      />

      <div style={{ padding: "1rem", display: "block" }} />

      <span style={{ fontSize: "13px" }}>Select Single</span>
      <Select
        options={options}
        value={value2}
        onChange={(ev) => setValue2(ev)}
      />
    </>
  );
};
