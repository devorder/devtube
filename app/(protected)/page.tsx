import { auth } from "@/auth";
import FileUpload from "@/components/fileUpload/FileUpload";
import VideoPlayer from "@/components/videoPlayer/VideoPlayer";

export default async function Home() {
  const session = await auth();
  console.log({session});
  
  return (
    <div className="flex flex-col">
      <h1>Hello Home</h1>
      <FileUpload/>
      <VideoPlayer/>
    </div>
  );
}
