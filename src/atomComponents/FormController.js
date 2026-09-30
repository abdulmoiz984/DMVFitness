import React from 'react';
import { Formik } from 'formik';

const FormController = ({
  initialValues,
  validationSchema,
  validateOnChange = true,
  validateOnBlur = true,
  enableReinitialize = false,
  onSubmit,
  children,
  validate,
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    validateOnChange={validateOnChange}
    validateOnBlur={validateOnBlur}
    enableReinitialize={enableReinitialize}
    onSubmit={onSubmit}
    validate={validate}
  >
    {formikProps => {
      const enhancedProps = {
        ...formikProps,
        // Only surface an error once the field was touched or a submit happened.
        errors: Object.keys(formikProps?.errors || {}).reduce((acc, field) => {
          if (formikProps.touched[field] || formikProps.submitCount > 0) {
            acc[field] = formikProps.errors[field];
          }
          return acc;
        }, {}),
      };
      return <>{children(enhancedProps)}</>;
    }}
  </Formik>
);

export default FormController;
