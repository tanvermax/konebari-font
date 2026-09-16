import { Link } from 'react-router';

export default function OrderTable() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Welcome to OrderTable</h1>
      <p className="mt-4 text-muted-foreground text-center px-4">
        Ready to build the future of NoteArch.
      </p>
      <div className="mt-8 flex gap-4">
        <Link to="/" className="text-blue-500 hover:underline hover:text-blue-600 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}