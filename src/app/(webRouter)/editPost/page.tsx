"use client";
import EditPostScreen from '@/components/features/editpost/view/EditPostScreen';
import { usePathname } from 'next/navigation';
const EditPostPage = () => {
  const id = usePathname().split('/').pop();

  if (!id) {
    return (
      <div className="text-center text-gray-500" style={{ marginTop: 200 }}>
        Đã còn bài Post đó đâuuu . . .
      </div>
    );
  }
  return <EditPostScreen id={id as string} />;
};

export default EditPostPage;