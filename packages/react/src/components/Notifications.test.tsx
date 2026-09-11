import {act, fireEvent, render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {FluxSnackbarProvider, showSnackbar} from './Notifications';

describe('FluxSnackbarProvider', () => {
    it('renders and dismisses imperative notifications', () => {
        render(<FluxSnackbarProvider />);
        act(() => { showSnackbar({duration: 0, isCloseable: true, message: 'Saved'}); });
        expect(screen.getByText('Saved')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', {name: 'Close'}));
        expect(screen.queryByText('Saved')).not.toBeInTheDocument();
    });
});
