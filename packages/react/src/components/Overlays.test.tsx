import {fireEvent, render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {FluxFlyout, FluxOverlay} from './Overlays';

describe('FluxOverlay', () => {
    it('locks scrolling and closes with Escape', () => {
        const onClose = vi.fn();
        const {unmount} = render(<FluxOverlay open isCloseable label="Dialog" onClose={onClose}><button>Action</button></FluxOverlay>);
        expect(document.body.style.overflow).toBe('hidden');
        fireEvent.keyDown(document, {key: 'Escape'});
        expect(onClose).toHaveBeenCalledOnce();
        unmount();
        expect(document.body.style.overflow).toBe('');
    });
});

describe('FluxFlyout', () => {
    it('opens and closes through its render API', () => {
        render(<FluxFlyout opener={({toggle}) => <button onClick={toggle}>Menu</button>}>{({close}) => <button onClick={close}>Close</button>}</FluxFlyout>);
        fireEvent.click(screen.getByRole('button', {name: 'Menu'}));
        expect(screen.getByRole('button', {name: 'Close'})).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', {name: 'Close'}));
        expect(screen.queryByRole('button', {name: 'Close'})).not.toBeInTheDocument();
    });
});
