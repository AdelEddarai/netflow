
import Image from "next/image";
import Link from "next/link";
import mindmaps from './HeroImage.png'
import DotPattern from "./dot-pattern";
import Netflow from "./Spaceflow-anime";



const Hero = () => {
  return (
    <>
      <DotPattern
        width={20}
        height={20}
        cx={2}
        cy={2}
        cr={1}
        className="fill-blue-400/40"
      />
      <div className="flex flex-col items-center justify-center gap-[8rem] text-center px-4 mt-2">
        <div className="w-full h-[10rem] bg-zinc-950 mx-auto absolute top-[-4rem] blur-[100px] opacity-30 z-[1]"></div>
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-6xl font-bold tracking-tight max-w-[40rem] max-[372px]:text-5xl relative hero-heading">
            Focus. Flow. Achieve <p className='text-green-200'>With</p>
          </h1>
          <p className="text-md opacity-80 max-w-[30rem] w-full relative">
            <Netflow />
          </p>
          <div className="flex flex-wrap gap-3 p-2">
            <Link
              href={'/sign-up'}
              className="px-4 py-2 bg-white dark:border-gray-700 rounded-md text-black font-medium text-[14px] grow"
            >
              Get Started
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-zinc-950 rounded-md text-white border border-white border-opacity-10 font-medium text-[14px] grow"
            >
              Pricing
            </Link>
          </div>
        </div>
        <div className="relative rounded-xl">
          <div className="h-[15rem] bg:[10rem] bg-black mx-auto absolute top-[-4rem] blur-[100px] opacity-20"></div>
          <div className="rounded-[inherit] [border:calc(1.9*1px)_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]  absolute inset-0 rounded-inherit border-2 border-transparent !mask-clip-padding-box-border-box after:absolute after:aspect-square after:w-[50px] lg:after:w[100px] after:animate-animatedBeam after:bg-gradient-to-l after:from-purple-500 after:via-purple-950 after:to-transparent after:[offset-anchor:90%_50%] after:[offset-path:rect(0_auto_auto_0_round_250px)]"></div>
          <Image
            width={1920}
            height={1920}
            src={mindmaps}
            alt="Hero Image"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>
    </>
  );
};

export default Hero