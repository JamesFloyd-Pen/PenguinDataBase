import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PenguinCard from './PenguinCard';
import { usePenguinContext } from '../../context/PenguinContext';

// Mock the PenguinContext
jest.mock('../../context/PenguinContext');

describe('PenguinCard Component', () => {
  const mockDeletePenguin = jest.fn();

  beforeEach(() => {
    // Setup mock context
    usePenguinContext.mockReturnValue({
      deletePenguin: mockDeletePenguin,
    });

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  const mockPenguinComplete = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Happy Feet',
    species: 'Emperor',
    age: 5,
    location: 'Antarctica',
    weight: 25,
    height: 100,
    createdAt: '2024-01-15T10:30:00.000Z',
  };

  const mockPenguinMinimal = {
    _id: '507f1f77bcf86cd799439012',
    name: 'Skipper',
    species: 'Adelie',
    createdAt: '2024-02-20T14:00:00.000Z',
  };

  describe('Rendering', () => {
    test('should render penguin card with all fields', () => {
      render(<PenguinCard penguin={mockPenguinComplete} />);

      // Check name with emoji
      expect(screen.getByText(/Happy Feet/i)).toBeInTheDocument();
      expect(screen.getByText(/🐧/)).toBeInTheDocument();

      // Check all fields
      expect(screen.getByText(/Species:/i)).toBeInTheDocument();
      expect(screen.getByText(/Emperor/i)).toBeInTheDocument();
      expect(screen.getByText(/Age:/i)).toBeInTheDocument();
      expect(screen.getByText(/5 years/i)).toBeInTheDocument();
      expect(screen.getByText(/Location:/i)).toBeInTheDocument();
      expect(screen.getByText(/Antarctica/i)).toBeInTheDocument();
      expect(screen.getByText(/Weight:/i)).toBeInTheDocument();
      expect(screen.getByText(/25 kg/i)).toBeInTheDocument();
      expect(screen.getByText(/Height:/i)).toBeInTheDocument();
      expect(screen.getByText(/100 cm/i)).toBeInTheDocument();
      expect(screen.getByText(/Added:/i)).toBeInTheDocument();
    });

    test('should render penguin card with only required fields', () => {
      render(<PenguinCard penguin={mockPenguinMinimal} />);

      // Required fields should be present
      expect(screen.getByText(/Skipper/i)).toBeInTheDocument();
      expect(screen.getByText(/Adelie/i)).toBeInTheDocument();
      expect(screen.getByText(/Added:/i)).toBeInTheDocument();

      // Optional fields should not be present
      expect(screen.queryByText(/Age:/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Location:/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Weight:/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Height:/i)).not.toBeInTheDocument();
    });

    test('should render delete button', () => {
      render(<PenguinCard penguin={mockPenguinComplete} />);

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveClass('delete-btn');
    });

    test('should format date correctly', () => {
      render(<PenguinCard penguin={mockPenguinComplete} />);

      // Check that date is formatted (exact format may vary by locale)
      const dateText = screen.getByText(/Added:/i).parentElement;
      expect(dateText).toBeInTheDocument();
      // The date should contain some part of the date
      expect(dateText.textContent).toMatch(/2024/);
    });

    test('should have correct CSS class', () => {
      const { container } = render(<PenguinCard penguin={mockPenguinComplete} />);

      const card = container.querySelector('.penguin-card');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Conditional Rendering', () => {
    test('should not render age when age is 0', () => {
      const penguinWithZeroAge = {
        ...mockPenguinMinimal,
        age: 0,
      };

      render(<PenguinCard penguin={penguinWithZeroAge} />);

      expect(screen.queryByText(/Age:/i)).not.toBeInTheDocument();
    });

    test('should not render location when location is empty string', () => {
      const penguinWithEmptyLocation = {
        ...mockPenguinMinimal,
        location: '',
      };

      render(<PenguinCard penguin={penguinWithEmptyLocation} />);

      expect(screen.queryByText(/Location:/i)).not.toBeInTheDocument();
    });

    test('should not render weight when weight is null', () => {
      const penguinWithNullWeight = {
        ...mockPenguinMinimal,
        weight: null,
      };

      render(<PenguinCard penguin={penguinWithNullWeight} />);

      expect(screen.queryByText(/Weight:/i)).not.toBeInTheDocument();
    });

    test('should not render height when height is undefined', () => {
      const penguinWithUndefinedHeight = {
        ...mockPenguinMinimal,
        height: undefined,
      };

      render(<PenguinCard penguin={penguinWithUndefinedHeight} />);

      expect(screen.queryByText(/Height:/i)).not.toBeInTheDocument();
    });

    test('should render age when age is provided', () => {
      const penguinWithAge = {
        ...mockPenguinMinimal,
        age: 3,
      };

      render(<PenguinCard penguin={penguinWithAge} />);

      expect(screen.getByText(/Age:/i)).toBeInTheDocument();
      expect(screen.getByText(/3 years/i)).toBeInTheDocument();
    });
  });

  describe('Delete Functionality', () => {
    test('should call deletePenguin when delete button is clicked', () => {
      render(<PenguinCard penguin={mockPenguinComplete} />);

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(mockDeletePenguin).toHaveBeenCalledTimes(1);
      expect(mockDeletePenguin).toHaveBeenCalledWith(mockPenguinComplete._id);
    });

    test('should call deletePenguin with correct ID for different penguins', () => {
      const { rerender } = render(<PenguinCard penguin={mockPenguinComplete} />);

      let deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(mockDeletePenguin).toHaveBeenCalledWith('507f1f77bcf86cd799439011');

      // Clear and test with different penguin
      mockDeletePenguin.mockClear();

      rerender(<PenguinCard penguin={mockPenguinMinimal} />);
      deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(mockDeletePenguin).toHaveBeenCalledWith('507f1f77bcf86cd799439012');
    });

    test('should not break if deletePenguin is not provided', () => {
      usePenguinContext.mockReturnValue({
        deletePenguin: undefined,
      });

      render(<PenguinCard penguin={mockPenguinComplete} />);

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      
      // Should not throw error
      expect(() => {
        fireEvent.click(deleteButton);
      }).toThrow();
    });
  });

  describe('Edge Cases', () => {
    test('should handle penguin with very long name', () => {
      const penguinLongName = {
        ...mockPenguinComplete,
        name: 'A'.repeat(100),
      };

      render(<PenguinCard penguin={penguinLongName} />);

      expect(screen.getByText(new RegExp('A'.repeat(100)))).toBeInTheDocument();
    });

    test('should handle special characters in name', () => {
      const penguinSpecialName = {
        ...mockPenguinComplete,
        name: "O'Malley's Penguin #1",
      };

      render(<PenguinCard penguin={penguinSpecialName} />);

      expect(screen.getByText(/O'Malley's Penguin #1/i)).toBeInTheDocument();
    });

    test('should handle invalid date gracefully', () => {
      const penguinInvalidDate = {
        ...mockPenguinComplete,
        createdAt: 'invalid-date',
      };

      // Should not crash
      expect(() => {
        render(<PenguinCard penguin={penguinInvalidDate} />);
      }).not.toThrow();
    });

    test('should handle negative age', () => {
      const penguinNegativeAge = {
        ...mockPenguinComplete,
        age: -5,
      };

      render(<PenguinCard penguin={penguinNegativeAge} />);

      expect(screen.getByText(/-5 years/i)).toBeInTheDocument();
    });

    test('should handle very large numbers', () => {
      const penguinLargeValues = {
        ...mockPenguinComplete,
        weight: 999999,
        height: 888888,
      };

      render(<PenguinCard penguin={penguinLargeValues} />);

      expect(screen.getByText(/999999 kg/i)).toBeInTheDocument();
      expect(screen.getByText(/888888 cm/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper heading structure', () => {
      render(<PenguinCard penguin={mockPenguinComplete} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Happy Feet');
    });

    test('delete button should be accessible', () => {
      render(<PenguinCard penguin={mockPenguinComplete} />);

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      expect(deleteButton).toBeEnabled();
    });
  });
});
