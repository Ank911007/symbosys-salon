import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';

describe('Input Component', () => {
  it('renders correctly with default props', () => {
    render(<Input placeholder="Enter text" />);
    
    const inputElement = screen.getByPlaceholderText('Enter text');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'text');
  });

  it('renders the label when provided', () => {
    render(<Input label="Email Address" id="email" />);
    
    const labelElement = screen.getByText('Email Address');
    expect(labelElement).toBeInTheDocument();
  });

  it('renders error message when error prop is provided', () => {
    render(<Input error="This field is required" />);
    
    const errorElement = screen.getByText('This field is required');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveClass('text-red-500');
  });

  it('applies error styling to the input border', () => {
    render(<Input placeholder="Error State" error="Error" />);
    
    const inputElement = screen.getByPlaceholderText('Error State');
    expect(inputElement).toHaveClass('border-red-500');
  });

  it('passes down standard HTML input attributes', () => {
    render(<Input type="password" disabled required data-testid="custom-input" />);
    
    const inputElement = screen.getByTestId('custom-input');
    expect(inputElement).toHaveAttribute('type', 'password');
    expect(inputElement).toBeDisabled();
    expect(inputElement).toBeRequired();
  });

  it('has no accessibility violations', async () => {
    // Note: We provide an id and label to ensure it passes WCAG form label requirements
    const { container } = render(
      <Input label="Email Address" id="email" />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
