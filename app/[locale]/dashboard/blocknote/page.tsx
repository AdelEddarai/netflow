import dynamic from "next/dynamic";
 
const Editor = dynamic(() => import("./__component/editor"), { ssr: false });
 
const Page =() => {
  return (
    <div>
      <Editor />
    </div>
  );
}

export default Page