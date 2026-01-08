import DetailsPanelShell from "../../../components/common/search/DetailsPanelShell";

interface Props {
  selectedId: string | null;
}

export default function SearchDetails({ selectedId }: Props) {
  if (!selectedId) {
    return (
      <DetailsPanelShell
        isEmpty
        emptyText="Select a series or item to browse"
      />
    );
  }

  return (
    <DetailsPanelShell>
      <p>Browsing will appear here.</p>
    </DetailsPanelShell>
  );
}
