import {fireEvent, render, screen} from '@testing-library/react';
import {DateTime} from 'luxon';
import {describe, expect, it, vi} from 'vitest';
import {
    FluxFader, FluxFaderItem, FluxFormDateInput, FluxFormFader, FluxFormRepeater,
    FluxFormSelect
} from './SelectionForms';

describe('selection and date controls', () => {
    it('preserves typed select values', () => {
        const onValueChange = vi.fn();
        render(<FluxFormSelect aria-label="Priority" options={[{label: 'One', value: 1}, {label: 'Two', value: 2}]} value={1} onValueChange={onValueChange} />);
        fireEvent.change(screen.getByRole('combobox', {name: 'Priority'}), {target: {value: 'number:2'}});
        expect(onValueChange).toHaveBeenCalledWith(2);
    });

    it('emits Luxon dates from the native date input', () => {
        const onValueChange = vi.fn();
        render(<FluxFormDateInput aria-label="Date" value={DateTime.fromISO('2026-09-11')} onValueChange={onValueChange} />);
        fireEvent.change(screen.getByLabelText('Date'), {target: {value: '2026-09-12'}});
        expect(onValueChange.mock.calls[0][0].toISODate()).toBe('2026-09-12');
    });
});

describe('faders and repeaters', () => {
    it('supports fader keyboard stepping', () => {
        const onValueChange = vi.fn();
        render(<FluxFormFader ariaLabel="Volume" value={5} max={10} onValueChange={onValueChange} />);
        fireEvent.keyDown(screen.getByRole('slider', {name: 'Volume'}), {key: 'ArrowRight'});
        expect(onValueChange).toHaveBeenCalledWith(6);
    });

    it('only exposes the current carousel item', () => {
        render(<FluxFader autoplay={false}><FluxFaderItem>First</FluxFaderItem><FluxFaderItem>Second</FluxFaderItem></FluxFader>);
        expect(screen.getByText('First').closest('[aria-hidden]')).toBeNull();
        expect(screen.getByText('Second').closest('[aria-hidden="true"]')).not.toBeNull();
    });

    it('adds and removes repeater rows', () => {
        const onValueChange = vi.fn();
        render(<FluxFormRepeater defaultValue={['one']} newRow={() => 'two'} onValueChange={onValueChange}>{({row}) => <input aria-label={row} defaultValue={row} />}</FluxFormRepeater>);
        fireEvent.click(screen.getByRole('button', {name: 'Add'}));
        expect(onValueChange).toHaveBeenLastCalledWith(['one', 'two']);
        fireEvent.click(screen.getByRole('button', {name: 'Remove Row 1'}));
        expect(onValueChange).toHaveBeenLastCalledWith(['two']);
    });
});
