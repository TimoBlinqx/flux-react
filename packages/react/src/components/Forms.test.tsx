import {fireEvent, render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {FluxFormField, FluxFormInput, FluxToggle} from './Forms';

describe('React form components', () => {
    it('connects a field label and error to its input', () => {
        render(<FluxFormField label="Email" error="Required"><FluxFormInput /></FluxFormField>);
        const input = screen.getByLabelText('Email');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAccessibleDescription('Required');
    });

    it('reports toggle changes', () => {
        const onCheckedChange = vi.fn();
        render(<FluxToggle aria-label="Enabled" onCheckedChange={onCheckedChange} />);
        fireEvent.click(screen.getByRole('switch', {name: 'Enabled'}));
        expect(onCheckedChange).toHaveBeenCalledWith(true);
    });
});
