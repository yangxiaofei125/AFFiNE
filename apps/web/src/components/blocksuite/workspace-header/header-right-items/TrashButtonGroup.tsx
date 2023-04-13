import { Button, Confirm } from '@affine/component';
import { useTranslation } from '@affine/i18n';
import { assertExists } from '@blocksuite/store';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useMetaHelper } from '../../../../hooks/affine/use-meta-helper';
import { useCurrentPageId } from '../../../../hooks/current/use-current-page-id';
import { useCurrentWorkspace } from '../../../../hooks/current/use-current-workspace';
import { usePageMeta } from '../../../../hooks/use-page-meta';

export const TrashButtonGroup = () => {
  // fixme(himself65): remove these hooks ASAP
  const [workspace] = useCurrentWorkspace();
  const [pageId] = useCurrentPageId();
  assertExists(workspace);
  assertExists(pageId);
  const blockSuiteWorkspace = workspace.blockSuiteWorkspace;
  const pageMeta = usePageMeta(blockSuiteWorkspace).find(
    meta => meta.id === pageId
  );
  assertExists(pageMeta);
  const { t } = useTranslation();
  const router = useRouter();
  const { restoreFromTrash } = useMetaHelper(blockSuiteWorkspace);

  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        bold={true}
        shape="round"
        style={{ marginRight: '24px' }}
        onClick={() => {
          restoreFromTrash(pageId);
        }}
      >
        {t('Restore it')}
      </Button>
      <Button
        bold={true}
        shape="round"
        type="danger"
        onClick={() => {
          setOpen(true);
        }}
      >
        {t('Delete permanently')}
      </Button>
      <Confirm
        title={t('TrashButtonGroupTitle')}
        content={t('TrashButtonGroupDescription')}
        confirmText={t('Delete')}
        confirmType="danger"
        open={open}
        onConfirm={() => {
          // fixme(himself65): remove these hooks ASAP
          router
            .push({
              pathname: '/workspace/[workspaceId]/all',
              query: {
                workspaceId: workspace.id,
              },
            })
            .then(() => {
              blockSuiteWorkspace.removePage(pageId);
            });
        }}
        onCancel={() => {
          setOpen(false);
        }}
        onClose={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

export default TrashButtonGroup;