import {clsx} from 'clsx';
import {useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import type {FluxColor, FluxDirection, FluxIconName} from '../types';
import {FluxAction} from './Composition';
import {FluxDestructiveButton, FluxPrimaryButton, FluxSecondaryButton} from './Actions';
import {FluxIcon} from './Icon';
import {FluxPane, FluxPaneBody, FluxPaneFooter, FluxPaneHeader} from './Display';
import {FluxProgressBar, FluxSpinner} from './Feedback';
import {FluxFormField, FluxFormInput} from './Forms';
import {FluxFlyout, FluxOverlay} from './Overlays';
import snackbarStyles from '../../../components/src/css/component/Snackbar.module.scss';
import popStyles from '../../../components/src/css/component/PopConfirm.module.scss';

export interface FluxSnackbarSpec {
    actions?: Record<string, string>; color?: FluxColor; duration?: number; icon?: FluxIconName; isCloseable?: boolean; isLoading?: boolean;
    message?: string; progressIndeterminate?: boolean; progressMax?: number; progressMin?: number; progressStatus?: string; progressValue?: number;
    subMessage?: string; title?: string; onAction?: (key: string) => void; onClose?: () => void;
}
interface SnackbarRecord extends FluxSnackbarSpec {id: number;}
let snackbarId = 0;
let snackbars: SnackbarRecord[] = [];
const snackbarListeners = new Set<() => void>();
const timers = new Map<number, ReturnType<typeof setTimeout>>();
function notify() { snackbarListeners.forEach(listener => listener()); }
export function showSnackbar(spec: FluxSnackbarSpec): number { const item = {...spec, id: ++snackbarId}; snackbars = [...snackbars, item]; if (spec.duration !== 0) timers.set(item.id, setTimeout(() => removeSnackbar(item.id), spec.duration ?? 5000)); notify(); return item.id; }
export function removeSnackbar(id: number): void { clearTimeout(timers.get(id)); timers.delete(id); snackbars = snackbars.filter(item => item.id !== id); notify(); }
export function updateSnackbar(id: number, spec: Partial<FluxSnackbarSpec>): void { snackbars = snackbars.map(item => item.id === id ? {...item, ...spec} : item); notify(); }

export function FluxSnackbar({actions, color = 'gray', icon, isCloseable, isLoading, message, onAction, onClose, progressIndeterminate, progressMax, progressMin, progressStatus, progressValue, subMessage, title}: FluxSnackbarSpec) {
    return <div className={snackbarStyles[`snackbar${capital(color)}`]} role={color === 'danger' ? 'alert' : 'status'} aria-live={color === 'danger' ? 'assertive' : 'polite'}><div className={snackbarStyles.snackbarContent}>{isLoading ? <FluxSpinner size={18} /> : icon && <FluxIcon size={18} name={icon} />}<div className={snackbarStyles.snackbarBody}>{title && <div className={snackbarStyles.snackbarTitle}>{title}</div>}{message && <div className={snackbarStyles.snackbarMessage}>{message}</div>}{(progressIndeterminate || progressValue != null) && <FluxProgressBar isIndeterminate={progressIndeterminate} max={progressMax} min={progressMin} status={progressStatus} value={progressValue} />}{subMessage && <div className={snackbarStyles.snackbarSubMessage}>{subMessage}</div>}</div></div>{actions && <div className={snackbarStyles.snackbarActions}>{Object.entries(actions).map(([key, label]) => <button key={key} className={snackbarStyles.snackbarAction} type="button" onClick={() => onAction?.(key)}>{label}</button>)}</div>}{isCloseable && <FluxAction icon="xmark" aria-label="Close" onClick={onClose} />}</div>;
}

export function FluxSnackbarProvider() {
    const [, render] = useState(0);
    useEffect(() => {const listener = () => render(value => value + 1); snackbarListeners.add(listener); return () => {snackbarListeners.delete(listener);};}, []);
    return <div className={snackbarStyles.snackbars}>{[...snackbars].reverse().map(item => <FluxSnackbar key={item.id} {...item} onAction={key => {item.onAction?.(key); removeSnackbar(item.id);}} onClose={() => {item.onClose?.(); removeSnackbar(item.id);}} />)}</div>;
}

export function FluxPopConfirm({cancelLabel = 'Cancel', confirmLabel = 'OK', direction, icon, isDestructive, message, onCancel, onConfirm, opener, title}: {cancelLabel?: string; confirmLabel?: string; direction?: FluxDirection; icon?: FluxIconName; isDestructive?: boolean; message?: string; onCancel?: () => void; onConfirm: () => void; opener: React.ComponentProps<typeof FluxFlyout>['opener']; title?: string}) {
    return <FluxFlyout direction={direction} label={title ?? message ?? confirmLabel} opener={opener}>{({close}) => <><FluxPaneBody className={popStyles.popConfirmBody}><div className={popStyles.popConfirmContent}>{icon && <FluxIcon className={popStyles.popConfirmIcon} color={isDestructive ? 'danger' : 'primary'} name={icon} size={20} />}<div className={popStyles.popConfirmCaption}>{title && <strong>{title}</strong>}{message && <span>{message}</span>}</div></div></FluxPaneBody><FluxPaneFooter><FluxSecondaryButton label={cancelLabel} onClick={() => {onCancel?.(); close();}} />{isDestructive ? <FluxDestructiveButton label={confirmLabel} onClick={() => {onConfirm(); close();}} /> : <FluxPrimaryButton label={confirmLabel} onClick={() => {onConfirm(); close();}} />}</FluxPaneFooter></>}</FluxFlyout>;
}

export function FluxAlert({icon, message, onClose, open, title}: {icon?: FluxIconName; message?: string; onClose(): void; open: boolean; title: string}) { return <FluxOverlay open={open} label={title}><DialogLayout icon={icon} message={message} title={title} footer={<FluxPrimaryButton label="OK" onClick={onClose} />} /></FluxOverlay>; }
export function FluxConfirm({icon, message, onCancel, onConfirm, open, title}: {icon?: FluxIconName; message?: string; onCancel(): void; onConfirm(): void; open: boolean; title: string}) { return <FluxOverlay open={open} isCloseable label={title} onClose={onCancel}><DialogLayout icon={icon} message={message} title={title} footer={<><FluxSecondaryButton label="Cancel" onClick={onCancel} /><FluxPrimaryButton label="OK" onClick={onConfirm} /></>} /></FluxOverlay>; }
export function FluxPrompt({fieldLabel, fieldPlaceholder, icon, message, onCancel, onConfirm, open, title}: {fieldLabel: string; fieldPlaceholder?: string; icon?: FluxIconName; message?: string; onCancel(): void; onConfirm(value: string): void; open: boolean; title: string}) { const [value, setValue] = useState(''); return <FluxOverlay open={open} isCloseable label={title} onClose={onCancel}><DialogLayout icon={icon} message={message} title={title} footer={<><FluxSecondaryButton label="Cancel" onClick={onCancel} /><FluxPrimaryButton disabled={!value.trim()} label="OK" onClick={() => onConfirm(value)} /></>}><FluxFormField label={fieldLabel}><FluxFormInput autoFocus placeholder={fieldPlaceholder} value={value} onValueChange={next => setValue(String(next ?? ''))} onKeyDown={event => {if (event.key === 'Enter' && value.trim()) onConfirm(value);}} /></FluxFormField></DialogLayout></FluxOverlay>; }
function DialogLayout({children, footer, icon, message, title}: {children?: ReactNode; footer: ReactNode; icon?: FluxIconName; message?: string; title: string}) { return <FluxPane><FluxPaneHeader icon={icon} title={title} />{message && <FluxPaneBody>{message}</FluxPaneBody>}{children && <FluxPaneBody>{children}</FluxPaneBody>}<FluxPaneFooter>{footer}</FluxPaneFooter></FluxPane>; }
function capital(value: string) { return value.charAt(0).toUpperCase() + value.slice(1); }
