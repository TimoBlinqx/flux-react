import type {CSSProperties, ElementType, HTMLAttributes, ReactNode} from 'react';

export type FluxColor = 'gray' | 'primary' | 'danger' | 'info' | 'success' | 'warning';
export type FluxSize = 'small' | 'medium' | 'large';
export type FluxExtendedSize = FluxSize | 'xl';
export type FluxDirection = 'horizontal' | 'vertical';
export type FluxAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FluxJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type FluxFlexWrap = 'wrap' | 'nowrap' | 'wrap-reverse';
export type FluxPressableType = 'button' | 'link' | 'route' | 'none';
export type FluxIconStyle = 'solid' | 'regular' | 'light' | 'thin' | 'duotone' | 'brands';
export type FluxIconName = string;
export type FluxTo = string | {pathname?: string; search?: string; hash?: string};
export type FluxElementType = ElementType;

export type FluxStyle = CSSProperties & Record<`--${string}`, string | number | undefined>;

export interface FluxBaseProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
    children?: ReactNode;
    className?: string;
}

export function resolveTo(to: FluxTo | undefined): string | undefined {
    if (typeof to === 'string' || to === undefined) {
        return to;
    }

    return `${to.pathname ?? ''}${to.search ?? ''}${to.hash ?? ''}` || undefined;
}

export function toCssSize(value: number | string | undefined): string | undefined {
    if (value === undefined) {
        return undefined;
    }

    return typeof value === 'number' ? `${value}px` : value;
}
