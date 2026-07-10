import React from 'react';
import Code from '../../../../Code/Code';

interface ResponseBodyTabProps {
  response: any;
  language?: string;
}

export const languageForContentType = (contentType: string): string => {
  if (contentType.includes('json')) return 'json';
  if (contentType.includes('html')) return 'html';
  if (contentType.includes('xml')) return 'xml';
  if (contentType.includes('css')) return 'css';
  if (contentType.includes('javascript')) return 'javascript';
  return 'text';
};

const ResponseBodyTab: React.FC<ResponseBodyTabProps> = ({ response, language }) => {
  const body =
    typeof response.data === 'string'
      ? response.data
      : (() => {
          try {
            return JSON.stringify(response.data, null, 2);
          } catch {
            return String(response.data);
          }
        })();
  const contentType = response.headers?.['content-type'] || response.headers?.['Content-Type'] || '';

  return (
    <div className="py-4">
      <Code code={body} language={language || languageForContentType(contentType)} showLineNumbers showCopy testId="response-body" />
    </div>
  );
};

export default ResponseBodyTab;
