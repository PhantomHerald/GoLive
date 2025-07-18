import EmptyState from "./EmptyState";

export default function TestEmpty() {
  return (
    <EmptyState
      message="No items found."
      actionLabel="Add Item"
      onAction={() => alert("Action pressed!")}
    />
  );
} 