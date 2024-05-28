import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"



const ChangeLogs = () => {
    return (
        <Drawer>
            <DrawerTrigger className="text-blue-500 flex flex-col-2">version 4.5.6
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>The ChangeLogs</DrawerTitle>
                </DrawerHeader>
                {/* <DrawerDescription className='text-xl font-bold'>Version 4.5.6 - 03/01/2024</DrawerDescription> */}
                <DrawerFooter>
                    <DrawerDescription className='text-xl font-bold'>Version 4.5.6 - 03/03/2024</DrawerDescription>
                    
                    <div className="flex items-center -ml-1">
                        <div className="relative flex h-3 w-3 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </div>
                        <div className="gid grid-cols-2">
                            Bytona Services

                            <Badge className="ml-1" variant={"outline"}>In progress</Badge>
                        </div>
                    </div>

                    <div className="flex items-center -ml-1">
                        <div className="relative flex h-3 w-3 mr-2">
                            {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span> */}
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                        </div>
                        <div className="gid grid-cols-2">
                            Integrate Arabic language

                            <Badge className="ml-1" variant={"outline"}>Bug</Badge>
                        </div>
                    </div>
                    <li>UI Enhancement: Add tables in statistics</li>
                    <li>Performance Improvement: Optimized page load times for statistics details.</li>

                    <DrawerDescription className='text-xl font-bold'>Version 4.5.5 - 29-12-2023</DrawerDescription>
                    <li>New Feature: Introducing Advanced Property Search with custom filters.</li>
                    <li>UI Enhancement: Revamped property listing cards for a more user-friendly experience.</li>
                    <li>Performance Improvement: Optimized page load times for property details.</li>
                    <DrawerClose>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default ChangeLogs
