import React from 'react';
import { COMPONENT_STYLES, TYPOGRAPHY } from '../../utils/DesignSystem';

/**
 * Accessible input component with standardized styling, accessibility features and error handling
 * 
 * @param {Object} props
 * @param {string} props.id - Unique ID for the input element (required)
 * @param {string} props.name - Name attribute for the input element
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.label - Label text
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler function
 * @param {string} props.error - Error message (if any)
 * @param {boolean} props.required - If the field is required
 * @param {boolean} props.disabled - If the field is disabled
 * @param {string} props.className - Additional classes for the container
 * @param {Object} props.labelProps - Additional props for the label element
 * @param {Object} props.inputProps - Additional props for the input element
 */
const AccessibleInput = ({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  labelProps = {},
  inputProps = {},
  ...restProps
}) => {
  // Generate unique IDs for accessibility
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : undefined;
  
  const inputClasses = `
    ${COMPONENT_STYLES.INPUT.BASE}
    ${COMPONENT_STYLES.INPUT.FOCUS}
    ${COMPONENT_STYLES.INPUT.HOVER}
    ${COMPONENT_STYLES.INPUT.PLACEHOLDER}
    ${disabled ? COMPONENT_STYLES.INPUT.DISABLED : ''}
    ${error ? COMPONENT_STYLES.INPUT.ERROR : ''}
  `;
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id}
          className={`block ${TYPOGRAPHY.FONT_SIZE.BASE} ${TYPOGRAPHY.FONT_WEIGHT.MEDIUM} text-neutral-700 mb-1.5`}
          {...labelProps}
        >
          {label}
          {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      
      <input
        id={id}
        name={name || id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        className={inputClasses}
        {...inputProps}
        {...restProps}
      />
      
      {error && (
        <p 
          id={errorId}
          className={`mt-1.5 ${TYPOGRAPHY.FONT_SIZE.SM} text-rose-600`}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default AccessibleInput; 