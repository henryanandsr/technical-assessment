export default function MultiSelectDropdown({
  formFieldName,
  options,
  selectedItems,
  onSelectionChange,
}: {
  formFieldName: string;
  options: string[];
  selectedItems: string[];
  onSelectionChange: (selectedItems: string[]) => void;
}) {
  const handleCheckboxChange = (selectedOption: string) => {
    const updatedSelection = selectedItems.includes(selectedOption)
      ? selectedItems.filter((item) => item !== selectedOption)
      : [...selectedItems, selectedOption];

    onSelectionChange(updatedSelection);
  };
  return (
    <div className="bg-bg3 px-4 py-2  ">
      <label className="relative">
        <input type="checkbox" className="hidden peer" />
        {formFieldName}

        <div className="absolute bg-white border transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto text-black">
          <ul>
            {options.map((option, i) => {
              return (
                <li key={option}>
                  <label className="flex whitespace-nowrap cursor-pointer px-2 py-1 transition-colors hover:bg-blue-100 [&:has(input:checked)]:bg-blue-200">
                    <input
                      type="checkbox"
                      name={formFieldName}
                      value={option}
                      className="cursor-pointer"
                      checked={selectedItems.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                    />
                    <span className="ml-1">{option}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </label>
    </div>
  );
}
