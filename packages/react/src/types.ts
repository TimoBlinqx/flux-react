import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";

export type FluxColor = "gray" | "primary" | "danger" | "info" | "success" | "warning";
export type FluxSize = "small" | "medium" | "large";
export type FluxExtendedSize = FluxSize | "xl";
export type FluxDirection = "horizontal" | "vertical";
export type FluxAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type FluxJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
export type FluxFlexWrap = "wrap" | "nowrap" | "wrap-reverse";
export type FluxPressableType = "button" | "link" | "route" | "none";
export type FluxIconStyle = "solid" | "regular" | "light" | "thin" | "duotone" | "brands";
export type FluxIconName = string;
export type FluxStatisticsChangeData = { readonly color?: FluxColor; readonly icon?: FluxIconName; readonly value: string | number };
export type FluxStatisticsChartColor = FluxColor | `#${string}` | `var(--${string})`;
export interface FluxStatisticsPercentageBarItemObject {
    readonly color?: FluxStatisticsChartColor;
    readonly icon?: FluxIconName;
    readonly label: string;
    readonly value: number;
    readonly displayValue?: string | number;
}
export interface FluxStatisticsChartCategoryPoint {
    readonly label?: string;
    readonly value: number;
}
export interface FluxStatisticsChartCartesianSeries {
    readonly name?: string;
    readonly data: readonly (number | FluxStatisticsChartCategoryPoint)[];
    readonly color?: FluxStatisticsChartColor;
    readonly icon?: FluxIconName;
}
export type FluxStatisticsChartLineSeries = FluxStatisticsChartCartesianSeries;
export type FluxStatisticsChartAreaSeries = FluxStatisticsChartCartesianSeries;
export type FluxStatisticsChartBarSeries = FluxStatisticsChartCartesianSeries;
export interface FluxStatisticsChartMixedSeries extends FluxStatisticsChartCartesianSeries {
    readonly type: "line" | "area" | "bar";
}
export interface FluxStatisticsChartPieSlice {
    readonly label: string;
    readonly value: number;
    readonly formatted?: string;
    readonly color?: FluxStatisticsChartColor;
    readonly icon?: FluxIconName;
}
export interface FluxStatisticsChartRadarIndicator {
    readonly name: string;
    readonly max?: number;
}
export interface FluxStatisticsChartRadarSeries {
    readonly name?: string;
    readonly values: readonly number[];
    readonly color?: FluxStatisticsChartColor;
    readonly icon?: FluxIconName;
}
export interface FluxStatisticsChartScatterPoint {
    readonly x: number;
    readonly y: number;
}
export interface FluxStatisticsChartScatterSeries {
    readonly name?: string;
    readonly data: readonly FluxStatisticsChartScatterPoint[];
    readonly color?: FluxStatisticsChartColor;
    readonly icon?: FluxIconName;
}
export interface FluxStatisticsChartBubblePoint extends FluxStatisticsChartScatterPoint {
    readonly size: number;
}
export interface FluxStatisticsChartBubbleSeries {
    readonly name?: string;
    readonly data: readonly FluxStatisticsChartBubblePoint[];
    readonly color?: FluxStatisticsChartColor;
    readonly icon?: FluxIconName;
}
export interface FluxStatisticsChartCandlestickPoint {
    readonly label?: string;
    readonly open: number;
    readonly close: number;
    readonly low: number;
    readonly high: number;
}
export interface FluxStatisticsChartCandlestickSeries {
    readonly name?: string;
    readonly data: readonly FluxStatisticsChartCandlestickPoint[];
    readonly positiveColor?: FluxStatisticsChartColor;
    readonly negativeColor?: FluxStatisticsChartColor;
    readonly icon?: FluxIconName;
}
export interface FluxStatisticsChartBoxPlotPoint {
    readonly label?: string;
    readonly min: number;
    readonly q1: number;
    readonly median: number;
    readonly q3: number;
    readonly max: number;
}
export interface FluxStatisticsChartBoxPlotSeries {
    readonly name?: string;
    readonly data: readonly FluxStatisticsChartBoxPlotPoint[];
    readonly color?: FluxStatisticsChartColor;
    readonly icon?: FluxIconName;
}
export interface FluxStatisticsChartHeatmapPoint {
    readonly x: string | number;
    readonly y: string | number;
    readonly value: number;
    readonly formatted?: string;
}
export interface FluxStatisticsChartHeatmapSeries {
    readonly name?: string;
    readonly data: readonly FluxStatisticsChartHeatmapPoint[];
    readonly icon?: FluxIconName;
}
export interface FluxStatisticsChartTreemapNode {
    readonly name: string;
    readonly value?: number;
    readonly color?: FluxStatisticsChartColor;
    readonly children?: readonly FluxStatisticsChartTreemapNode[];
}
export interface FluxStatisticsChartTreemapSeries {
    readonly name?: string;
    readonly data: readonly FluxStatisticsChartTreemapNode[];
    readonly icon?: FluxIconName;
}
export interface FluxStatisticsChartGaugeSeries {
    readonly name: string;
    readonly value: number;
    readonly radius?: number;
    readonly color?: FluxStatisticsChartColor;
    readonly icon?: FluxIconName;
}
export type FluxTo = string | { pathname?: string; search?: string; hash?: string };
export type FluxElementType = ElementType;
export interface FluxFocalPointObject {
    x: number;
    y: number;
}

export type FluxStyle = CSSProperties & Record<`--${string}`, string | number | undefined>;

export interface FluxBaseProps extends Omit<HTMLAttributes<HTMLElement>, "color"> {
    children?: ReactNode;
    className?: string;
}

export function resolveTo(to: FluxTo | undefined): string | undefined {
    if (typeof to === "string" || to === undefined) {
        return to;
    }

    return `${to.pathname ?? ""}${to.search ?? ""}${to.hash ?? ""}` || undefined;
}

export function toCssSize(value: number | string | undefined): string | undefined {
    if (value === undefined) {
        return undefined;
    }

    return typeof value === "number" ? `${value}px` : value;
}
