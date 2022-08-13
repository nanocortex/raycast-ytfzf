import { List, ActionPanel, Action, Grid, showHUD } from "@raycast/api";
import { Video } from "../types";
import { getViewLayout } from "./ListGrid";
import fs from "fs";

function CopyVideoUrlAction(props: { video: Video }): JSX.Element | null {
    const url = props.video.url;
    if (url) {
        return (
            <Action.CopyToClipboard
                title="Copy Video URL"
                content={url}
                shortcut={{ modifiers: ["cmd", "opt"], key: "c" }}
            />
        );
    }
    return null;
}

function OpenVideoInBrowser(props: { video: Video }): JSX.Element | null {
    const videoId = props.video.ID;
    if (videoId) {
        return (
            <Action.OpenInBrowser
                title="Open Video in Browser"
                url={`https://youtube.com/watch?v=${videoId}`}
            />
        );
    }
    return null;
}

function OpenWitMpvAction(props: { video: Video }): JSX.Element | null {
    const url = props.video.url;
    if (url) {
        const appPath = "/Applications/mpv.app";
        if (fs.existsSync(appPath)) {
            return (
                <Action.Open
                    title="Open with MPV"
                    target={url}
                    application="mpv"
                    icon={{ fileIcon: appPath }}
                    shortcut={{ modifiers: ["cmd", "shift"], key: "i" }}
                    onOpen={() => {
                        showHUD("Open MPV");
                    }}
                />
            );
        }
    }
    return null;
}

function OpenWithIINAAction(props: { video: Video }): JSX.Element | null {
    const url = props.video.url;
    if (url) {
        const appPath = "/Applications/IINA.app";
        if (fs.existsSync(appPath)) {
            return (
                <Action.Open
                    title="Open with IINA"
                    target={url}
                    application="iina"
                    icon={{ fileIcon: appPath }}
                    shortcut={{ modifiers: ["cmd", "shift"], key: "j" }}
                    onOpen={() => {
                        showHUD("Open IINA");
                    }}
                />
            );
        }
    }
    return null;
}


export default function VideoItem(props: { video: Video }) {
    const video = props.video;

    let parts: string[] = [];
    parts = [`${video.views} views · ${video.date}`];

    const Actions = (): JSX.Element => {
        return (
            <ActionPanel>
                <ActionPanel.Section>
                    <OpenWitMpvAction video={video} />
                    <OpenWithIINAAction video={video} />
                    <OpenVideoInBrowser video={video} />
                    <CopyVideoUrlAction video={video} />
                </ActionPanel.Section>
            </ActionPanel>
        );
    };

    return getViewLayout() === "list" ? (
        <List.Item
            key={video.ID}
            title={video.title}
            accessories={[{ text: parts.join(" ") }]}
            icon={{ source: video.title }}
            actions={<Actions />}
        />
    ) : (
        <Grid.Item
            key={video.ID}
            title={video.title}
            subtitle={parts.join(" ")}
            content={{ source: video.thumbs }}
            actions={<Actions />}
        />
    );

}