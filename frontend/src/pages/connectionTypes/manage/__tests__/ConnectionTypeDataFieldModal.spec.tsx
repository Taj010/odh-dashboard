import * as React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { act } from 'react';
import { ConnectionTypeDataFieldModal } from '#~/pages/connectionTypes/manage/ConnectionTypeDataFieldModal';
import { ShortTextField, TextField } from '#~/concepts/connectionTypes/types';

describe('ConnectionTypeDataFieldModal', () => {
  let onClose: jest.Mock;
  let onSubmit: jest.Mock;

  beforeEach(() => {
    onClose = jest.fn();
    onSubmit = jest.fn();
  });

  it('should render the modal', () => {
    render(<ConnectionTypeDataFieldModal onClose={onClose} onSubmit={onSubmit} />);

    const addButton = screen.getByTestId('modal-submit-button');
    expect(addButton).toBeDisabled();
    screen.getByTestId('modal-cancel-button').click();
    expect(onClose).toHaveBeenCalled();
  });

  it('should add a short text field', async () => {
    render(<ConnectionTypeDataFieldModal onClose={onClose} onSubmit={onSubmit} />);
    const fieldNameInput = screen.getByTestId('field-name-input');
    const fieldDescriptionInput = screen.getByTestId('field-description-input');
    const fieldEnvVarInput = screen.getByTestId('field-env-var-input');
    const typeSelectGroup = screen.getByTestId('field-type-select');
    const typeSelectToggle = within(typeSelectGroup).getByRole('button');

    act(() => {
      fireEvent.change(fieldNameInput, { target: { value: 'new-field' } });
      fireEvent.change(fieldDescriptionInput, { target: { value: 'test description' } });
      fireEvent.change(fieldEnvVarInput, { target: { value: 'TEST_ENV_VAR' } });
      typeSelectToggle.click();
    });

    const shortTextSelect = within(screen.getByTestId('field-short-text-select')).getByRole(
      'option',
    );

    act(() => {
      shortTextSelect.click();
    });

    await waitFor(() => expect(typeSelectToggle).toHaveAttribute('aria-expanded', 'false'));

    const fieldDefaultValueInput = screen.getByTestId('field-default-value');
    act(() => {
      fireEvent.change(fieldDefaultValueInput, { target: { value: 'default value' } });
    });

    screen.getByTestId('modal-submit-button').click();

    expect(onSubmit).toHaveBeenCalledWith({
      description: 'test description',
      envVar: 'TEST_ENV_VAR',
      name: 'new-field',
      properties: {
        defaultReadOnly: undefined,
        defaultValue: 'default value',
      },
      required: undefined,
      type: 'short-text',
    });
  });

  it('should auto generate env var if not entered', async () => {
    render(<ConnectionTypeDataFieldModal onClose={onClose} onSubmit={onSubmit} />);
    const fieldNameInput = screen.getByTestId('field-name-input');
    const fieldDescriptionInput = screen.getByTestId('field-description-input');
    const fieldEnvVarInput = screen.getByTestId('field-env-var-input');
    const typeSelectGroup = screen.getByTestId('field-type-select');
    const typeSelectToggle = within(typeSelectGroup).getByRole('button');

    // Autogenerated value test
    act(() => {
      fireEvent.change(fieldNameInput, { target: { value: 'another field' } });
      fireEvent.change(fieldDescriptionInput, { target: { value: 'test description' } });
      typeSelectToggle.click();
    });

    const shortTextSelect = within(screen.getByTestId('field-short-text-select')).getByRole(
      'option',
    );

    act(() => {
      shortTextSelect.click();
    });

    await waitFor(() => expect(typeSelectToggle).toHaveAttribute('aria-expanded', 'false'));

    screen.getByTestId('modal-submit-button').click();

    expect(onSubmit).toHaveBeenCalledWith({
      description: 'test description',
      envVar: 'ANOTHER_FIELD',
      name: 'another field',
      properties: {
        defaultReadOnly: undefined,
        defaultValue: undefined,
      },
      required: undefined,
      type: 'short-text',
    });

    // Override the autogenerated value and test it
    act(() => {
      fireEvent.change(fieldEnvVarInput, { target: { value: 'MANUAL_ENV_VAR_ENTRY' } });
      fireEvent.change(fieldNameInput, { target: { value: 'another field 2' } });
    });

    screen.getByTestId('modal-submit-button').click();

    expect(onSubmit).toHaveBeenCalledWith({
      description: 'test description',
      envVar: 'MANUAL_ENV_VAR_ENTRY',
      name: 'another field 2',
      properties: {
        defaultReadOnly: undefined,
        defaultValue: undefined,
      },
      required: undefined,
      type: 'short-text',
    });
  });

  it('should add a numeric field', async () => {
    render(<ConnectionTypeDataFieldModal onClose={onClose} onSubmit={onSubmit} />);
    const fieldNameInput = screen.getByTestId('field-name-input');
    const fieldDescriptionInput = screen.getByTestId('field-description-input');
    const fieldEnvVarInput = screen.getByTestId('field-env-var-input');
    const typeSelectGroup = screen.getByTestId('field-type-select');
    const typeSelectToggle = within(typeSelectGroup).getByRole('button');

    act(() => {
      fireEvent.change(fieldNameInput, { target: { value: 'new-field' } });
      fireEvent.change(fieldDescriptionInput, { target: { value: 'test description' } });
      fireEvent.change(fieldEnvVarInput, { target: { value: 'TEST_ENV_VAR' } });
      typeSelectToggle.click();
    });

    const numericSelect = within(screen.getByTestId('field-numeric-select')).getByRole('option');

    act(() => {
      numericSelect.click();
    });

    await waitFor(() => expect(typeSelectToggle).toHaveAttribute('aria-expanded', 'false'));

    const fieldDefaultValueInput = screen.getByTestId('field-default-value');
    act(() => {
      fireEvent.change(fieldDefaultValueInput, { target: { value: '10' } });
    });

    screen.getByTestId('modal-submit-button').click();

    expect(onSubmit).toHaveBeenCalledWith({
      description: 'test description',
      envVar: 'TEST_ENV_VAR',
      name: 'new-field',
      properties: {
        defaultReadOnly: undefined,
        defaultValue: 10,
      },
      required: undefined,
      type: 'numeric',
    });

    act(() => {
      fireEvent.change(fieldDefaultValueInput, { target: { value: 'not a number' } });
    });

    screen.getByTestId('modal-submit-button').click();

    expect(onSubmit).toHaveBeenCalledWith({
      description: 'test description',
      envVar: 'TEST_ENV_VAR',
      name: 'new-field',
      properties: {
        defaultReadOnly: undefined,
        defaultValue: undefined,
      },
      required: undefined,
      type: 'numeric',
    });

    const lowerThreshold = screen.getByTestId('lower-threshold');
    expect(lowerThreshold).not.toBeVisible();

    const advancedToggle = screen.getByTestId('advanced-settings-toggle');
    const toggleButton = within(advancedToggle).getByRole('button');

    act(() => {
      toggleButton.click();
    });

    expect(lowerThreshold).toBeVisible();
    act(() => {
      fireEvent.change(lowerThreshold, { target: { value: '10' } });
    });

    const upperThreshold = screen.getByTestId('upper-threshold');
    act(() => {
      fireEvent.change(upperThreshold, { target: { value: '100' } });
    });

    screen.getByTestId('modal-submit-button').click();

    expect(onSubmit).toHaveBeenCalledWith({
      description: 'test description',
      envVar: 'TEST_ENV_VAR',
      name: 'new-field',
      properties: {
        defaultReadOnly: undefined,
        defaultValue: undefined,
        min: 10,
        max: 100,
      },
      required: undefined,
      type: 'numeric',
    });

    // Setting the min greater than the max should disable the submit button
    act(() => {
      fireEvent.change(lowerThreshold, { target: { value: '10000' } });
    });

    expect(screen.getByTestId('modal-submit-button')).toBeDisabled();
  });

  it('should display env var conflict warning', () => {
    const field: ShortTextField = {
      type: 'short-text',
      name: 'test',
      envVar: 'test_envvar',
      properties: {},
    };
    const field2: TextField = {
      type: 'text',
      name: 'test-2',
      envVar: 'test_envvar',
      properties: {},
    };
    render(
      <ConnectionTypeDataFieldModal
        onClose={onClose}
        onSubmit={onSubmit}
        field={field}
        fields={[field, field2]}
      />,
    );
    const fieldEnvVarInput = screen.getByTestId('field-env-var-input');
    screen.getByTestId('envvar-conflict-warning');
    expect(screen.getByTestId('modal-submit-button')).not.toBeDisabled();

    act(() => {
      fireEvent.change(fieldEnvVarInput, { target: { value: 'new-env-value' } });
    });

    expect(screen.queryByTestId('envvar-conflict-warning')).not.toBeInTheDocument();
  });

  it('should not be able to submit until form is dirty', () => {
    const field: ShortTextField = {
      type: 'short-text',
      name: 'test',
      envVar: 'test_envvar',
      properties: {},
    };
    render(
      <ConnectionTypeDataFieldModal onClose={onClose} onSubmit={onSubmit} isEdit field={field} />,
    );

    const submitButton = screen.getByTestId('modal-submit-button');
    const fieldNameInput = screen.getByTestId('field-name-input');

    expect(submitButton).toBeDisabled();

    act(() => {
      fireEvent.change(fieldNameInput, { target: { value: 'new-field' } });
    });

    expect(submitButton).not.toBeDisabled();
  });

  it('should default to deferInput for hidden fields', async () => {
    render(<ConnectionTypeDataFieldModal onClose={onClose} onSubmit={onSubmit} />);
    const fieldNameInput = screen.getByTestId('field-name-input');
    const fieldDescriptionInput = screen.getByTestId('field-description-input');
    const fieldEnvVarInput = screen.getByTestId('field-env-var-input');
    const typeSelectGroup = screen.getByTestId('field-type-select');
    const typeSelectToggle = within(typeSelectGroup).getByRole('button');

    // text hidden field
    act(() => {
      fireEvent.change(fieldNameInput, { target: { value: 'hidden-field' } });
      fireEvent.change(fieldDescriptionInput, { target: { value: 'test description' } });
      fireEvent.change(fieldEnvVarInput, { target: { value: 'TEST_ENV_VAR' } });
      typeSelectToggle.click();
    });

    const hiddenSelect = within(screen.getByTestId('field-hidden-select')).getByRole('option');

    act(() => {
      hiddenSelect.click();
    });

    await waitFor(() => expect(typeSelectToggle).toHaveAttribute('aria-expanded', 'false'));

    // deferInput is checked by default and disabled for hidden field
    const fieldDeferInputCheckbox = screen.getByTestId('field-defer-input-checkbox');
    expect(fieldDeferInputCheckbox).toBeChecked();
    expect(fieldDeferInputCheckbox).toBeDisabled();
    expect(screen.queryByTestId('field-default-value')).not.toBeInTheDocument();
    expect(screen.queryByTestId('field-default-value-readonly-checkbox')).not.toBeInTheDocument();

    screen.getByTestId('modal-submit-button').click();

    expect(onSubmit).toHaveBeenCalledWith({
      description: 'test description',
      envVar: 'TEST_ENV_VAR',
      name: 'hidden-field',
      properties: {
        defaultReadOnly: undefined,
        defaultValue: undefined,
        deferInput: true,
      },
      required: undefined,
      type: 'hidden',
    });
  });

  it('should remove default value when deferInput is checked', async () => {
    render(<ConnectionTypeDataFieldModal onClose={onClose} onSubmit={onSubmit} />);
    const fieldNameInput = screen.getByTestId('field-name-input');
    const fieldDescriptionInput = screen.getByTestId('field-description-input');
    const fieldEnvVarInput = screen.getByTestId('field-env-var-input');

    act(() => {
      fireEvent.change(fieldNameInput, { target: { value: 'short-text' } });
      fireEvent.change(fieldDescriptionInput, { target: { value: 'test description' } });
      fireEvent.change(fieldEnvVarInput, { target: { value: 'TEST_ENV_VAR' } });
    });

    const fieldDeferInputCheckbox = screen.getByTestId('field-defer-input-checkbox');
    expect(fieldDeferInputCheckbox).not.toBeChecked();
    expect(screen.queryByTestId('field-default-value')).toBeInTheDocument();
    expect(screen.queryByTestId('field-default-value-readonly-checkbox')).toBeInTheDocument();

    const fieldDefaultValueInput = screen.getByTestId('field-default-value');
    act(() => {
      fireEvent.change(fieldDefaultValueInput, { target: { value: 'default value' } });
    });

    act(() => {
      fireEvent.click(fieldDeferInputCheckbox);
    });
    expect(fieldDeferInputCheckbox).toBeChecked();
    expect(screen.queryByTestId('field-default-value')).not.toBeInTheDocument();
    expect(screen.queryByTestId('field-default-value-readonly-checkbox')).not.toBeInTheDocument();

    screen.getByTestId('modal-submit-button').click();

    expect(onSubmit).toHaveBeenCalledWith({
      description: 'test description',
      envVar: 'TEST_ENV_VAR',
      name: 'short-text',
      properties: {
        defaultReadOnly: undefined,
        defaultValue: undefined,
        deferInput: true,
      },
      required: undefined,
      type: 'short-text',
    });
  });
});
