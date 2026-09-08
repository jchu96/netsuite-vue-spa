# Checkbox Date Fields

Read checkbox values using an explicit normalization for true/false and T/F when the API can return either. Write checkboxes as booleans using record.setValue. Do not assume that a SuiteQL date string preserves time; use N/format for account-formatted fields and document timezone boundaries. Validate dates before binding them. No project-specific helper is assumed to exist.
