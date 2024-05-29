import dynamic from "next/dynamic";
 
const Editor = dynamic(() => import("./__components/Blocks"), { ssr: false });
 
const Page = ()=> {
  return (
    <div>
      <Editor />
    </div>
  );
}

export default Page