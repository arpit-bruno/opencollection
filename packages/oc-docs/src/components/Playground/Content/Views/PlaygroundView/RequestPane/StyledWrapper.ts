import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  height: 100%;
  background-color: var(--bg-primary);

  .oc-tabs .tabs {
    flex: 1 1 auto;
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .oc-tabs .tabs::-webkit-scrollbar {
    display: none;
  }
  .oc-tabs .tab {
    flex-shrink: 0;
  }
`;
