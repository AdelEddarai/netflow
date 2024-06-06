
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronRight } from "lucide-react";
import { ComboboxDropdownMenu } from '../changlog/Compbox';
import ChangeLogs from '../changlog/ChangeLog';
import { ThemeSwitcher } from '@/components/switchers/ThemeSwitcher';



const footerLinks = [
  {
    title: "Product",
    links: [
      { title: "AI", url: "https://inke.app" },
      { title: "What's new", url: "/buy" }
    ],
  },
  {
    title: "Policies",
    links: [
      { title: "Privacy", url: "/privacy" },
      { title: "Terms of use", url: "/terms" },
      // { title: "Cookie Preferences", url: "https://example.com/cookie-preferences" }
    ],
  },
  { title: "Support", links: [
      { title: "Contact us", url: "/contact" },
      { title: "FAQs", url: "/Blogs/stats" }
    ],
  },
];

export const Footer: React.FC = () => {

  return (
    <>
    <footer className="border-t lg:py-10 mt-4">
      <div className=" w-full max-w-none px-5 text-sm sm:max-w-[90%] sm:px-0 2xl:max-w-7xl">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] items-stretch justify-between gap-y-10 sm:gap-x-6 md:flex md:flex-wrap">
          <div className="col-span-full">
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-2.5">
              <h3 className="mb-1 text-sm font-semibold lg:text-sm">
                {section.title}
              </h3>

              {section.links.map((link) => (
                <a
                  key={link.title}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground duration-200 hover:text-foreground"
                >
                  {link.title}
                </a>
              ))}
            </div>
          ))}
        </div>


        <div className="mt-8 flex items-center justify-between lg:mt-12 ">
          <div className="flex flex-col text-muted-foreground lg:ml-44">
            <div className='flex items-center mt-2 lg:ml-32'>
              <Popover>
                <PopoverTrigger>
                  <ComboboxDropdownMenu />
                </PopoverTrigger>
                <PopoverContent>
                  <h3 className='text-muted-foreground'>All System is working</h3>
                  <div className='flex flex-col-2'>
                    <ChangeLogs />
                    <ChevronRight className="h-4 w-4 mt-1" />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="lg:ml-32 p-1">
              <span>
                &copy; {new Date().getFullYear()} SpaceFlow.
              </span>{" "}
              <span>
                Illustrations by{" "}
                <a
                  href="https://bytonatech.vercel.app"
                  className="underline underline-offset-4 transition-colors hover:text-foreground"
                >
                  bytonatech.
                </a>
              </span>
            </div>
          </div>

          <div className="mb-4 md:block hidden">
		  <ThemeSwitcher alignHover='end' alignDropdown='end' size={'icon'} variant={'outline'} />
          </div>
        </div>

        {/* <div className="flex items-center mt-2 lg:ml-44">
          <div className="relative flex h-3 w-3 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </div>
          <div>
            All system are normal
          </div>
        </div> */}

      </div>
    </footer>
    </>
  );
}

