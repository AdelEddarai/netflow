import Image from "next/image";

const SplitAbout = () => {
  return (
    <>
    <div className='mt-4 p-4 flex justify-center items-center'>
      <div className="relative flex flex-col gap-6 bg-neutral-950 border border-white/10 w-full max-w-lg rounded-xl p-10">
        <div className="absolute right-5 top-0 h-px w-80 bg-gradient-to-l from-transparent via-white/30 via-10% to-transparent" />
        <p className="text-base text-center leading-[1.5] text-neutral-300">
          CTO and Cofounder of bytonaTech
        </p>
        <div className="flex items-center justify-center gap-2">
          <Image
            src="https://avatars.githubusercontent.com/u/96699224?v=4"
            alt="Avatar"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />

          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neutral-400 leading-none duration-300 hover:text-neutral-300"
          >
            Adel Eddarai
          </a>
        </div>
      </div>
      </div>
    </>
  );
};

export default SplitAbout