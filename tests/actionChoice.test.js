import React from 'react';
import { render } from '@testing-library/react-native';
import ActionChoice from '../components/actions/actionChoice.jsx';
import { useNavigation } from '@react-navigation/native';
import { useWorkflowContext } from '../contexts/WorkflowContext';

// Mock hooks
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('../contexts/WorkflowContext', () => ({
  useWorkflowContext: () => ({
    setWorkflow: jest.fn(),
    workflow: [],
    trigger: {},
    setTrigger: jest.fn(),
  }),
}));

describe('ActionChoice', () => {
  it('renders correctly', () => {
    const mockService = {
      name: 'Test Service',
      actions: [
        { name: 'Action1', icon: 'icon1', eg: 'Example1' },
        { name: 'Action2', icon: 'icon2', eg: 'Example2' },
      ],
    };

    const { getByText } = render(<ActionChoice service={mockService} />);

    expect(getByText('Test Service actions')).toBeTruthy();
    expect(getByText('Action1')).toBeTruthy();
    expect(getByText('E.g. "Example1"')).toBeTruthy();
  });
});
