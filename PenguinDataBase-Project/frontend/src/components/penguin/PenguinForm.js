import React, { useState } from 'react';
import { usePenguinContext } from '../../context/PenguinContext';
import { INITIAL_FORM_DATA, PENGUIN_FORM_FIELDS } from '../../utils/constants';

const PenguinForm = () => {
  const { addPenguin, loading } = usePenguinContext();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addPenguin(formData);
    if (success) {
      setFormData(INITIAL_FORM_DATA);
    }
  };

  // Create form fields dynamically from constants
  const renderFormField = (fieldName, fieldConfig) => (
    <input
      key={fieldName}
      type={fieldConfig.type}
      name={fieldName}
      placeholder={fieldConfig.placeholder}
      value={formData[fieldName]}
      onChange={handleInputChange}
      required={fieldConfig.required}
      step={fieldConfig.step}
    />
  );

  // Group fields into rows for layout
  const fieldRows = [
    ['name', 'species'],
    ['age', 'location'],
    ['weight', 'height']
  ];

  return (
    <div className="penguin-form-container">
      <h2>Add New Penguin</h2>
      <form onSubmit={handleSubmit} className="penguin-form">
        {fieldRows.map((row, rowIndex) => (
          <div key={rowIndex} className="form-row">
            {row.map(fieldName => 
              renderFormField(fieldName, PENGUIN_FORM_FIELDS[fieldName])
            )}
          </div>
        ))}
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : '🐧 Add Penguin'}
        </button>
      </form>
    </div>
  );
};

export default PenguinForm;