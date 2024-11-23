import { EditorView } from './components/EditorView';

export default function Home() {
  return (
    <main className="min-h-[100vh] flex flex-col bg-pink-800">
      <h1>Arhm Editr</h1>
      <EditorView />
    </main>
  );
}
