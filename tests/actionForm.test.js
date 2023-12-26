import React from 'react';
import { render } from '@testing-library/react-native';
import ActionForm from '../components/form/actionForm.jsx';

const mockActionForm = {
  options: [
    {
      name: 'Option1',
      sections: [],
    },
    {
      name: 'Option2',
      sections: [],
    },
  ],
  sections: [],
};

const mockCurrentAction = {
  params: {
    option: 0,
  },
};

jest.mock('../contexts/WorkflowContext', () => ({
  useWorkflowContext: () => ({
    workflow: [],
    setWorkflow: jest.fn(),
    deleteNode: jest.fn(),
  }),
}));

describe('ActionForm', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <ActionForm
        actionForm={mockActionForm}
        currentAction={mockCurrentAction}
        setCurrentAction={jest.fn()}
        nodeId={1}
        previousNodeId={0}
        onFocus={() => {}}
      />
    );
    expect(getByText('Option1')).toBeTruthy();
  });
});