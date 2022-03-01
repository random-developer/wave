// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as Fluent from '@fluentui/react'
import { B, Dict, Id, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { IconTableCellType, XIconTableCellType } from "./icon_table_cell_type"
import { ProgressTableCellType, XProgressTableCellType } from "./progress_table_cell_type"
import { TagTableCellType, XTagTableCellType } from "./tag_table_cell_type"
import { border, cssVar, important, margin, rem } from './theme'
import { wave } from './ui'

/** Defines cell content to be rendered instead of a simple text. */
interface TablePagination {
  /** Renders a progress arc with a percentage value in the middle. */
  total_rows: U
  /** Renders a progress arc with a percentage value in the middle. */
  rows_per_page: U
  /** If specified, regular pagination will not be displayed and replaced with infinite scroll instead. Defaults to False. */
  trigger_on_scroll?: B
}

/** Defines cell content to be rendered instead of a simple text. */
interface TableCellType {
  /** Renders a progress arc with a percentage value in the middle. */
  progress?: ProgressTableCellType
  /** Renders an icon. */
  icon?: IconTableCellType
  /** Renders one or more tags. */
  tag?: TagTableCellType
}

/** Create a table column. */
interface TableColumn {
  /** An identifying name for this column. */
  name: Id
  /** The text displayed on the column header. */
  label: S
  /** The minimum width of this column, e.g. '50px'. Only `px` units are supported at this time. */
  min_width?: S
  /** The maximum width of this column, e.g. '100px'. Only `px` units are supported at this time. */
  max_width?: S
  /** Indicates whether the column is sortable. */
  sortable?: B
  /** Indicates whether the contents of this column can be searched through. Enables a search box for the table if true. */
  searchable?: B
  /** Indicates whether the contents of this column are displayed as filters in a dropdown. */
  filterable?: B
  /** Indicates whether each cell in this column should be displayed as a clickable link. Applies to exactly one text column in the table. */
  link?: B
  /** Defines the data type of this column. Defaults to `string`. */
  data_type?: 'string' | 'number' | 'time'
  /** Defines how to render each cell in this column. Renders as plain text by default. */
  cell_type?: TableCellType
  /** Defines what to do with a cell's contents in case it does not fit inside the cell. */
  cell_overflow?: 'tooltip' | 'wrap'
}

/** Create a table row. */
interface TableRow {
  /** An identifying name for this row. */
  name: Id
  /** The cells in this row (displayed left to right). */
  cells: S[]
}

/**
 * Make rows within the table collapsible/expandable.
 *
 * This type of table is best used for cases when your data makes sense to be presented in chunks rather than a single flat list.
 */
interface TableGroup {
  /** The title of the group. */
  label: S
  /** The rows in this group. */
  rows: TableRow[]
  /** Indicates whether the table group should be collapsed by default. Defaults to True. */
  collapsed?: B
}

/**
 * Create an interactive table.
 *
 * This table differs from a markdown table in that it supports clicking or selecting rows. If you simply want to
 * display a non-interactive table of information, use a markdown table.
 *
 * If `multiple` is set to False (default), each row in the table is clickable. When a row is clicked, the form is
 * submitted automatically, and `q.args.table_name` is set to `[row_name]`, where `table_name` is the `name` of
 * the table, and `row_name` is the `name` of the row that was clicked on.
 *
 * If `multiple` is set to True, each row in the table is selectable. A row can be selected by clicking on it.
 * Multiple rows can be selected either by shift+clicking or using marquee selection. When the form is submitted,
 * `q.args.table_name` is set to `[row1_name, row2_name, ...]` where `table_name` is the `name` of the table,
 * and `row1_name`, `row2_name` are the `name` of the rows that were selected. Note that if `multiple` is
 * set to True, the form is not submitted automatically, and one or more buttons are required in the form to trigger
 * submission.
 */
export interface Table {
  /** An identifying name for this component. */
  name: Id
  /** The columns in this table. */
  columns: TableColumn[]
  /** The rows in this table. Mutually exclusive with `groups` attr. */
  rows?: TableRow[]
  /** True to allow multiple rows to be selected. */
  multiple?: B
  /** True to allow group by feature. Ignored if `groups` are specified. */
  groupable?: B
  /** Indicates whether the table rows can be downloaded as a CSV file. Defaults to False. */
  downloadable?: B
  /** Indicates whether a Reset button should be displayed to reset search / filter / group-by values to their defaults. Defaults to False. */
  resettable?: B
  /** The height of the table, e.g. '400px', '50%', etc. */
  height?: S
  /** The width of the table, e.g. '100px'. Defaults to '100%'. */
  width?: S
  /** The names of the selected rows. If this parameter is set, multiple selections will be allowed (`multiple` is assumed to be `True`). */
  values?: S[]
  /** Controls visibility of table rows when `multiple` is set to `True`. Defaults to 'on-hover'. */
  checkbox_visibility?: 'always' | 'on-hover' | 'hidden'
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
  /** Creates collapsible / expandable groups of data rows. Mutually exclusive with `rows` attr. */
  groups?: TableGroup[]
  /** Table pagination. Used when large data is needed to be displayed. */
  pagination?: TablePagination
}

type WaveColumn = Fluent.IColumn & {
  dataType?: 'string' | 'number' | 'time'
  cellType?: TableCellType
  isSortable?: B
  cellOverflow?: 'tooltip' | 'wrap'
}

type DataTable = {
  model: Table
  onFilterChange: (filterKey: S, filterVal: S, checked?: B) => void
  sort: (col: WaveColumn) => void,
  filteredItems: any[]
  selectedFilters: Dict<S[]> | null
  items: any[]
  selection: Fluent.Selection
  isMultiple: B
  groups?: Fluent.IGroup[]
  expandedRefs: React.MutableRefObject<{ [key: S]: B } | null>
  setFiltersInBulk: (colKey: S, filters: S[]) => void
}

type ContextualMenuProps = {
  onFilterChange: (filterKey: S, filterVal: S, checked?: B) => void
  col: WaveColumn
  listProps: Fluent.IContextualMenuListProps
  selectedFiltersRef: React.MutableRefObject<Dict<S[]> | null>
  setFiltersInBulk: (colKey: S, filters: S[]) => void
}

type FooterProps = {
  shouldShowFooter: B
  isSearchable: B
  isFilterable: B
  displayedRows: S
  contentRef: React.RefObject<Fluent.IScrollablePane | null>
  m: Table
  reset: () => void
}

const
  MIN_ROWS_TO_DISPLAY_FOOTER = 20,
  // TODO: Clean up into correct Fluent style slots.
  css = stylesheet({
    // HACK: Put sorting icon on right (same as filter).
    sortableHeader: {
      $nest: {
        '.ms-DetailsHeader-cellName': {
          position: 'relative',
          paddingRight: 15
        }
      }
    },
    sortingIcon: {
      marginLeft: 10,
      fontSize: rem(1.1),
      position: 'absolute',
      top: -2,
      right: -5
    }
  }),
  styles: Partial<Fluent.IDetailsListStyles> = {
    contentWrapper: {
      borderTop: 'none',
      '.ms-List-page:first-child .ms-List-cell:first-child > .ms-DetailsRow': {
        borderTop: border(2, 'transparent'),
      },
    }
  },
  checkboxVisibilityMap = {
    'always': Fluent.CheckboxVisibility.always,
    'on-hover': Fluent.CheckboxVisibility.onHover,
    'hidden': Fluent.CheckboxVisibility.hidden,
  },
  groupByF = function <T extends Dict<any>>(arr: T[], key: S): Dict<any> {
    return arr.reduce((rv, x: T) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {} as Dict<any>)
  },
  sortingF = (column: WaveColumn, sortAsc: B) => (rowA: any, rowB: any) => {
    let a = rowA[column.key], b = rowB[column.key]

    switch (column.dataType) {
      case 'number':
        a = +a
        b = +b
        return sortAsc ? a - b : b - a
      case 'time':
        a = Date.parse(a)
        b = Date.parse(b)
        break
      default:
        a = a.toLowerCase()
        b = b.toLowerCase()
        break
    }

    return sortAsc
      ? b > a ? -1 : 1
      : b > a ? 1 : -1
  },
  formatNum = (num: U) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  toCSV = (data: unknown[][]): S => data.map(row => {
    const line = JSON.stringify(row)
    return line.substr(1, line.length - 2)
  }).join('\n'),
  ContextualMenu = ({ onFilterChange, col, listProps, selectedFiltersRef, setFiltersInBulk }: ContextualMenuProps) => {
    const
      isFilterChecked = (data: S, key: S) => !!selectedFiltersRef.current && selectedFiltersRef.current[data]?.includes(key),
      [menuFilters, setMenuFilters] = React.useState(col.cellType?.tag
        ? Array.from(listProps.items.reduce((_filters, { key, text, data }) => {
          key.split(',').forEach(key => _filters.set(key, { key, text, data, checked: isFilterChecked(data, key) }))
          return _filters
        }, new Map<S, Fluent.IContextualMenuItem>()).values())
        : listProps.items.map(i => ({ ...i, checked: isFilterChecked(i.data, i.key) }))
      ),
      selectAll = () => {
        setMenuFilters(menuFilters.map(i => ({ ...i, checked: true })))
        setFiltersInBulk(col.key, menuFilters.map(f => f.key))
      },
      deselectAll = () => {
        setMenuFilters(menuFilters.map(i => ({ ...i, checked: false })))
        setFiltersInBulk(col.key, [])
      },
      getOnFilterChangeHandler = (data: S, key: S) => (_ev?: React.FormEvent<HTMLInputElement | HTMLElement>, checked?: B) => {
        setMenuFilters(filters => filters.map(f => f.key === key ? ({ ...f, checked }) : f))
        onFilterChange(data, key, checked)
      }

    return (
      <div style={{ padding: 10 }}>
        <Fluent.Text variant='mediumPlus' styles={{ root: { paddingTop: 10, paddingBottom: 10, fontWeight: 'bold' } }} block>Show only</Fluent.Text>
        <Fluent.Text variant='small'>
          <Fluent.Link onClick={selectAll}>Select All</Fluent.Link> | <Fluent.Link onClick={deselectAll}>Deselect All</Fluent.Link>
        </Fluent.Text>
        {
          menuFilters.map(({ key, data, checked }) => (
            <Fluent.Checkbox
              key={key}
              label={key}
              checked={checked}
              onChange={getOnFilterChangeHandler(data, key)}
              styles={{ root: { marginBottom: 5 }, checkmark: { display: 'flex' } }}
            />
          )
          )
        }
      </div>
    )
  },
  DataTable = ({ model: m, onFilterChange, items, filteredItems, selection, selectedFilters, isMultiple, groups, expandedRefs, sort, setFiltersInBulk }: DataTable) => {
    const
      [colContextMenuList, setColContextMenuList] = React.useState<Fluent.IContextualMenuProps | null>(null),
      selectedFiltersRef = React.useRef(selectedFilters),
      onColumnClick = (e: React.MouseEvent<HTMLElement>, column: WaveColumn) => {
        const isMenuClicked = (e.target as HTMLElement).closest('[data-icon-name="ChevronDown"]')

        if (isMenuClicked) onColumnContextMenu(column, e)
        else if (column.isSortable) {
          sort(column)
          setColumns(columns.map(col => column.key === col.key ? column : col))
        }
      },
      [columns, setColumns] = React.useState(m.columns.map((c): WaveColumn => {
        const
          minWidth = c.min_width
            ? c.min_width.endsWith('px')
              ? +c.min_width.substring(0, c.min_width.length - 2)
              : +c.min_width
            : 150,
          maxWidth = c.max_width
            ? c.max_width.endsWith('px')
              ? +c.max_width.substring(0, c.max_width.length - 2)
              : +c.max_width
            : undefined
        return {
          key: c.name,
          name: c.label,
          fieldName: c.name,
          minWidth,
          maxWidth,
          headerClassName: c.sortable ? css.sortableHeader : undefined,
          iconClassName: c.sortable ? css.sortingIcon : undefined,
          iconName: c.sortable ? 'SortDown' : undefined,
          onColumnClick,
          columnActionsMode: c.filterable ? Fluent.ColumnActionsMode.hasDropdown : Fluent.ColumnActionsMode.clickable,
          cellType: c.cell_type,
          dataType: c.data_type,
          isSortable: c.sortable,
          cellOverflow: c.cell_overflow,
          styles: { root: { height: 48 }, cellName: { color: cssVar('$neutralPrimary') } },
          isResizable: true,
          isMultiline: c.cell_overflow === 'wrap'
        }
      })),
      primaryColumnKey = m.columns.find(c => c.link)?.name || (m.columns[0].link === false ? undefined : m.columns[0].name),
      onRenderMenuList = React.useCallback((col: WaveColumn) => (listProps?: Fluent.IContextualMenuListProps) => {
        return listProps ?
          <ContextualMenu
            onFilterChange={onFilterChange}
            col={col}
            listProps={listProps}
            selectedFiltersRef={selectedFiltersRef}
            setFiltersInBulk={setFiltersInBulk}
          /> : null
      }, [onFilterChange, setFiltersInBulk]),
      onColumnContextMenu = React.useCallback((col: WaveColumn, e: React.MouseEvent<HTMLElement>) => {
        setColContextMenuList({
          items: Array.from(new Set(items.map(i => i[col.fieldName || col.key]))).map(option => ({ key: option, text: option, data: col.fieldName || col.key })),
          target: e.target as HTMLElement,
          directionalHint: Fluent.DirectionalHint.bottomLeftEdge,
          gapSpace: 10,
          isBeakVisible: true,
          onRenderMenuList: onRenderMenuList(col),
          onDismiss: () => setColContextMenuList(null),
        })
      }, [items, onRenderMenuList]),
      onRenderDetailsHeader = React.useCallback((props?: Fluent.IDetailsHeaderProps) => {
        if (!props) return <span />

        return (
          <Fluent.Sticky stickyPosition={Fluent.StickyPositionType.Header} isScrollSynced>
            <Fluent.DetailsHeader
              {...props}
              isAllCollapsed={groups?.every(group => group.isCollapsed)}
              styles={{
                ...props.styles,
                root: {
                  padding: 0,
                  height: 48,
                  lineHeight: '48px',
                  background: cssVar('$neutralLight'),
                  borderBottom: 'none',
                },
                cellSizerEnd: {
                  marginLeft: -8,
                },
                cellIsGroupExpander: {
                  // HACK: fixed size of expand/collapse button in column header
                  height: 48
                }
              }}
            />
          </Fluent.Sticky>
        )
      }, [groups]),
      onRenderGroupHeader = React.useCallback((props?: Fluent.IDetailsGroupDividerProps) => {
        if (!props) return <span />

        return (
          <Fluent.GroupHeader
            {...props}
            styles={{
              root: {
                position: 'sticky',
                top: 48,
                backgroundColor: cssVar('$card'),
                zIndex: 1
              }
            }} />
        )
      }, []),
      onToggleCollapseAll = (isAllCollapsed: B) => expandedRefs.current = isAllCollapsed ? {} : null,
      onToggleCollapse = ({ key, isCollapsed }: Fluent.IGroup) => {
        if (expandedRefs.current) {
          isCollapsed
            ? expandedRefs.current[key] = false
            : delete expandedRefs.current[key]
        } else {
          expandedRefs.current = { [key]: false }
        }
      },
      onRenderRow = (props?: Fluent.IDetailsRowProps) => props
        ? <Fluent.DetailsRow {...props} styles={{
          cell: { alignSelf: 'center', fontSize: 14, lineHeight: 20, color: cssVar('$text9') },
          checkCell: { display: 'flex', alignItems: 'center' },
          root: {
            width: '100%',
            border: border(2, 'transparent'),
            borderTop: border(2, cssVar('$neutralLight')),
            background: cssVar('$card'),
            minHeight: 48,
            '&:hover': {
              background: cssVar('$neutralLight'),
              border: `${border(2, cssVar('$themePrimary'))} !important`,
            }
          }
        }} />
        : null,
      onItemInvoked = (item: Fluent.IObjectWithKey & Dict<any>) => {
        wave.args[m.name] = [item.key as S]
        wave.push()
      },
      onRenderItemColumn = (item?: Fluent.IObjectWithKey & Dict<any>, _idx?: U, col?: WaveColumn) => {
        if (!item || !col) return <span />

        const TooltipWrapper = ({ children }: { children: S }) => {
          if (col.cellOverflow === 'tooltip') return (
            <Fluent.TooltipHost
              id={item.key as S}
              // HACK: prevent Safari from showing a default tooltip - https://github.com/microsoft/fluentui/issues/13868
              styles={{ root: { '::after': { content: '', display: 'block' } } }}
              content={children}
              overflowMode={Fluent.TooltipOverflowMode.Parent}
              title={children}
            >{children}</Fluent.TooltipHost>
          )
          return <>{children}</>
        }

        let v = item[col.fieldName as S]
        if (col.cellType?.progress) return <XProgressTableCellType model={col.cellType.progress} progress={item[col.key]} />
        if (col.cellType?.icon) return <XIconTableCellType model={col.cellType.icon} icon={item[col.key]} />
        if (col.cellType?.tag) return <XTagTableCellType model={col.cellType.tag} serializedTags={item[col.key]} />
        if (col.dataType === 'time') v = new Date(v).toLocaleString()
        if (col.key === primaryColumnKey && !isMultiple) {
          const onClick = () => {
            wave.args[m.name] = [item.key as S]
            wave.push()
          }
          return <Fluent.Link onClick={onClick}><TooltipWrapper>{v}</TooltipWrapper></Fluent.Link>
        }

        return <TooltipWrapper>{v}</TooltipWrapper>
      },
      // HACK: fixed jumping scrollbar issue when scrolling into the end of list with all groups expanded - https://github.com/microsoft/fluentui/pull/5204 
      getGroupHeight = (group: Fluent.IGroup) => {
        const
          rowHeight = m.columns.some(c => c.cell_type?.progress) ? 76 : 48,
          groupHeaderHeight = 48
        return groupHeaderHeight + (group.isCollapsed ? 0 : rowHeight * group.count)
      }

    // HACK: React stale closures - https://reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function
    // TODO: Find a reasonable way of doing this.
    React.useEffect(() => { { selectedFiltersRef.current = selectedFilters } }, [selectedFilters])

    return (
      <>
        <Fluent.DetailsList
          styles={styles}
          items={filteredItems}
          columns={columns}
          constrainMode={Fluent.ConstrainMode.unconstrained}
          layoutMode={Fluent.DetailsListLayoutMode.fixedColumns}
          groups={groups}
          groupProps={{
            onToggleCollapseAll,
            onRenderHeader: onRenderGroupHeader,
            headerProps: { onToggleCollapse },
            isAllGroupsCollapsed: m.groups?.every(({ collapsed = true }) => collapsed)
          }}
          getGroupHeight={getGroupHeight}
          selection={selection}
          selectionMode={isMultiple ? Fluent.SelectionMode.multiple : Fluent.SelectionMode.none}
          selectionPreservedOnEmptyClick
          onItemInvoked={isMultiple ? undefined : onItemInvoked}
          onRenderRow={onRenderRow}
          onRenderItemColumn={onRenderItemColumn}
          onRenderDetailsHeader={onRenderDetailsHeader}
          checkboxVisibility={checkboxVisibilityMap[m.checkbox_visibility || 'on-hover']}
        />
        {colContextMenuList && <Fluent.ContextualMenu {...colContextMenuList} />}
      </>
    )
  },
  Pagination = ({ pagination, name, contentRef }: { pagination: TablePagination, name: S, contentRef: React.RefObject<Fluent.IScrollablePane | null> }) => {
    const
      [currentPage, setCurrentPage] = React.useState(1),
      lastPage = pagination.total_rows / pagination.rows_per_page,
      btnStyles: Fluent.IButtonStyles = { rootDisabled: { background: 'transparent' }, root: { marginLeft: -8 } }

    React.useEffect(() => {
      wave.emit(name, 'page_change', { offset: (currentPage - 1) * pagination.rows_per_page })
      if (contentRef?.current) {
        // Scroll table content to top after page change.
        // @ts-ignore
        contentRef.current._contentContainer.current.scrollTop = 0
      }
    }, [contentRef, currentPage, name, pagination.rows_per_page])

    return (
      <span>
        <span style={{ marginRight: 15 }}><b>{((currentPage - 1) * pagination.rows_per_page) + 1}</b> to <b>{currentPage * pagination.rows_per_page}</b> of <b>{pagination.total_rows}</b></span>
        <Fluent.IconButton iconProps={{ iconName: 'DoubleChevronLeft' }} disabled={currentPage === 1} onClick={() => setCurrentPage(1)} styles={btnStyles} title='First page' />
        <Fluent.IconButton iconProps={{ iconName: 'ChevronLeft' }} disabled={currentPage === 1} onClick={() => setCurrentPage(prevPage => --prevPage)} styles={btnStyles} title='Previous page' />
        <span style={{ margin: margin(0, 8) }}>Page <b>{currentPage}</b> of <b>{lastPage}</b></span>
        <Fluent.IconButton iconProps={{ iconName: 'ChevronRight' }} disabled={currentPage === lastPage} onClick={() => setCurrentPage(prevPage => ++prevPage)} styles={btnStyles} title='Next page' />
        <Fluent.IconButton iconProps={{ iconName: 'DoubleChevronRight' }} disabled={currentPage === lastPage} onClick={() => setCurrentPage(lastPage)} styles={btnStyles} title='Last page' />
      </span>
    )
  },
  Footer = ({ shouldShowFooter, m, isFilterable, isSearchable, displayedRows, reset, contentRef }: FooterProps) => {
    const
      footerItems: Fluent.ICommandBarItemProps[] = [],
      buttonStyles = { root: { background: cssVar('$card') } },
      download = () => {
        if (m.pagination) {
          wave.emit(m.name, 'download', true)
          return
        }
        // TODO: Prompt a dialog for name, encoding, etc.
        const
          data = toCSV([m.columns.map(({ label, name }) => label || name), ...m.rows.map(({ cells }) => cells)]),
          a = document.createElement('a'),
          blob = new Blob([data], { type: "octet/stream" }),
          url = window.URL.createObjectURL(blob)

        a.href = url
        a.download = 'exported_data.csv'
        a.click()

        window.URL.revokeObjectURL(url)
      }

    if (m.downloadable) footerItems.push({ key: 'download', text: 'Download data', iconProps: { iconName: 'Download' }, onClick: download, buttonStyles })
    if (m.resettable) footerItems.push({ key: 'reset', text: 'Reset table', iconProps: { iconName: 'Refresh' }, onClick: reset, buttonStyles })

    // TODO: Add pagination UI. Raise change-page event on page click.
    return shouldShowFooter ? (
      <Fluent.Stack
        horizontal
        horizontalAlign='space-between'
        verticalAlign='center'
        className='wave-s12'
        styles={{
          root: {
            background: cssVar('$neutralLight'),
            borderRadius: '0 0 4px 4px',
            paddingLeft: 12,
            height: 46,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0
          }
        }}>
        {
          (!m.pagination && (isFilterable || isSearchable || m.rows.length > MIN_ROWS_TO_DISPLAY_FOOTER)) && (
            <Fluent.Text variant='smallPlus' block styles={{ root: { whiteSpace: 'nowrap' } }}>
              <b style={{ paddingLeft: 5 }}>{displayedRows}</b>
            </Fluent.Text>
          )
        }
        {m.pagination && <Pagination pagination={m.pagination} name={m.name} contentRef={contentRef} />}
        {
          footerItems.length && (
            <Fluent.StackItem grow={1}>
              <Fluent.CommandBar items={footerItems} styles={{
                root: { background: cssVar('$neutralLight'), '.ms-Button--commandBar': { background: 'transparent' } },
                primarySet: { justifyContent: 'flex-end' }
              }} />
            </Fluent.StackItem>
          )
        }
      </Fluent.Stack>
    ) : null
  }

export const
  XTable = ({ model: m }: { model: Table }) => {
    const
      groupable = !m.groups && m.groupable,
      getItem = React.useCallback((r: TableRow) => {
        const item: Fluent.IObjectWithKey & Dict<any> = { key: r.name }
        for (let i = 0, n = r.cells.length; i < n; i++) {
          const col = m.columns[i]
          item[col.name] = r.cells[i]
        }
        return item
      }, [m.columns]),
      items = React.useMemo(() =>
        m.groups
          ? m.groups.reduce((acc, { rows, label, collapsed = true }) => {
            acc.push(...rows.map(r => ({ ...getItem(r), group: label, collapsed })))
            return acc
          }, [] as (Fluent.IObjectWithKey & { group?: S, collapsed?: B })[])
          : (m.rows || []).map(getItem)
        , [m.rows, m.groups, getItem]),
      isMultiple = Boolean(m.values?.length || m.multiple),
      [filteredItems, setFilteredItems] = React.useState(items),
      searchableKeys = React.useMemo(() => m.columns.filter(({ searchable }) => searchable).map(({ name }) => name), [m.columns]),
      [searchStr, setSearchStr] = React.useState(''),
      [selectedFilters, setSelectedFilters] = React.useState<Dict<S[]> | null>(null),
      [groups, setGroups] = React.useState<Fluent.IGroup[] | undefined>(),
      expandedRefs = React.useRef<{ [key: S]: B } | null>({}),
      [groupByKey, setGroupByKey] = React.useState('*'),
      contentRef = React.useRef<Fluent.IScrollablePane | null>(null),
      groupByOptions: Fluent.IDropdownOption[] = React.useMemo(() =>
        groupable ? [{ key: '*', text: '(No Grouping)' }, ...m.columns.map(col => ({ key: col.name, text: col.label }))] : [], [m.columns, groupable]
      ),
      filter = React.useCallback((selectedFilters: Dict<S[]> | null) => {
        if (m.pagination) {
          wave.emit(m.name, 'filters', selectedFilters)
          return
        }
        // If we have filters, check if any of the data-item's props (filter's keys) equals to any of its filter values.
        setFilteredItems(
          selectedFilters
            ? items.filter(item => Object.keys(selectedFilters)
              .every(filterKey => !selectedFilters[filterKey].length || selectedFilters[filterKey].some(filterVal => String(item[filterKey]).includes(filterVal)))
            )
            : items
        )
      }, [items, m.name, m.pagination]),
      getIsCollapsed = (key: S, expandedRefs: { [key: S]: B } | null) => {
        if (expandedRefs === null) return false
        const expandedRef = expandedRefs[key]
        return expandedRef === undefined || expandedRef
      },
      makeGroups = React.useCallback((groupByKey: S, filteredItems: (Fluent.IObjectWithKey & Dict<any>)[]) => {
        let
          groups: Fluent.IGroup[],
          groupedBy: Dict<any> = []

        if (m.groups) {
          groups = filteredItems.reduce((acc, { group }, idx) => {
            const prevGroup = acc[acc.length - 1]
            prevGroup?.key === group
              ? prevGroup.count++
              : acc.push({ key: group, name: group, startIndex: idx, count: 1, isCollapsed: getIsCollapsed(group, expandedRefs.current) })
            return acc
          }, [] as Fluent.IGroup[])
        } else {
          let prevSum = 0
          groupedBy = groupByF(filteredItems, groupByKey)
          const
            groupedByKeys = Object.keys(groupedBy),
            groupByColType = m.columns.find(c => c.name === groupByKey)?.data_type

          groups = groupedByKeys.map((key, i) => {
            if (i !== 0) {
              const prevKey = groupedByKeys[i - 1]
              prevSum += groupedBy[prevKey].length
            }

            const name = groupByColType === 'time' ? new Date(key).toLocaleString() : key
            return { key, name, startIndex: prevSum, count: groupedBy[key].length, isCollapsed: getIsCollapsed(key, expandedRefs.current) }
          }).sort(({ name: name1 }, { name: name2 }) => {
            const numName1 = Number(name1), numName2 = Number(name2)
            if (!isNaN(numName1) && !isNaN(numName2)) return numName1 - numName2

            const dateName1 = Date.parse(name1), dateName2 = Date.parse(name2)
            if (!isNaN(dateName1) && !isNaN(dateName2)) return dateName1 - dateName2

            return name2 < name1 ? 1 : -1
          })
        }

        return { groupedBy, groups }
      }, [m.columns, m.groups]),
      initGroups = React.useCallback(() => {
        setGroupByKey(groupByKey => {
          setFilteredItems(filteredItems => {
            const { groupedBy, groups } = makeGroups(groupByKey, filteredItems)
            setGroups(groups)
            return m.groups ? filteredItems : Object.values(groupedBy).flatMap(arr => arr)
          })
          return groupByKey
        })
      }, [m.groups, makeGroups]),
      search = React.useCallback(() => {
        setSearchStr(searchString => {
          const _searchStr = searchString.toLowerCase()
          if (!_searchStr || !searchableKeys.length) return searchString || ''

          setFilteredItems(filteredItems => filteredItems.filter(i => searchableKeys.some(key => (i[key] as S).toLowerCase().includes(_searchStr))))
          return searchString || ''
        })
      }, [searchableKeys]),
      onSearchChange = React.useCallback((_e?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, searchStr = '') => {
        setSearchStr(searchStr)

        if (m.pagination) {
          wave.emit(m.name, 'search', searchStr)
          return
        }
        if (!searchStr && !selectedFilters) {
          setFilteredItems(items)
          setGroups(groups => {
            if (groups) initGroups()
            return groups
          })
          return
        }

        filter(selectedFilters)
        search()
        setGroups(groups => {
          if (groups) initGroups()
          return groups
        })
      }, [m.pagination, m.name, selectedFilters, filter, search, items, initGroups]),
      onGroupByChange = (_e: React.FormEvent<HTMLDivElement>, option?: Fluent.IDropdownOption) => {
        if (!option) return
        if (m.pagination) {
          wave.emit(m.name, 'group_by', true)
          return
        }
        reset()
        if (option.key === '*') return

        setGroupByKey(option.key as S)
        expandedRefs.current = {}
        initGroups()
      },
      isSearchable = !!searchableKeys.length,
      download = () => {
        // TODO: Prompt a dialog for name, encoding, etc.
        const
          dataRows = (m.groups ? m.groups.flatMap(({ rows }) => rows) : m.rows)?.map(({ cells }) => cells) || [],
          data = toCSV([m.columns.map(({ label, name }) => label || name), ...dataRows]),
          a = document.createElement('a'),
          blob = new Blob([data], { type: "octet/stream" }),
          url = window.URL.createObjectURL(blob)

        a.href = url
        a.download = 'exported_data.csv'
        a.click()

        window.URL.revokeObjectURL(url)
      },
      isFilterable = m.columns.some(c => c.filterable),
      shouldShowFooter = m.downloadable || m.resettable || isSearchable || isFilterable || items.length > MIN_ROWS_TO_DISPLAY_FOOTER || !!m.pagination,
      Footer = () => {
        if (!shouldShowFooter) return null

        const
          footerItems: Fluent.ICommandBarItemProps[] = [],
          buttonStyles = { root: { background: cssVar('$card') } }
        if (m.downloadable) footerItems.push({ key: 'download', text: 'Download data', iconProps: { iconName: 'Download' }, onClick: download, buttonStyles })
        if (m.resettable) footerItems.push({ key: 'reset', text: 'Reset table', iconProps: { iconName: 'Refresh' }, onClick: reset, buttonStyles })

        return (
          <Fluent.Stack
            horizontal
            horizontalAlign='space-between'
            verticalAlign='center'
            styles={{
              root: {
                background: cssVar('$neutralLight'),
                borderRadius: '0 0 4px 4px',
                paddingLeft: 12,
                height: 46,
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0
              }
            }}>
            {
              (isFilterable || isSearchable || items.length > MIN_ROWS_TO_DISPLAY_FOOTER) && (
                <Fluent.Text variant='smallPlus' block styles={{ root: { whiteSpace: 'nowrap' } }}>Rows:
                  <b style={{ paddingLeft: 5 }}>{formatNum(filteredItems.length)} of {formatNum(items.length)}</b>
                </Fluent.Text>
              )
            }
            {
              footerItems.length && (
                <Fluent.StackItem grow={1}>
                  <Fluent.CommandBar items={footerItems} styles={{
                    root: { background: cssVar('$neutralLight'), '.ms-Button--commandBar': { background: 'transparent' } },
                    primarySet: { justifyContent: 'flex-end' }
                  }} />
                </Fluent.StackItem>
              )
            }
          </Fluent.Stack>
        )
      },
      onFilterChange = React.useCallback((filterKey: S, filterVal: S, checked?: B) => {
        setSelectedFilters(selectedFilters => {
          const filters = selectedFilters || {}
          if (checked) {
            if (filters[filterKey]) filters[filterKey].push(filterVal)
            else filters[filterKey] = [filterVal]
          } else {
            filters[filterKey] = filters[filterKey].filter(f => f !== filterVal)
          }

          filter(filters)
          search()
          setGroups(groups => {
            if (groups) initGroups()
            return groups
          })
          return filters
        })
      }, [filter, initGroups, search]),
      // TODO: Make filter options in dropdowns dynamic.
      reset = React.useCallback(() => {
        if (m.pagination) {
          wave.emit(m.name, 'reset', true)
          return
        }
        setSelectedFilters(null)
        setSearchStr('')

        setGroups(undefined)
        if (m.groups) initGroups()
        expandedRefs.current = {}
        setGroupByKey('*')

        filter(null)
        search()
      }, [m.pagination, m.groups, m.name, initGroups, filter, search]),
      selection = React.useMemo(() => new Fluent.Selection({ onSelectionChanged: () => { wave.args[m.name] = selection.getSelection().map(item => item.key as S) } }), [m.name]),
      computeHeight = () => {
        if (m.height) return m.height
        if (items.length > 10) return 500

        const
          topToolbarHeight = searchableKeys.length || groupable ? 80 : 0,
          headerHeight = 50,
          rowHeight = m.columns.some(c => c.cell_type?.progress) ? 76 : 48,
          footerHeight = m.downloadable || m.resettable || searchableKeys.length || m.columns.some(c => c.filterable) ? 46 : 0,
          bottomBorder = 2

        return topToolbarHeight + headerHeight + (items.length * rowHeight) + footerHeight + bottomBorder
      },
      sort = React.useCallback((column: WaveColumn) => {
        const sortAsc = column.iconName === 'SortDown'
        column.iconName = sortAsc ? 'SortUp' : 'SortDown'

        if (m.pagination) {
          wave.emit(m.name, 'sort', { asc: sortAsc, col: column.fieldName })
          return
        }
        setGroups(groups => {
          if (groups) {
            setFilteredItems(filteredItems => [...groups]
              // sorts groups by startIndex to match its order in filteredItems
              .sort((group1, group2) => group1.startIndex - group2.startIndex)
              .reduce((acc, group) => [...acc, ...filteredItems.slice(group.startIndex, acc.length + group.count).sort(sortingF(column, sortAsc))],
                [] as any[]) || [])
          }
          else setFilteredItems(filteredItems => [...filteredItems].sort(sortingF(column, sortAsc)))
          return groups
        })
      }, [m.name, m.pagination]),
      setFiltersInBulk = React.useCallback((colKey: S, filters: S[]) => {
        setSelectedFilters(selectedFilters => {
          const newFilters = {
            ...selectedFilters,
            [colKey]: filters
          }
          filter(newFilters)
          search()
          setGroups(groups => {
            if (groups) initGroups()
            return groups
          })
          return newFilters
        })
      }, [filter, search, initGroups])

    React.useEffect(() => {
      wave.args[m.name] = []
      if (isMultiple && m.values) {
        m.values.forEach(v => selection.setKeySelected(v, true, false))
        wave.args[m.name] = m.values
      }
      if (m.groups) {
        expandedRefs.current = m.groups?.reduce((acc, { label, collapsed = true }) => {
          if (!collapsed) acc[label] = false
          return acc
        }, {} as { [key: S]: B })
        initGroups()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    React.useEffect(() => setFilteredItems(items), [items])

    const dataTableProps: DataTable = React.useMemo(() => ({
      model: m,
      onFilterChange,
      items,
      filteredItems,
      selectedFilters,
      groups,
      expandedRefs,
      selection,
      sort,
      isMultiple,
      setFiltersInBulk
    }), [filteredItems, groups, expandedRefs, isMultiple, items, m, onFilterChange, selectedFilters, selection, sort, setFiltersInBulk])

    return (
      <div data-test={m.name} style={{ position: 'relative', height: computeHeight() }}>
        <Fluent.Stack horizontal horizontalAlign='space-between' verticalAlign='end'>
          {groupable && <Fluent.Dropdown data-test='groupby' label='Group by' selectedKey={groupByKey} onChange={onGroupByChange} options={groupByOptions} styles={{ root: { width: 300 } }} />}
          {!!searchableKeys.length && <Fluent.SearchBox data-test='search' placeholder='Search' onChange={onSearchChange} value={searchStr} styles={{ root: { width: '50%', maxWidth: 500 } }} />}
        </Fluent.Stack>
        <Fluent.ScrollablePane
          componentRef={contentRef}
          scrollbarVisibility={Fluent.ScrollbarVisibility.auto}
          styles={{
            root: { top: groupable || searchableKeys.length ? 80 : 0, bottom: shouldShowFooter ? 46 : 0 },
            stickyAbove: { right: important('12px'), border: border(2, 'transparent'), zIndex: 2 },
            contentContainer: { border: border(2, cssVar('$neutralLight')), borderRadius: '4px 4px 0 0' }
          }}>
          {
            isMultiple
              ? <Fluent.MarqueeSelection selection={selection}><DataTable {...dataTableProps} /></Fluent.MarqueeSelection>
              : <DataTable {...dataTableProps} />
          }
        </Fluent.ScrollablePane>
        <Footer
          shouldShowFooter={shouldShowFooter}
          isSearchable={isSearchable}
          isFilterable={isFilterable}
          contentRef={contentRef}
          displayedRows={`${formatNum(filteredItems.length)} of ${formatNum(items.length)}`}
          m={m}
          reset={reset}
        />
      </div>
    )
  }