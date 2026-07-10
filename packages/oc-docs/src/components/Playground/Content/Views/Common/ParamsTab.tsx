import React, { useCallback, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import KeyValueTable, { type KeyValueRow } from '../../../../../ui/KeyValueTable/KeyValueTable';
import { VariableText } from '../../../../VariableText/VariableText';

const Wrapper = styled.div`
  .section-label {
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .key-value-table thead {
    display: none;
  }

  .path-card {
    border: 1px solid var(--border-color);
    border-radius: var(--oc-radius);
    overflow: hidden;
  }

  .path-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.625rem 0.875rem;
    font-family: var(--font-mono);
    font-size: 0.8125rem;
  }

  .path-row + .path-row {
    border-top: 1px solid var(--border-color);
  }

  .path-key {
    width: 35%;
    flex-shrink: 0;
    color: var(--text-primary);
  }

  .path-value {
    flex: 1;
    min-width: 0;
    color: var(--text-secondary);
    cursor: text;
  }

  .path-placeholder {
    color: var(--text-tertiary);
  }

  .path-input {
    flex: 1;
    min-width: 0;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    color: var(--text-primary);
  }
`;

interface ParamsTabProps {
  params: Array<{ name?: string; value?: string; disabled?: boolean; type?: string }>;
  onParamsChange: (params: KeyValueRow[]) => void;
  title?: string;
  description?: string;
}

export const ParamsTab: React.FC<ParamsTabProps> = ({
  params,
  onParamsChange,
  title = 'Query',
  description
}) => {
  // Single pass: split the params into query and path rows. `type` is kept on
  // each row so it survives the round-trip back through onParamsChange.
  const { queryData, pathData } = useMemo(() => {
    const queryData: KeyValueRow[] = [];
    const pathData: KeyValueRow[] = [];

    (params || [])?.forEach((param, index) => {
      const row: KeyValueRow = {
        id: `param-${index}`,
        name: param.name || '',
        value: param.value || '',
        enabled: !param.disabled,
        type: param.type || 'query'
      };
      (row.type === 'path' ? pathData : queryData).push(row);
    });

    return { queryData, pathData };
  }, [params]);


  const handleQueryChange = useCallback(
    (rows: KeyValueRow[]) => {
      const queryRows = (rows ?? []).map((row) => ({ ...row, type: 'query' }));
      onParamsChange([...queryRows, ...pathData]);
    },
    [onParamsChange, pathData]
  );

  const [editingPathId, setEditingPathId] = useState<string | null>(null);

  const handlePathValueChange = useCallback(
    (id: string, value: string) => {
      const pathRows = pathData.map((row) => (row.id === id ? { ...row, value } : row));
      onParamsChange([...queryData, ...pathRows]);
    },
    [onParamsChange, queryData, pathData]
  );

  const hasPath = pathData.length > 0;

  return (
    <Wrapper className="space-y-4">
      {hasPath && (
        <div className="space-y-2">
          <span className="section-label">Path</span>
          <div className="path-card">
            {pathData.map((row) => (
              <div key={row.id} className="path-row">
                <span className="path-key">{row.name}</span>
                {editingPathId === row.id ? (
                  <input
                    className="path-input"
                    autoFocus
                    value={row.value}
                    placeholder="Add value"
                    onChange={(e) => handlePathValueChange(row.id, e.target.value)}
                    onBlur={() => setEditingPathId(null)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setEditingPathId(null); }}
                    autoComplete="off"
                    spellCheck={false}
                  />
                ) : (
                  <span
                    className="path-value"
                    role="button"
                    tabIndex={0}
                    onClick={() => setEditingPathId(row.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setEditingPathId(row.id); } }}
                  >
                    {row.value ? <VariableText value={row.value} /> : <span className="path-placeholder">Add value</span>}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="section-label">{title}</span>
          {description && (
            <span className="text-xs leading-tight" style={{ color: 'var(--text-secondary)' }}>{description}</span>
          )}
        </div>
        <KeyValueTable
          data={queryData}
          onChange={handleQueryChange}
          keyPlaceholder="Key"
          valuePlaceholder="Value"
          showEnabled={true}
        />
      </div>
    </Wrapper>
  );
};

export default ParamsTab;
