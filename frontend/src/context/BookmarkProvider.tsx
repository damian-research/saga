// BookmarkProvider
//
import { useCallback, useState } from "react";
import {
  BookmarkContext,
  type OpenAddBookmarkPayload,
} from "./BookmarkContext";
import type { Bookmark } from "../api/models/bookmarks.types";
import AddBookmark from "../components/bookmarks/AddBookmark";

interface Props {
  children: React.ReactNode;
  onSaveBookmark: (bookmark: Bookmark) => void;
}

interface State {
  payload: OpenAddBookmarkPayload | null;
}

export function BookmarkProvider({ children, onSaveBookmark }: Props) {
  const [state, setState] = useState<State>({ payload: null });

  const openBookmarkWindow = useCallback((payload: OpenAddBookmarkPayload) => {
    setState({ payload });
  }, []);

  return (
    <BookmarkContext.Provider value={{ openBookmarkWindow }}>
      {children}

      {state.payload && (
        <AddBookmark
          mode={state.payload.mode}
          record={state.payload.record}
          bookmark={state.payload.bookmark}
          onClose={() => setState({ payload: null })}
          onSave={(bookmark) => {
            onSaveBookmark(bookmark);
            setState({ payload: null });
          }}
        />
      )}
    </BookmarkContext.Provider>
  );
}
