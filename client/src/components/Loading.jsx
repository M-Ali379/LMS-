import { Loader2 } from 'lucide-react';

const Loading = () => (
    <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
);

export default Loading;
