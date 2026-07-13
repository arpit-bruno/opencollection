import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import KeyValueTable from './KeyValueTable';

describe('KeyValueTable', () => {
  it('shows the placeholder on empty fields when disableNewRow (fixed rows, no add-row)', () => {
    const html = renderToStaticMarkup(
      <KeyValueTable
        data={[{ id: '1', name: 'host', value: '', enabled: true }]}
        onChange={() => undefined}
        keyPlaceholder="Name"
        valuePlaceholder="Value"
        disableNewRow={true}
      />
    );
    expect(html).toContain('placeholder="Value"');
  });
});
