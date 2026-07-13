import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import type { HttpRequest } from '@opencollection/types/requests/http';
import QueryBar from './QueryBar';

const item = { http: { method: 'POST', url: '{{host}}/api/echo/json' } } as HttpRequest;

describe('QueryBar', () => {
  it('exposes test ids for the method, url and send controls', () => {
    const html = renderToStaticMarkup(
      <QueryBar item={item} isLoading={false} onSendRequest={() => undefined} onItemChange={() => undefined} />
    );
    expect(html).toContain('data-testid="query-bar-method"');
    expect(html).toContain('data-testid="query-bar-url"');
    expect(html).toContain('data-testid="query-bar-send"');
  });
});
