# @flux-ui/react

Native React components for Flux UI. This package lives alongside the existing Vue packages and reuses the same design tokens and component styles.

## Install

```sh
bun add @flux-ui/react react react-dom
```

Import the stylesheet once at the application entry point:

```tsx
import '@flux-ui/react/style.css';
```

## Example

```tsx
import {
    FluxFormField,
    FluxFormInput,
    FluxPane,
    FluxPaneBody,
    FluxPaneHeader,
    FluxPrimaryButton
} from '@flux-ui/react';

export function Profile() {
    return (
        <FluxPane>
            <FluxPaneHeader title="Profile" subtitle="Update your details" />
            <FluxPaneBody>
                <FluxFormField label="Display name">
                    <FluxFormInput placeholder="Ada Lovelace" />
                </FluxFormField>
                <FluxPrimaryButton label="Save" isSubmit />
            </FluxPaneBody>
        </FluxPane>
    );
}
```

React event props follow React conventions (`onClick`, `onValueChange`, `onCheckedChange`). Named Vue slots are represented as React props such as `before`, `after`, and `end`; the default slot is `children`.

## Current coverage

The compatibility package currently includes the shared theme and common foundations: buttons and pressables, icons, layout, panes, badges and tags, avatars, notices, progress indicators, skeletons, core form controls, breadcrumbs, pagination, segmented controls, tabs, actions, chips, items, links, and toolbars. More complex components will be ported without changing the Vue packages.
