import { url } from 'inspector';
import Image from 'next/image';
import bgImage from '@/app/assets/bg_image.jpg';

export default function Page() {
  return (
    <div className="w-full h-screen bg-contain" style={{
      backgroundImage: "url(/bg_image.jpg)",
    }}>
      hello
    </div>
  );
}
