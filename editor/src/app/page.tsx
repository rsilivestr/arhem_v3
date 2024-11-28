import { EditorRoot } from './components/EditorRoot';
import { EventList } from './components/EventList';

export default function Home() {
  return (
    <div className="h-full flex">
      <EventList />
      <EditorRoot />
    </div>
  );
}
