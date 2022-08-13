import { getPreferenceValues } from "@raycast/api";
import { execa } from "execa";
import { useEffect, useState } from "react";
import { Video, Preferences } from "./types";

interface VideoResponse {
    items: Video[];
}

async function loadItemsAsJson(searchText: string, resultCount?: number): Promise<any> {
    let env = {
        PATH: "$PATH:/opt/homebrew/bin:/usr/local/bin:/bin:/usr/bin",
    };

    const args = ["-A", "-I", "VJ"];
    if (resultCount) {
        args.push(`-n ${resultCount}`);
    }

    args.push(searchText);

    try {
        const { stdout } = await execa("ytfzf", args, { env: env, input: "" });
        let part = stdout.replace(new RegExp("}", "g"), '},');
        part = part.substring(0, part.length - 1)
        let properJson = "{\"items\": [" + part + "]\}"
        return properJson;
    }
    catch (error) {
        console.error(error);
    }

    return undefined!;
}

export function useYtSearch(query: string | undefined): {
    response?: VideoResponse,
    error?: string;
    isLoading: boolean;
} {
    const [response, setResponse] = useState<VideoResponse>();
    const [error, setError] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    let cancel = false;

    useEffect(() => {
        async function loadData() {
            if (cancel) {
                return;
            }

            if (!query) {
                setIsLoading(false);
                setResponse(undefined);
                return;
            }

            setIsLoading(true);
            setError(undefined);

            try {
                const preferences: Preferences = getPreferenceValues();
                const json = await loadItemsAsJson(query, preferences.resultCount)


                if (!json) {
                    setError("Couldn't load items");
                    return;
                }

                if (!cancel) {
                    let obj: VideoResponse = JSON.parse(json)
                    let uniqueItems = [...new Map(obj.items.map(item => [item["ID"], item])).values()];
                    obj.items = uniqueItems
                    setResponse(obj);
                }
            } catch (e) {
                if (!cancel) {
                    setError(String(e));
                }
            } finally {
                if (!cancel) {
                    setIsLoading(false);
                }
            }
        }

        loadData();

        return () => {
            cancel = true;
        };
    }, [query]);

    return { response, error, isLoading };
}
