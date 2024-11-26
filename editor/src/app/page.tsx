import { EditorView } from './components/EditorView';
import { EventList } from './components/EventList';

export default function Home() {
  return (
    <div className="h-full flex">
      <EventList />
      <EditorView />
    </div>
  );
}
