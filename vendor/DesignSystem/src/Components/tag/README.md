# Tag v1.0.0

A small label component for categorising content. Supports two types (Default, Success) and three states (Active, Default, Inactive).

**Figma source**: [Variables-Figma-file](https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=14522-15906) — node `14522:15906`

**Snapshot**: `Data/figma-variables/fetched-nodes/Tag--cEvsxKUutB8c3TbI3RHk0n-14522-15906.json`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | — | Tag label text |
| `type` | `"default" \| "success"` | `"default"` | Visual category |
| `state` | `"default" \| "active" \| "inactive"` | `"active"` | Current state |
| `className` | `string` | — | CSS class name |
| `style` | `CSSProperties` | — | Inline style overrides |

## Token Mapping

### Layout (shared)

| Property | VariableID | Graph name | Token |
|----------|-----------|------------|-------|
| paddingLeft/Right | `9023:370` | Layout/Spacing/Padding/Horizontal/padding-symbolic | `layout.gap4` (4px) |
| paddingTop/Bottom | `9053:51` | Layout/Spacing/Padding/Gap/static/gap-2 | `layout.gap2` (2px) |
| strokeWeight | `2027:91` | Stroke/stroke-s | `layout.strokeS` (1px) |
| borderRadius | `2010:197` | Radius/radius-xs | `layout.radiusXs` (4px) |

### Typography (Label style)

| Property | VariableID | Token |
|----------|-----------|-------|
| fontSize | `8838:506` | `typography.label.fontSize` (10) |
| lineHeight | `8813:68` | `typography.label.lineHeight` (16) |
| letterSpacing | `8813:45` | `typography.label.letterSpacing` (0) |
| fontFamily | `8838:481` | `fontFamily` ("Mona Sans") |
| fontWeight | — | `typography.label.fontWeight` (600) |
| fontWidth | — | `typography.label.fontWidth` (120) |

### Colour per variant

| Variant | Property | VariableID | Token |
|---------|----------|-----------|-------|
| Default, Default | text | `13441:49266` | `colors.textLabel` |
| Default, Default | stroke | `9006:168` | `semanticColors.strokeSymbolic` |
| Active, Default | text | `9006:26` | `colors.textHeadingColour` |
| Active, Default | fill | `10484:10783` | `semanticColors.backdropSurfaceElevatedSurface` |
| Active, Default | stroke | — | No visible stroke (`borderColor: "transparent"`; layout still uses `layout.strokeS` for sizing parity) |
| Default, Success | text | `9189:924` | `semanticColors.textFunctionalSuccess` |
| Default, Success | stroke | `14556:16169` | `semanticColors.strokeSuccess` |
| Active, Success | text | `9671:3519` | `colors.textWhiteAtDarkenedSurface` |
| Active, Success | fill | `13918:3383` | `semanticColors.backdropFunctionalSuccessSurface` |
| Inactive, both | text | `9272:2228` | `colors.textDisabled` |
| Inactive, both | fill | `30:1834` | `semanticColors.backdropStatesDisabledSurface` |

## Mode Support

All colour tokens are mode-aware (Light/Dark/Colour) through the Figma variable system.
