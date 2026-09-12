import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
    FluxDataTable,
    FluxTable,
    FluxTableCell,
    FluxTableGroup,
    FluxTableHeader,
    FluxTableRow,
    FluxTableTreeCell,
} from "./Tables";

describe("table primitives", () => {
    it("sorts, resizes, and activates rows from the keyboard", () => {
        const onSort = vi.fn();
        const onResize = vi.fn();
        const onRowClick = vi.fn();
        render(
            <FluxTable
                header={
                    <FluxTableRow>
                        <FluxTableHeader isSortable isResizable width={120} onSort={onSort} onResize={onResize}>Name</FluxTableHeader>
                    </FluxTableRow>
                }
            >
                <FluxTableRow isClickable onRowClick={onRowClick}>
                    <FluxTableCell>Alpha</FluxTableCell>
                </FluxTableRow>
            </FluxTable>,
        );

        fireEvent.click(screen.getByRole("button", { name: "Sort" }));
        expect(onSort).toHaveBeenCalledWith("ascending");
        fireEvent.keyDown(screen.getByRole("separator", { name: "Resize column" }), { key: "ArrowRight" });
        expect(onResize).toHaveBeenCalledWith(132);
        fireEvent.keyDown(screen.getByRole("row", { name: "Alpha" }), { key: "Enter" });
        expect(onRowClick).toHaveBeenCalledWith(0, expect.anything());
    });

    it("toggles groups and tree rows accessibly", () => {
        const onToggle = vi.fn();
        render(
            <FluxTable>
                <FluxTableGroup label="Europe" isExpandable>
                    <FluxTableRow><FluxTableTreeCell level={1} isExpandable isExpanded={false} onToggle={onToggle}>Amsterdam</FluxTableTreeCell></FluxTableRow>
                </FluxTableGroup>
            </FluxTable>,
        );
        fireEvent.click(screen.getByRole("button", { name: "Expand row" }));
        expect(onToggle).toHaveBeenCalledOnce();
        fireEvent.click(screen.getByRole("button", { name: "Collapse group" }));
        expect(screen.queryByText("Amsterdam")).not.toBeInTheDocument();
    });
});

describe("FluxDataTable", () => {
    const items = [
        { id: 1, name: "Alpha", amount: 10 },
        { id: 2, name: "Beta", amount: 20 },
    ];

    it("renders columns and emits row selection and sorting", () => {
        const onSelectedChange = vi.fn();
        const onSortChange = vi.fn();
        render(
            <FluxDataTable
                items={items}
                columns={[
                    { key: "name", header: "Name", sortable: true },
                    { key: "amount", header: "Amount", isNumeric: true },
                ]}
                page={1}
                perPage={10}
                total={2}
                uniqueKey="id"
                selectionMode="multiple"
                selected={[]}
                onSelectedChange={onSelectedChange}
                onSortChange={onSortChange}
            />,
        );

        expect(screen.getByRole("cell", { name: "Alpha" })).toBeInTheDocument();
        fireEvent.click(screen.getByRole("checkbox", { name: "Select row 1" }));
        expect(onSelectedChange).toHaveBeenCalledWith([1]);
        fireEvent.click(screen.getByRole("button", { name: "Sort" }));
        expect(onSortChange).toHaveBeenCalledWith({ key: "name", direction: "ascending" });
    });

    it("expands data rows and renders the empty state", () => {
        const onExpandedChange = vi.fn();
        const { rerender } = render(
            <FluxDataTable
                items={items}
                columns={[{ key: "name", header: "Name" }]}
                page={1}
                perPage={10}
                total={2}
                uniqueKey="id"
                expanded={[]}
                onExpandedChange={onExpandedChange}
                expandable={({ item }) => <span>Details for {item.name}</span>}
            />,
        );
        fireEvent.click(screen.getAllByRole("button", { name: "Expand row" })[0]);
        expect(onExpandedChange).toHaveBeenCalledWith([1]);

        rerender(<FluxDataTable items={[]} columns={[{ key: "name", header: "Name" }]} page={1} perPage={10} total={0} empty="Nothing here" />);
        expect(screen.getByText("Nothing here")).toBeInTheDocument();
    });
});
