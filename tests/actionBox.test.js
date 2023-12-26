import React from 'react';
import { render } from '@testing-library/react-native';
import ActionBox from '../components/actions/actionBox.jsx';



const mockWorkflow = [
  {
    id: 1,
    service: 'ServiceName1',
    action: 'ActionName1',
  },
  {
    id: 2,
    service: 'ServiceName2',
    action: 'ActionName2',
  },
];


jest.mock('../contexts/WorkflowContext', () => ({
  useWorkflowContext: () => ({
    workflow: mockWorkflow,
    setWorkflow: jest.fn(),
    deleteNode: jest.fn(),
  }),
}));
describe('ActionBox', () => {
  it('renders correctly', () => {
    const { getByText } = render(<ActionBox nodeId={1} previousNodeId={0} onFocus={() => {}} />);
    expect(getByText('ActionName1')).toBeTruthy();
  });
});

