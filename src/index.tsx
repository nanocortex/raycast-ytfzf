import { showToast, Toast } from "@raycast/api";
import { useState } from 'react';
import { getGridItemSize, getViewLayout, ListOrGrid } from "./components/ListGrid";
import VideoItem from "./components/VideoItem";
import { Video } from "./types";
import { useYtSearch } from "./utils";

export default function Command() {

  const [searchText, setSearchText] = useState("");
  const { response, error, isLoading } = useYtSearch(searchText);

  if (error) {
    showToast(Toast.Style.Failure, "Cannot search videos", error);
  }

  const layout = getViewLayout();
  const itemSize = getGridItemSize();

  return (
    <ListOrGrid
      layout={layout}
      itemSize={itemSize}
      onSearchTextChange={setSearchText}
      isLoading={isLoading}
      throttle={true}
    >
      {response?.items?.filter(x => x.ID).map((video: Video) => (
        <VideoItem key={video.ID} video={video} />
      ))}
    </ListOrGrid>
  );
}