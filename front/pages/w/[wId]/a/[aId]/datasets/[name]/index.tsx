import "@uiw/react-textarea-code-editor/dist.css";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Router from "next/router";
import { useEffect, useState } from "react";

import DatasetView from "@app/components/app/DatasetView";
import MainTab from "@app/components/app/MainTab";
import AppLayout from "@app/components/AppLayout";
import { ActionButton } from "@app/components/Button";
import { getApp } from "@app/lib/api/app";
import { getDatasetHash } from "@app/lib/api/datasets";
import { Authenticator, getSession, getUserFromSession } from "@app/lib/auth";
import { useRegisterUnloadHandlers } from "@app/lib/front";
import { AppType } from "@app/types/app";
import { DatasetType } from "@app/types/dataset";
import { UserType, WorkspaceType } from "@app/types/user";

const { GA_TRACKING_ID = "" } = process.env;

export const getServerSideProps: GetServerSideProps<{
  user: UserType | null;
  owner: WorkspaceType;
  readOnly: boolean;
  app: AppType;
  dataset: DatasetType;
  gaTrackingId: string;
}> = async (context) => {
  const session = await getSession(context.req, context.res);
  const user = await getUserFromSession(session);
  const auth = await Authenticator.fromSession(
    session,
    context.params?.wId as string
  );

  const owner = auth.workspace();
  if (!owner) {
    return {
      notFound: true,
    };
  }

  const readOnly = !auth.isBuilder();

  const app = await getApp(auth, context.params?.aId as string);

  if (!app) {
    return {
      notFound: true,
    };
  }

  const dataset = await getDatasetHash(
    auth,
    app,
    context.params?.name as string,
    "latest"
  );

  if (!dataset) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user,
      owner,
      readOnly,
      app,
      dataset,
      gaTrackingId: GA_TRACKING_ID,
    },
  };
};

export default function ViewDatasetView({
  user,
  owner,
  readOnly,
  app,
  dataset,
  gaTrackingId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [disable, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const [editorDirty, setEditorDirty] = useState(false);
  const [isFinishedEditing, setIsFinishedEditing] = useState(false);
  const [updatedDataset, setUpdatedDataset] = useState(dataset);

  useRegisterUnloadHandlers(editorDirty);

  // This is a little wonky, but in order to redirect to the dataset's main page and not pop up the
  // "You have unsaved changes" dialog, we need to set editorDirty to false and then do the router
  // redirect in the next render cycle. We use the isFinishedEditing state variable to tell us when
  // this should happen.
  useEffect(() => {
    if (isFinishedEditing) {
      Router.push(`/w/${owner.sId}/a/${app.sId}/datasets`);
    }
  }, [isFinishedEditing]);

  const onUpdate = (
    initializing: boolean,
    valid: boolean,
    currentDatasetInEditor: DatasetType
  ) => {
    setDisabled(!valid);
    if (
      !initializing &&
      (currentDatasetInEditor.data !== dataset.data ||
        currentDatasetInEditor.name !== dataset.name ||
        (currentDatasetInEditor.description !== dataset.description &&
          (currentDatasetInEditor.description || dataset.description)))
    ) {
      setEditorDirty(true);
    } else {
      setEditorDirty(false);
    }
    if (valid) {
      setUpdatedDataset(currentDatasetInEditor);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/w/${owner.sId}/apps/${app.sId}/datasets/${dataset.name}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDataset),
      }
    );
    const data = await res.json();
    setEditorDirty(false);
    setIsFinishedEditing(true);
  };

  return (
    <AppLayout user={user} owner={owner} app={app} gaTrackingId={gaTrackingId}>
      <div className="flex flex-col">
        <div className="mt-2 flex flex-initial">
          <MainTab app={app} currentTab="Datasets" owner={owner} />
        </div>
        <div className="mx-auto mt-4 w-full max-w-5xl">
          <div className="flex flex-1">
            <div className="mb-8 w-full px-4 sm:px-6">
              <div className="mt-4 space-y-6 divide-y divide-gray-200">
                <DatasetView
                  readOnly={readOnly}
                  datasets={[] as DatasetType[]}
                  dataset={updatedDataset}
                  onUpdate={readOnly ? () => {} : onUpdate}
                  nameDisabled={true}
                />

                {readOnly ? null : (
                  <div className="flex flex-row pt-6">
                    <div className="flex-initial">
                      <ActionButton
                        disabled={disable || loading}
                        onClick={() => handleSubmit()}
                      >
                        Update
                      </ActionButton>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
