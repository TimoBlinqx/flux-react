import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
    FluxFormTimeZonePicker,
    FluxFormTreeViewSelect,
    FluxKanban,
    FluxKanbanColumn,
    FluxKanbanItem,
    FluxKanbanSwimlane,
    FluxTreeView,
} from "./TreesKanban";

const tree = [
    { id: "projects", label: "Projects", children: [{ id: "flux", label: "Flux" }] },
    { id: "archive", label: "Archive", disabled: true },
];

describe("tree controls", () => {
    it("expands and selects nodes with pointer and keyboard controls", () => {
        const onClick = vi.fn();
        render(<FluxTreeView options={tree} expandedDepth={0} onClick={onClick} />);
        expect(screen.queryByText("Flux")).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Expand" }));
        expect(screen.getByText("Flux")).toBeInTheDocument();
        fireEvent.keyDown(screen.getByRole("tree"), { key: "ArrowDown" });
        fireEvent.keyDown(screen.getByRole("tree"), { key: "Enter" });
        expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ id: "flux", depth: 1 }));
    });

    it("searches and changes hierarchical selections", () => {
        const onValueChange = vi.fn();
        render(<FluxFormTreeViewSelect options={tree} value={null} isSearchable onValueChange={onValueChange} placeholder="Choose" />);
        fireEvent.click(screen.getByRole("combobox"));
        fireEvent.change(screen.getByRole("searchbox", { name: "Search" }), { target: { value: "Flux" } });
        fireEvent.click(screen.getByRole("option", { name: /Flux/ }));
        expect(onValueChange).toHaveBeenCalledWith("flux");
    });

    it("provides a searchable IANA time-zone select", () => {
        render(<FluxFormTimeZonePicker value={null} onValueChange={() => undefined} aria-label="Time zone" placeholder="Select zone" />);
        expect(screen.getByRole("combobox", { name: "Time zone" })).toBeInTheDocument();
        expect(screen.getByRole("searchbox", { name: "Time zone search" })).toBeInTheDocument();
    });
});

describe("Kanban", () => {
    it("moves a keyboard-grabbed card across columns while preserving numeric ids", () => {
        const onMove = vi.fn();
        render(
            <FluxKanban onMove={onMove}>
                <FluxKanbanColumn columnId={1} label="Todo"><FluxKanbanItem columnId={1} itemId="task">Task</FluxKanbanItem></FluxKanbanColumn>
                <FluxKanbanColumn columnId={2} label="Done" />
            </FluxKanban>,
        );
        const item = screen.getByRole("listitem");
        fireEvent.keyDown(item, { key: " " });
        fireEvent.keyDown(item, { key: "ArrowRight" });
        expect(onMove).toHaveBeenCalledWith(expect.objectContaining({ itemId: "task", fromColumnId: 1, toColumnId: 2 }));
    });

    it("reorders columns from the keyboard", () => {
        const onMoveColumn = vi.fn();
        render(
            <FluxKanban reorderableColumns onMoveColumn={onMoveColumn}>
                <FluxKanbanColumn columnId="todo" label="Todo" />
                <FluxKanbanColumn columnId="done" label="Done" />
            </FluxKanban>,
        );
        fireEvent.keyDown(screen.getAllByText("Todo")[0].closest("header")!, { key: "ArrowRight" });
        expect(onMoveColumn).toHaveBeenCalledWith({ columnId: "todo", beforeColumnId: undefined });
    });

    it("collapses swimlanes", () => {
        render(
            <FluxKanban>
                <FluxKanbanSwimlane swimlaneId="team" label="Team" count={1}>
                    <FluxKanbanColumn columnId="todo" label="Todo" />
                </FluxKanbanSwimlane>
            </FluxKanban>,
        );
        fireEvent.click(screen.getByRole("button", { name: "Collapse group" }));
        expect(screen.queryByRole("list", { name: "Todo" })).not.toBeInTheDocument();
    });
});
